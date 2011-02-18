# grab the args we want

util   = require "util"
Simple = require( "../lib/runner/simple" ).Simple

parseopts = ( options ) ->
  switches = [ ]
  args     = [ ]

  stop_taking_switches = false

  for option in options
    if stop_taking_switches or not /^--/.exec option
      args.push option
    else
      if matches = /^--(\S+)/.exec option
        switches.push matches[1]
      else if /^--/.exec option
        stop_taking_switches = true

  return { switches:  switches, arguments: args }

options = parseopts( process.ARGV.slice 2 )

getRunnerOpts = ( options ) ->
  runner_options = { }

  valid_switches =
    "exit-on-failure": [ true, "Exit as soon as a class fails." ]

  for swtch in options.switches
    if details = valid_switches[ swtch ]
      runner_options[ swtch ] = details[0]
    else
      util.puts "Don't know about '#{swtch}'."
      process.exit 1

   return runner_options

runner = new Simple getRunnerOpts( options ), options.arguments
runner.run( )
