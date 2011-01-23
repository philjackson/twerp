assert = require "assert"

class exports.TwerpTest
  constructor: ( ) ->
  setup: ( ) ->
  teardown: ( ) ->

  display: ( results ) ->
    longest_test_name = 0

    for test, details of results
      if test.length > longest_test_name
        longest_test_name = test.length

    for test, details of results
      spaces = Array( longest_test_name - test.length + 2 ).join( " " )
      out =  "#{test}:#{spaces}#{details.passed}/#{details.expected } passed "
      out += "(#{details.failed} failed)"

      console.log out

  expected: ( count, wait=false ) ->
    @run_tests[ @current ].expected = count
    @run_tests[ @current ].wait = wait

  done: ( callback ) =>
    current  = @run_tests[ @current ]
    total    = current.total
    expected = current.expected

    if total < expected
      if current.wait is true
        setTimeout this.done, 100, callback
      else
        throw new Error "Ran #{total} which is less than #{expected}."
    else if total > expected
      throw new Error "Ran #{total} which is more than #{expected}."
    else
      # we're actually done!
      this.teardown()
      callback? and callback( @run_tests )

  run: ( callback ) ->
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

      try
        this[ prop ]()
      catch e
        @run_tests[ prop ].error = e

      # let the user know they need to call expected
      unless @run_tests[ @current ].expected?
        throw new Error "Make sure you call expected() for '#{@current}'"

      this.done callback

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
        throw e
      finally
        console.log this
        @run_tests[ @current ].total++
