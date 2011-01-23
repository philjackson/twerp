assert = require "assert"
TwerpTest = require( "../lib/twerptest" ).TwerpTest

class TwerpItself extends TwerpTest
  testClassCreation: ( ) ->
    this.expected 2, true

    this.ok 1

test = new TwerpItself()
test.run( test.display )
