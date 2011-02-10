# grab the args we want

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

cwd = process.cwd()

options = parseopts( process.ARGV.slice 2 )
runner = new Simple()

# load the files into the runner
runner.loadFile "#{cwd}/#{file}" for file in options.arguments
runner.run()
