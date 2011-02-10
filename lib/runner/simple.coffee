sys = require "sys"
TwerpTest = require( "../../lib/twerptest" ).TwerpTest
Runner = require( "../runner" ).Runner

class exports.Simple extends Runner
  display: ( filename, name, res ) ->
    sys.puts "#{filename}: #{name}"
