sys = require "sys"
util = require "util"

TwerpTest = require( "../../lib/twerptest" ).TwerpTest
Runner = require( "../runner" ).Runner

class exports.Simple extends Runner
  @current_filename = null

  display: ( filename, classname, results ) ->
    unless filename is @current_filename
      util.puts ( @current_filename = filename ) + ":"

    util.puts " * #{classname}:"
    for test, res of results
      sys.print "    #{test}: "

      # red/green might be no-op if no-colour set
      extra = if res.failed > 0
        @red "#{res.failed}/#{res.count} failed"
      else
        @green "#{res.passed}/#{res.count} passed"

      util.puts "#{extra}."
