TwerpTest = require( "../lib/twerptest" ).TwerpTest
Runner    = require( "../lib/runner" ).Runner
assert    = require( "../vendor/assert-extras" )

runner = new Runner( { }, [ "./test/simpletestclass.coffee" ] )

assert.ok runner

runner.run( )