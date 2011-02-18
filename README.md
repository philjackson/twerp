# Twerp

Really simple, class based testing framework for node.

## Synopsis

    npm install twerp

Written with coffeescript in mind so a really simple example use might
be:

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


Then run with 'twerp' (you can run coffee directly) and you're off:

    $ twerp blah.js

## Writing tests

To build a test class you need to create a file containing at least
one class which inherits from TwerpTest.

Any methods defined in your class which begin with "test" will be run
as tests. Other than "setup" or "teardown" you can call 'private'
methods what you want. The callback received by each method must be
called when it's finished and should also take the number of tests you
expected to run.

A 'setup' method will run before each test method and 'teardown' will
run after each test method.

Tests will be run in order. No async magic here.
