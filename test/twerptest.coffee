assert = require "assert"
TwerpTest = require( "../lib/twerptest" ).TwerpTest

torn_down = 0

class TwerpItself extends TwerpTest
  setup: ( ) ->
    this.setup_has_run = 1

  testClassCreation: ( ) ->
    f = ( x ) => this.ok x
    setTimeout f, 500, 1

    this.equal torn_down, 0
    this.equal @setup_has_run, 1
    this.ok 1
    this.equal 1, 2

    this.done 5, true

  teardown: ( ) ->
    torn_down = 1

test = new TwerpItself null, null, ( res ) ->
  # five expected
  assert.equal res.testClassCreation.expected, 5

  # one failure
  assert.equal res.testClassCreation.failed, 1

  # three passes
  assert.equal res.testClassCreation.passed, 4

  # one error
  assert.equal res.testClassCreation.errors.length, 1

  # torn down (note the test in the actual class)
  assert.equal torn_down, 1

test.run()
