TwerpTest = require( "../lib/twerptest" ).TwerpTest
Runner    = require( "../lib/runner" ).Runner
assert    = require( "../vendor/assert-extras" )

runner = new Runner( { }, [ "./test/simpletestclass.coffee" ] )

assert.ok runner

all_results = { }
runner.display = ( filename, classname, results ) ->
  assert.equal filename, "./test/simpletestclass.coffee"
  all_results[ classname ] = results

ran_finished = false
runner.run ( ) ->
  # Simple test
  assert.ok simpletest = all_results.SimpleTest
  assert.ok simpletest.testSimpleOne

  # counts
  assert.equal simpletest.testSimpleOne.passed, 1
  assert.equal simpletest.testSimpleOne.failed, 1
  assert.equal simpletest.testSimpleOne.count, 2

  # other tests
  others = [ "testSimpleTwo"
             "testSimpleThree"
             "testSimpleFour"
             "testSimpleFour" ]
  assert.ok simpletest[ test_name ] for test_name in others

  # Simple test
  assert.ok anothersimpletest = all_results.AnotherSimpleTest
  assert.ok anothersimpletest.testAnotherSimpleOne

  ran_finished = true

assert.ok ran_finished, "finished ran"