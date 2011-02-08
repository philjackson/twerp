sys = require "sys"
TwerpTest = require( "../../lib/twerptest" ).TwerpTest
Runner = require( "../runner" ).Runner

class Simple extends Runner
  display: ( name, res ) ->
    console.log name, res

s = new Simple()
s.loadFile "../blah"
s.run()
