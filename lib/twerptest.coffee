EE     = require( "events" ).EventEmitter
assert = require "../vendor/assert-extras"
path   = require "path"

class exports.TwerpTest
  @isTwerpTest = true

  constructor: ( @options ) ->
    @queue = this.gatherRunnables()
    @_tests = { }

    # emitter for failures/passes
    @ee = new EE()
    @on = @ee.on
    @emit = @ee.emit

  start: ( callback ) -> callback( )
  setup: ( callback ) -> callback( )
  teardown: ( callback ) -> callback( )
  done: ( ) ->

  getNext: ( ) -> @queue.shift( )

  run: ( @finished_callback ) ->
    if current = @getNext( )
      @runTest current

  runTest: ( [ name, capture ] ) ->
    next_test = @getNext( ) or [ "done", false ]

    do ( next_test, capture ) =>
      if previous_name = @current
        @emit "endTest", previous_name, @_tests[ previous_name ]
        @current = null

      # capture the results if we're asked to (results won't be caught
      # for setup, teardown or done
      if capture
        @_tests[ name ] or= { }
        @current = name
        @emit "startTest", name

      try
        this[ name ] ( expected ) =>
          # log the expected (if we allowed it above)
          @_tests[ name ]?.expected = expected

          # run the next one
          @runTest next_test
      catch error
        @emit "fail", error

  finish: ( ) ->
    @finished_callback( @_tests )

  gatherRunnables: ( ) ->
    runnables = [[ "start", false ]]

    # first, grab the setup/teardown functions
    setups    = [ ]
    teardowns = [ ]

    for prop, func of this
      setups.push prop    if /^setup./.exec prop
      teardowns.push prop if /^teardown./.exec prop

    for prop, func of this
      continue unless /^test/.exec prop

      # only run the class we were asked to
      if @options.matchFunction
        re = new RegExp @options.matchFunction
        continue unless re.exec prop

      # wrap our test method with all of the setup and teardown
      # functions we found earlier.
      runnables.push [ "setup",    false ]
      runnables.push [ setup,      false ] for setup in setups
      runnables.push [ prop,       true  ]
      runnables.push [ teardown,   false ] for teardown in teardowns
      runnables.push [ "teardown", false ]

    # once the entire class is done we need to let the runner know so
    # that it can run the next class
    runnables.push [ "finish", false ]

    return runnables

# we export these simply for ease of documentation generation
exports.assert_functions =
  "From assert.js": [
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
  ]

  "From assert-extras.js": [
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
    "isNotEnumerable"
  ]

  "From twerp itself": [
    "isEmptyArray"
  ]

for desc, func_list of exports.assert_functions
  for func in func_list
    do ( func ) ->
      exports.TwerpTest::[ func ] = ( args... ) ->
        errored = false

        try
          assert[ func ].apply this, args
          if cur = @_tests[ @current ]
            cur.passed or= 0
            cur.passed++
          @emit "pass"
        catch e
          # add any errors to the error array
          if cur = @_tests[ @current ]
            cur.failed = ( cur.errors or= [ ] ).push e

          @emit "fail", e
          errored = true
        finally
          # increase the total run count
          if cur = @_tests[ @current ]
            cur.count or= 0
            cur.count++

          # if the user put exit-on-failure on the commandline then
          # here's the place to bail
          if errored and @options[ "exitOnFailure" ]
            @emit "endTest", @current, cur
            process.exit 1

# twerp's own assertions
assert.isEmptyArray = ( array, message ) ->
  if not array instanceof Array or array.length isnt 0
    @fail array, [], message, "!="
