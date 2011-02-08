assert = require "assert"
TwerpTest = require( "../lib/twerptest" ).TwerpTest

class TwerpItself extends TwerpTest
  testOne: ( ) ->
    this.ok 1
    this.equal 1, 2

    this.done 2

  testTwo: ( ) ->
    f = ( x ) => this.ok x
    setTimeout f, 500, 1

    this.ok 1
    this.equal 1, 2

    this.done 3

  testThree: ( ) ->
    this.ok 2
    this.ok 1
    this.equal 1, 2

    this.done 3

test = new TwerpItself()

order = [ ]
test.on "done", ( cls, res ) ->
  order.push cls

  if cls is "testOne"
    assert.equal res.expected, 2

  else if cls is "testTwo"
    assert.equal res.expected, 3
    assert.equal res.failed, 1
    assert.equal res.passed, 2
    assert.equal res.errors.length, 1

  else if cls is "testThree"
    assert.equal res.expected, 3
    # make sure they all run and in order
    assert.deepEqual order, [ "testOne", "testTwo", "testThree" ]

test.run()
