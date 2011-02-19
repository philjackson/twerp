assert    = require( "../vendor/assert-extras" )
TwerpTest = require( "../lib/twerptest" ).TwerpTest

class TwerpItself extends TwerpTest
  setup: ( done ) ->
    @tornDown       = { }
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

  tearDown: ( done ) ->
    @tornDown[ @current ] = 1
    done( )

test = new TwerpItself { }

assert.deepEqual test.gatherRunnables( ), [
  [ "setup",    false ]
  [ "testOne",  true  ]
  [ "teardown", false ]
  [ "setup",    false ]
  [ "testTwo",  true  ]
  [ "teardown", false ]
  [ "finished", false ]]

# actually run the test

finished = [ ]

do ( finished ) ->
  test.run ( results ) ->
    finished.push true

    # testOne results
    assert.equal results.testOne.expected, 3
    assert.equal results.testOne.count, 2

    # testTwo results
    assert.equal results.testTwo.expected, 4
    assert.equal results.testTwo.count, 4

    # testTwo raises two errors
    assert.equal results.testTwo.errors.length, 2
    assert.equal results.testTwo.errors[0].message, "raise exception"
    assert.equal results.testTwo.errors[1].message, "another exception"

assert.equal finished.length, 1
