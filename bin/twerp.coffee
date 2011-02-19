# grab the args we want

util   = require "util"
Simple = require( "../lib/runner/minimal" ).Minimal
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

parser.add "--match-class",
  type: "string"
  help: "Only run classes whose names match STRING."

parser.add "--match-function",
  type: "string"
  help: "Only run functions whose names match STRING."

try
  options = parser.parse( )
catch e
  parser.usage()
  process.exit 1

runner = new Simple options.options, options.arguments
runner.run( )
