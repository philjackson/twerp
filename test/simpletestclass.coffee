TwerpTest = require( "../lib/twerptest" ).TwerpTest

class exports.SimpleTest extends TwerpTest
  testSimpleOne: ( done ) ->
    @ok 1
    @ok null

    done( 2 )

  testSimpleTwo: ( done ) ->
    @ok 1

    done( 1 )

  testSimpleThree: ( done ) ->
    @ok 1

    done( 1 )

  testSimpleFour: ( done ) ->
    @ok 1

    done( 1 )

  testSimpleFive: ( done ) ->
    @ok 1
    @ok 1
    @ok 1

    done( 3 )

class exports.AnotherSimpleTest extends TwerpTest
  testAnotherSimpleOne: ( done ) ->
    @ok 1
    @ok null

    done( 2 )
