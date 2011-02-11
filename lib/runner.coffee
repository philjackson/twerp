class exports.Runner
  constructor: ( @options ) ->
    @cNorm  = "\u001B[39m"
    @cRed   = "\u001B[31m"
    @cGreen = "\u001B[32m"

    @alltests = { }
    @results = { }

    @options or= { }

  green: ( text ) ->
    "#{@cGreen}#{text}#{@cNorm}"

  red: ( text ) ->
    "#{@cRed}#{text}#{@cNorm}"

  loadFile: ( filename ) ->
    cwd = process.cwd()

    for cls, func of require "#{cwd}/#{filename}"
      # if it's a test, queue it
      if func.isTwerpTest
        @alltests[ filename ] or= { }
        @alltests[ filename ][ cls ] = new func filename

  run: ( ) ->
    for filename, tests of @alltests
      for cls, test of tests
        test.on "done", this.display
        test.run( )
