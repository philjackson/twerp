sys = require "sys"
util = require "util"

TwerpTest = require( "../../lib/twerptest" ).TwerpTest
Runner = require( "../runner" ).Runner

class exports.Progress extends Runner
  onStartFile: ( file ) -> @file = file
  onStartClass: ( suite ) ->
    @suite = suite
    process.stderr.write "#{suite}\n"
    #process.stderr.flush()

  onEndClass: ( suite ) ->

  onStartTest: ( testName ) ->
    @testName = testName
    @testCount = 0
    @passCount = 0

  onEndTest: ( testName, res ) ->
    process.stderr.write "\n"

  onAssertionPass: ->
    @passCount++
    @testCount++
    @progress()

  progress: (e) ->
    if @passCount is @testCount
      status = "Success"
      color = @green
      colorName =  (str) -> str
      colorCounts =  (str) -> str
      background =  (str) -> str
      icon = "\u2713"
    else
      status = "FAILURE"
      color = @red
      background = (str) -> "\033[39;0;47m#{str}\033[39;0;48m"
      colorName =  (str) -> "\033[39;2;47m#{str}\033[39;0;47m"
      colorCounts =  (str) -> "\033[39;2;47m#{str}\033[39;0;47m"
      icon = "\u2718"

    testName = @testName.replace /^test:\s+/, ""
    summary = "(#{@passCount}/#{@testCount})"
    dotCount = 80 - testName.length - summary.length - 14
    dots = new Array(if dotCount < 0 then 0 else dotCount).join(".")
    out = "  #{background("#{color(icon)} #{colorName("#{testName} #{dots}")} (#{colorCounts(@passCount)}/#{colorCounts(@testCount)}) #{color(status)}")}\r"

    process.stderr.write out
    if e
      process.stderr.write "\n"
      process.stderr.write "  " + e.stack
      process.stderr.write "\n"
    #process.stderr.flush()

  onAssertionFail: ( e ) ->
    @testCount++
    @progress(e)

  onRunEnd: ( summary ) ->
    process.stderr.write "Time taken: #{summary.time}\n"
    process.stderr.write "Passed:     #{summary.passed}\n"
    process.stderr.write "Failed:     #{summary.failed}\n"
