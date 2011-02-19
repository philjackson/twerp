# grab the args we want

util   = require "util"
Simple = require( "../lib/runner/simple" ).Simple
sys    = require "sys"
OptionParser = require( "../vendor/parseopt" ).OptionParser

parser = new OptionParser
parser.add "--exit-on-failure",
  type: "flag"
  help: "Exit as soon as a class fails."

parser.add "--no-colour",
  type: "flag"
  help: "Turn off colour output."

parser.add "--no-color",
  type: "flag"
  help: "Turn off colour output if you're American."

try
  options = parser.parse( )
catch e
  parser.usage()
  process.exit 1

runner = new Simple options.options, options.arguments
runner.run( )
