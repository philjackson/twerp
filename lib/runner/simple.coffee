sys = require "sys"
util = require "util"

TwerpTest = require( "../../lib/twerptest" ).TwerpTest
Runner = require( "../runner" ).Runner

class exports.Simple extends Runner
  @current_filename = null

  display: ( filename, classname, results ) ->
    unless filename is @current_filename
      util.puts ( @current_filename = filename ) + ":"

    util.puts " #{classname}"
    for test, res of results
      colour = if has_failed = res.errors?
        @red
      else
        @green

      util.puts "  #{colour test}"