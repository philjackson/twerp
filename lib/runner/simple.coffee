sys = require "sys"
util = require "util"

TwerpTest = require( "../../lib/twerptest" ).TwerpTest
Runner = require( "../runner" ).Runner

class exports.Simple extends Runner
  onStartFile: ( filename ) -> util.puts "#{filename}:"
  onEndFile: ( filename ) -> util.puts ""

  onStartClass: ( classname ) -> util.puts "  #{classname}:"
  onEndClass: ( classname ) ->

  onStartTest: ( testname ) -> sys.print "    #{testname}: "
  onEndTest: ( testname, res ) ->
    util.puts " #{res.passed}/#{res.count} passed."

  onAssertionPass: ( ) => sys.print @green "."
  onAssertionFail: ( e ) =>
    spcr = "\n      "
    errs = e.stack.split( "\n" )
    errs[0] = @red errs[0]

    util.print "#{spcr}#{errs.join( spcr )}"