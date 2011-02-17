assert = require "assert"
TwerpTest = require( "../lib/twerptest" ).TwerpTest

class TwerpItself extends TwerpTest
  setup: ( done ) ->
    @have_run_setup = 1

    done( )

  testOne: ( done ) ->
    @equal 1, 1
    @ok @have_run_setup
    @have_run_one = 1

    done( 3 ) # one more than really run

  testTwo: ( done ) ->
    @ok false, "raise exception"
    @equal 2, 2
    @ok null, "another exception"
    @ok @have_run_one

    done( 4 )

  # this should never run
  invalidTest: ( ) ->

test = new TwerpItself()

assert.deepEqual test.gatherRunnables( ), [
  [ "setup",    false ]
  [ "testOne",  true  ]
  [ "teardown", false ]
  [ "setup",    false ]
  [ "testTwo",  true  ]
  [ "teardown", false ]]

# actually run the test
test.run()

# testOne results
assert.equal test.tests.testOne.expected, 3
assert.equal test.tests.testOne.count, 2

# testTwo results
assert.equal test.tests.testTwo.expected, 4
assert.equal test.tests.testTwo.count, 4

# testTwo raises two errors
assert.equal test.tests.testTwo.errors.length, 2
assert.equal test.tests.testTwo.errors[0].message, "raise exception"
assert.equal test.tests.testTwo.errors[1].message, "another exception"