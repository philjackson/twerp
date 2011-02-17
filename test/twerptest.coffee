assert = require "assert"
TwerpTest = require( "../lib/twerptest" ).TwerpTest

class TwerpItself extends TwerpTest
  setup: ( done ) ->
    @have_run_setup = 1
    done( )

  testOne: ( done ) ->
    @ok @have_run_setup
    @have_run_one = 1
    done( )

  testTwo: ( done ) ->
    @ok @have_run_one
    done( )

  invalidTest : ( ) ->

test = new TwerpItself()

assert.deepEqual test.gatherRunnables( ), [
  "setup"
  "testOne"
  "teardown"
  "setup"
  "testTwo"
  "teardown" ]

test.run()
