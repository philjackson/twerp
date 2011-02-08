EE = require( "events" ).EventEmitter
assert = require "assert"

class exports.TwerpTest
  @isTwerpTest = true

  constructor: ( ) ->
    @ee = new EE()

    # pass over the on method (TODO: is this the idomatic way of doing
    # this?)
    @on = @ee.on
    @emit = @ee.emit

  setup: ( ) ->
  teardown: ( ) ->

  done: ( expected, wait ) =>
    current  = @run_tests[ @current ]
    total    = current.total

    # let a runner know we're done
    current.expected = expected

    if total < expected
      if wait
        setTimeout this.done, 100, expected, wait
        return false
      else
        throw new Error "Ran #{total} which is less than #{expected}."
    else if total > expected
      throw new Error "Ran #{total} which is more than #{expected}."
    else
      # we're actually done!
      this.teardown()

      # get results back
      this.emit "done", @current, current

  run: ( ) ->
    for prop, func of this
      continue unless /^test[_ A-Z]/.exec prop

      # used by the assertion functions
      @current = prop

      # setup the object for holding run assertions
      @run_tests or= { }
      @run_tests[ @current ] =
        failed: 0
        passed: 0
        total: 0

      this.setup()
      this[ @current ]()

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
      try
        assert[ func ].apply this, args
        @run_tests[ @current ].passed++
      catch e
        @run_tests[ @current ].failed++
        ( @run_tests[ @current ].errors or= [ ] ).push e
      finally
        @run_tests[ @current ].total++
