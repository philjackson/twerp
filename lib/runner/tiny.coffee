sys = require "sys"
util = require "util"

TwerpTest = require( "../../lib/twerptest" ).TwerpTest
Runner = require( "../runner" ).Runner

class exports.Tiny extends Runner
  onStartFile: ( filename )   => @filename = filename
  onStartClass: ( classname ) => @classname = classname
  onStartTest: ( testname )   => sys.print "#{@filename} #{@classname} #{testname}: "

  onEndFile: ( filename ) -> util.puts ""
  onEndTest: ( testname ) -> util.puts ""

  onAssertionPass: ( ) => sys.print @green "."
  onAssertionFail: ( e ) =>
    spcr = "\n      "
    errs = e.stack.split( "\n" )
    errs[0] = @red errs[0]

    util.print "#{spcr}#{errs.join( spcr )}"
