sys = require "sys"
util = require "util"

TwerpTest = require( "../../lib/twerptest" ).TwerpTest
Runner = require( "../runner" ).Runner

class exports.Tiny extends Runner
  onStartClass: ( classname ) => @classname = classname
  onStartTest: ( testname )   =>
    # strip the test part from the beginning
    if matches = /^test[ _]?(.+)$/.exec testname
      testname = matches[1]

    @current_test_count = 0
    @current_test = testname

  onEndTest: ( testname, res ) ->
    msg = "\r#{@classname}: #{@current_test}:"

    msg += if res.expected
      colour = if res.expected isnt res.count
        @red
      else
        @green

      " #{@green res.count} of #{colour res.expected}"

    util.puts "#{msg}"

  onAssertionPass: ( ) =>
    sys.print "\r#{@classname}: #{@current_test}: #{++@current_test_count} "

  onAssertionFail: ( e ) =>
    @current_test_count++
    sys.print "\r#{@classname}: #{@current_test}:"
    spcr = "\n      "
    errs = e.stack.split( "\n" )
    errs[0] = @red errs[0]

    util.print "#{spcr}#{errs.join( spcr )}\n"

  onRunEnd: ( summary ) =>
    util.puts "\nTime taken: #{summary.time}"
    util.puts "Passed:     #{summary.passed}"
    util.puts "Failed:     #{summary.failed}"
