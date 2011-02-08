sys = require "sys"
TwerpTest = require( "../../lib/twerptest" ).TwerpTest
Runner = require( "../runner" ).Runner

class Simple extends Runner
  display: ( res ) ->
    console.log res

s = new Simple()
s.loadFile "../blah"
s.run()
s.display()
