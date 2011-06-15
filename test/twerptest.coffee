assert    = require( "../vendor/assert-extras" )
TwerpTest = require( "../lib/twerptest" ).TwerpTest

class TwerpItself extends TwerpTest
  setup: ( done ) ->
    @have_run_setup = true

    done( )

  testOne: ( done ) ->
    @equal 1, 1
    @ok @have_run_setup
    @ok @have_run_second_setup

    @have_run_setup = false
    @have_run_second_setup = false

    @have_run_one = true

    done 4 # one more than really run

  testTwo: ( done ) ->
    @ok false, "raise exception"
    @equal 2, 2
    @ok null, "another exception"
    @ok @have_run_one

    @ok @have_run_setup
    @ok @have_run_second_setup

    @have_run_setup = false
    @have_run_second_setup = false

    done 6

  # this should never run
  invalidTest: ( ) ->

  "setup something else": ( done ) ->
    @have_run_second_setup = true
    done( )

test = new TwerpItself { }

assert.deepEqual test.gatherRunnables( ), [
  [ "start",                false ]
  [ "setup",                false ]
  [ "setup something else", false ]
  [ "testOne",              true  ]
  [ "teardown",             false ]
  [ "setup",                false ]
  [ "setup something else", false ]
  [ "testTwo",              true  ]
  [ "teardown",             false ]
  [ "finish",               false ]]

# actually run the test

finished = [ ]

do ( finished ) ->
  test.run ( results ) ->
    finished.push true

    # testOne results
    assert.equal results.testOne.expected, 4
    assert.equal results.testOne.count, 3

    # testTwo results
    assert.equal results.testTwo.expected, 6
    assert.equal results.testTwo.count, 6

    # testTwo raises two errors
    assert.equal results.testTwo.errors.length, 2
    assert.equal results.testTwo.errors[0].message, "raise exception"
    assert.equal results.testTwo.errors[1].message, "another exception"

assert.equal finished.length, 1

# test out the options
test = new TwerpItself
  matchFunction: "One"

do ( finished ) ->
  test.run ( results ) ->
    finished.push true

    # testTwo shouldn't run
    assert.isUndefined results.testTwo

assert.equal finished.length, 2
