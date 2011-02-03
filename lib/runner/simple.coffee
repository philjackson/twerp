sys = require "sys"
TwerpTest = require( "../../lib/twerptest" ).TwerpTest
Runner = require( "../runner" ).Runner

class Simple extends Runner
  display: ( ) ->
    for cls, funcs of @results
      sys.puts "#{cls}:"
      for func, res of funcs
        sys.puts "  #{func}: #{res.failed}/#{res.expected} " +
                 "failed (#{res.passed} passed)."
        if res.failed > 0
          for err in res.errors
            console.log "    " + err.stack.split( "\n" ).join( "\n    " )
