util = require "util"

TwerpTest = require( "../../lib/twerptest" ).TwerpTest
Runner = require( "../runner" ).Runner

class exports.Simple extends Runner
  onStartFile: ( filename ) -> util.puts "#{filename}:"
  onStartClass: ( classname ) -> util.puts "  #{classname}:"
  onEndClass: ( classname ) ->

  onStartTest: ( testname ) -> util.print "    #{testname}: "
  onEndTest: ( testname, res ) =>
    msg = " #{res.passed}/#{res.count} passed"
    if res.expected
      bad_count = res.expected isnt res.count
      colour = if bad_count then @red else @green

      msg += " (#{colour res.expected} expected#{'!' if bad_count})"

    util.puts "#{msg}."

  onAssertionPass: ( ) => util.print @green "."
  onAssertionFail: ( e ) =>
    spcr = "\n      "
    errs = e.stack.split( "\n" )
    errs[0] = @red errs[0]

    util.print "#{spcr}#{errs.join( spcr )}"

  onRunEnd: ( summary ) =>
    util.puts "Time taken: #{summary.time}"
    util.puts "Passed:     #{summary.passed}"
    util.puts "Failed:     #{summary.failed}"
