# Twerp

Really simple, class based testing framework for node and
Coffeescript.

## Synopsis

    npm install twerp

Written with coffeescript in mind so a really simple example use might
be:
    { TwerpTest }    = require "twerp"

    class exports.SimpleTest extends TwerpTest
      testSomethingSimple: ( done ) ->
        @ok 1

        # the optional message will help you when debugging failures
        @ok null, "Test that null is true"

        done( 2 )

      "test something else simple": ( done ) ->
        @equal 1, 2

        done( 1 )

    class exports.AnotherSimpleTest extends TwerpTest
      "test stuff works as one might expect": ( done ) ->
        @isNull null
        @equal 1, 3 - 2, "Three minus two is one"

        done( 2 )

Then run with 'twerp' (you can run coffee directly) and you're off:

    $ twerp blah.js

## Writing tests

To build a test class you need to create a file containing at least
one class which inherits from TwerpTest.

Any methods defined in your class which begin with "test" will be run
as tests. Other than tests starting with "setup" or "teardown" you can
call 'private' methods what you want. The callback received by each
method must be called when it's finished and should also take the
number of tests you expected to run.

Any methods that begin with "setup" will run before each test method
and any that start with 'teardown' will run after each test
method. `setup` will always run before other setup functions and
`teardown` will always run before other teardown methods. The others
will run in alphabetical order. So for example, with a class that
looks like this:

    class Hello
      "teardown webserver":
      teardown:
      setup:
      testOne:
      "setup database":
      "setup controllers":
      "setup application":
      testTwo:

The execution order will be:

 * setup
 * setup application
 * setup controllers
 * setup database
 * testOne
 * teardown
 * teardown webserver
 * setup
 * setup application
 * setup controllers
 * setup database
 * testTwo
 * teardown
 * teardown webserver

Tests will be run in order. No async magic here.

### Choosing a runner

You can pick a runner (how the code is formatted) by using --runner=
on the command line. For a list of available runners use --help.

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

 * --help: Help!
 * --exit-on-failure: Exit as soon as a class fails.
 * --no-colour: Turn off colour output.
 * --no-color: Turn off colour output if you're American.
 * --match-class: Only run classes whose names match STRING.
 * --match-function: Only run functions whose names match STRING.
 * --runner: How output should be formatted. --help for a list.

