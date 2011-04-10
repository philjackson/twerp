sys = require "sys"
util = require "util"

TwerpTest = require( "../../lib/twerptest" ).TwerpTest
Runner = require( "../runner" ).Runner

class exports.Tiny extends Runner
  onStartFile: ( filename )   => util.puts "#{filename}:"
  onStartClass: ( classname ) => @classname = classname
  onStartTest: ( testname )   => sys.print " #{@classname} #{testname}: "

  onEndTest: ( testname ) -> util.puts ""

  onAssertionPass: ( ) => sys.print @green "."
  onAssertionFail: ( e ) =>
    spcr = "\n      "
    errs = e.stack.split( "\n" )
    errs[0] = @red errs[0]

    util.print "#{spcr}#{errs.join( spcr )}"

  onRunEnd: ( summary ) =>
    util.puts "Time taken: #{summary.time}"
    util.puts "Passed:     #{summary.passed}"
    util.puts "Failed:     #{summary.failed}"
