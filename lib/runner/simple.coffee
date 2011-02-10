sys = require "sys"
util = require "util"

TwerpTest = require( "../../lib/twerptest" ).TwerpTest
Runner = require( "../runner" ).Runner

class exports.Simple extends Runner
  display: ( filename, name, res ) =>
    util.print "#{filename} - #{name}: "
    has_failed = res.failed > 0

    counts = if has_failed
      this.red "#{res.passed} / #{res.expected}"
    else
      this.green "#{res.passed} / #{res.expected}"

    sys.puts "#{counts} passed ( #{res.failed} failed )"

    if has_failed
      for error in res.errors
        sys.puts error.stack