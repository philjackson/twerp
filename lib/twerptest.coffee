EE     = require( "events" ).EventEmitter
assert = require "assert"
path   = require "path"

class exports.TwerpTest
  constructor: ( ) ->
    @isTwerpTest = true
    @queue       = this.gatherRunnables()
    @tests       = { }

  setup: ( callback ) -> callback( )
  teardown: ( callback ) -> callback( )
  done: ( ) ->

  getNext: ( ) -> @queue.shift( )

  run: ( ) ->
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

  gatherRunnables: ( ) ->
    runnables = [ ]

    for prop, func of this
      continue unless /^test[_ A-Z]/.exec prop
      runnables.push [ "setup",    false ],
                     [ prop,       true  ],
                     [ "teardown", false ]

    return runnables

# import the assertions from assert
assert_functions = [
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
  "ifError" ]

for func in assert_functions
  do ( func ) ->
    exports.TwerpTest.prototype[ func ] = ( args... ) ->
      try
        assert[ func ].apply this, args
      catch e
        # add any errors to the error array
        if cur = @tests[ @current ]
          ( cur.errors or= [ ] ).push e
      finally
        # increase the total run count
        if cur = @tests[ @current ]
          cur.count = if cur.count
            cur.count + 1
          else
            1
