TwerpTest = require( "../../lib/twerptest" ).TwerpTest

class exports.Simple
  constructor: ( ) ->
    @tests = { }
    @results = { }

  loadFile: ( filename ) ->
    for cls, func of require filename
      # if it's a test, queue it
      if func.isTwerpTest
        do ( cls ) =>
          @tests[ cls ] = new func null, null, ( res ) =>
            @results[ cls ] = res

  run: ( ) ->
    for cls, test of @tests
      test.run()

s = new exports.Simple()
s.loadFile "../../blah"
s.run()
console.log s.results
