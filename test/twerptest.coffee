assert = require "assert"
TwerpTest = require( "../lib/twerptest" ).TwerpTest

class TwerpItself extends TwerpTest
  testClassCreation: ( ) ->
    this.expected 1, true

    f = ( x ) => this.ok x
    setTimeout f, 1000, 1

    this.ok 1

test = new TwerpItself()
test.run( test.display )
