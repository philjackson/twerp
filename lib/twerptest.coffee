EE     = require( "events" ).EventEmitter
assert = require "assert"
path   = require "path"

class exports.TwerpTest
  constructor: ( ) ->
    @isTwerpTest = true
    @queue       = this.gatherRunnables()

  setup: ( callback ) -> callback( )
  teardown: ( callback ) -> callback( )
  done: ( ) ->

  getNext: ( ) -> @queue.shift( )

  run: ( ) ->
    if current = @getNext()
      @runTest current

  runTest: ( test_name ) ->
    next_name = @getNext() or "done"

    do ( next_name ) =>
      this[ test_name ] ( count ) =>
        @runTest( next_name )

  gatherRunnables: ( ) ->
    runnables = [ ]

    for prop, func of this
      continue unless /^test[_ A-Z]/.exec prop
      runnables.push "setup", prop, "teardown"

    return runnables

assert_functions = [
  "fail",
  "ok",
  "equal",
  "notEqual",
  "deepEqual",
  "notDeepEqual",
  "strictEqual",
  "notStrictEqual",
  "throws",
  "doesNotThrow",
  "ifError" ]

for func in assert_functions
  do ( func ) ->
    exports.TwerpTest.prototype[ func ] = ( args... ) ->
      assert[ func ].apply this, args
