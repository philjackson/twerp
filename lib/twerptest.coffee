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
        @ready = false
        setTimeout this.done, 100, expected, wait
        return @ready
      else
        throw new Error "Ran #{total} which is less than #{expected}."
    else if total > expected
      throw new Error "Ran #{total} which is more than #{expected}."
    else
      @ready = true

      # get results back
      this.emit "done", @current, current

      # we're actually done!
      this.teardown()

  individualRun: ( prop ) =>
    unless @ready
      setTimeout this.individualRun, 100, prop
      return @ready

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

  run: ( ) ->
    @ready = true

    for prop, func of this
      continue unless /^test[_ A-Z]/.exec prop

      this.individualRun( prop )

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
