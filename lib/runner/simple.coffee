TwerpTest = require( "../../lib/twerptest" ).TwerpTest

class exports.Simple
  loadFile: ( filename ) ->
    for cls, func of require filename
      # is it a test?
      @tests[ cls ] = func if func.isTwerpTest

s = new exports.Simple()
s.loadFile( "../../test/twerptest" )
