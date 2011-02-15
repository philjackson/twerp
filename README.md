# Twerp

Really simple, class based testing framework for node.

## Synopsis

    npm install twerp

Written with coffeescript in mind so a really simple example use might
be:

    require "twerp"

    class Numbers extends TwerpTest
      testOne: ( ) ->
        this.ok 1, "One is ok."
        this.equal 1, ( 2 - 1 ), "One is equal to 2 - 1"

        # we expect two tests to have run, done will wait until two
        # tests have run
        done 2

Then compiled with coffee and run with the bundled twerp binary will
produce:

    blah.js: Numbers - testOne: 2 / 2 passed ( 0 failed )

## Writing tests

To build a test class you need to create a file containing at least
one class which inherits from TwerpTest.

Any methods defined in your class which begin with "test" will be run
as tests. Other than "setup" or "teardown" you can call 'private'
methods what you want.

A 'setup' method will run before each test method and 'teardown' will
run after each test method.
