assert = require "assert"
TwerpTest = require( "../lib/twerptest" ).TwerpTest

class TwerpItself extends TwerpTest
  testClassCreation: ( ) ->
    f = ( x ) => this.ok x
    setTimeout f, 1500, 1

    this.ok 1
    this.equal 1, 2

    this.done 3, true

test = new TwerpItself null, null, console.log
test.run()
