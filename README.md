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

### Assertion functions

Bundled with twerp are the following assert functions:

#### As with assert.js

 * fail
 * ok
 * equal
 * notEqual
 * deepEqual
 * notDeepEqual
 * strictEqual
 * notStrictEqual
 * throws
 * doesNotThrow
 * ifError

#### As with assert-extras

 * isNull
 * isNotNull
 * isTypeOf
 * isNotTypeOf
 * isObject
 * isFunction
 * isString
 * isBoolean
 * isNumber
 * isUndefined
 * isNotUndefined
 * isArray
 * isNaN
 * isNotNaN
 * match
 * noMatch
 * isPrototypeOf
 * isNotPrototypeOf
 * isWritable
 * isNotWritable
 * isConfigurable
 * isNotConfigurable
 * isEnumerable
 * isNotEnumerable

# options

 * --exit-on-failure: Exit as soon as a class fails.
 * --no-colour: Turn off colour output.
 * --no-color: Turn off colour output if you're American.
 * --match-class: Only run classes whose names match STRING.
 * --match-function: Only run functions whose names match STRING.
