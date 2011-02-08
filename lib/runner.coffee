class exports.Runner
  constructor: ( ) ->
    @tests = { }
    @results = { }

    @cNorm  = "\u001B[39m"
    @cRed   = "\u001B[31m"
    @cGreen = "\u001B[32m"

  green: ( text ) ->
    "#{@cGreen}#{text}#{@cNorm}"

  red: ( text ) ->
    "#{@cRed}#{text}#{@cNorm}"

  loadFile: ( filename ) ->
    for cls, func of require filename
      # if it's a test, queue it
      if func.isTwerpTest
        do ( cls ) =>
          @tests[ cls ] = new func

  run: ( ) ->
    for cls, test of @tests
      test.on "done", this.display
      test.run( )
