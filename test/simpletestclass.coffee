TwerpTest = require( "../lib/twerptest" ).TwerpTest

class exports.SimpleTest extends TwerpTest
  testSimpleOne: ( done ) ->
    @ok 1
    @ok null

    done( 2 )

  testSimpleTwo: ( done ) ->
    @ok 1

    done( 1 )

class exports.AnotherSimpleTest extends TwerpTest
  testAnotherSimpleOne: ( done ) ->
    @ok 1
    @ok null

    done( 2 )
