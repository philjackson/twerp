assert = require "assert"

class exports.TwerpTest
  constructor: ( @errcallback, @passcallback, @allcallback ) ->
  setup: ( ) ->
  teardown: ( ) ->

  done: ( expected, wait ) =>
    current  = @run_tests[ @current ]
    total    = current.total

    # let a displayer know we're done
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
      @allcallback?( @run_tests )

  run: ( ) ->
    this.setup()

    for prop, func of this
      continue unless /^test[_ A-Z]/.exec prop

      # used by the assertion functions
      @current = prop

      # setup the object for holding run assertions
      @run_tests or= { }
      @run_tests[ prop ] =
        failed: 0
        passed: 0
        total: 0

      this[ prop ]()

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
        @passcallback?( )
      catch e
        @run_tests[ @current ].failed++
        ( @run_tests[ @current ].errors or= [ ] ).push e
        @errcallback?( e )
      finally
        @run_tests[ @current ].total++
