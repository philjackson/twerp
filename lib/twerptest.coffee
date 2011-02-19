EE     = require( "events" ).EventEmitter
assert = require "../vendor/assert-extras"
path   = require "path"

class exports.TwerpTest
  @isTwerpTest = true

  constructor: ( @options ) ->
    @queue = this.gatherRunnables()
    @tests = { }

    # emitter for failures/passes
    @ee = new EE()
    @on = @ee.on
    @emit = @ee.emit

  setup: ( callback ) -> callback( )
  teardown: ( callback ) -> callback( )
  done: ( ) ->

  getNext: ( ) -> @queue.shift( )

  run: ( @finished_callback ) ->
    if current = @getNext( )
      @runTest current

  runTest: ( [ @current, capture ] ) ->
    next_test = @getNext( ) or [ "done", false ]

    do ( next_test, capture ) =>
      # capture the results if we're asked to (results won't be caught
      # for setup, teardown or done
      @tests[ @current ] or= { } if capture

      this[ @current ] ( expected ) =>
        # log the expected (if we allowed it above)
        @tests[ @current ]?.expected = expected

        # run the next one
        @runTest next_test

  finished: ( ) ->
    @finished_callback( @tests )

  gatherRunnables: ( ) ->
    runnables = [ ]

    for prop, func of this
      continue unless /^test[_ A-Z]/.exec prop

      # only run the class we were asked to
      if @options.matchFunction
        re = new RegExp @options.matchFunction
        continue unless re.exec prop

      runnables.push [ "setup",    false ],
                     [ prop,       true  ],
                     [ "teardown", false ]

    # once the entire class is done we need to let the runner know so
    # that it can run the next class
    runnables.push [ "finished", false ]

    return runnables

# import the assertions from assert
assert_functions = [
  # normal
  "fail"
  "ok"
  "equal"
  "notEqual"
  "deepEqual"
  "notDeepEqual"
  "strictEqual"
  "notStrictEqual"
  "throws"
  "doesNotThrow"
  "ifError"

  # extras
  "isNull"
  "isNotNull"
  "isTypeOf"
  "isNotTypeOf"
  "isObject"
  "isFunction"
  "isString"
  "isBoolean"
  "isNumber"
  "isUndefined"
  "isNotUndefined"
  "isArray"
  "isNaN"
  "isNotNaN"
  "match"
  "noMatch"
  "isPrototypeOf"
  "isNotPrototypeOf"
  "isWritable"
  "isNotWritable"
  "isConfigurable"
  "isNotConfigurable"
  "isEnumerable"
  "isNotEnumerable" ]

for func in assert_functions
  do ( func ) ->
    exports.TwerpTest.prototype[ func ] = ( args... ) ->
      try
        assert[ func ].apply this, args
        if cur = @tests[ @current ]
          cur.passed or= 0
          cur.passed++
        @emit "pass"
      catch e
        # add any errors to the error array
        if cur = @tests[ @current ]
          cur.failed = ( cur.errors or= [ ] ).push e
        @emit "fail", e
      finally
        # increase the total run count
        if cur = @tests[ @current ]
          cur.count or= 0
          cur.count++
