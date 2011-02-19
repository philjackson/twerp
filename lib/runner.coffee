class exports.Runner
  constructor: ( @options, filenames ) ->
    # colour output if we're allowed
    if @options.noColor or @options.noColour
      @cNorm = @cRed = @cGreen = ""
    else
      @cNorm  = "\u001B[39m"
      @cRed   = "\u001B[31m"
      @cGreen = "\u001B[32m"

    # will contain a list of classes to run
    @queue  = [ ]

    # not loaded yet
    @coffee_loaded = false

    # load the files we're given
    @loadFile f for f in filenames

  green: ( text ) => "#{@cGreen}#{text}#{@cNorm}"
  red:   ( text ) => "#{@cRed}#{text}#{@cNorm}"

  getNext: ( ) -> @queue.shift( )

  run: ( @finished ) ->
    if current = @getNext( )
      @runClass current

  onPass: ( ) ->
  onFail: ( e ) ->

  runClass: ( [ filename, cls, func ] ) ->
    next = @getNext( )
    obj  = new func( @options )

    # stuff a runner implementor might override.
    obj.on "pass", @onPass
    obj.on "fail", @onFail

    do ( next ) =>
      obj.run ( results ) =>
        @display filename, cls, results

        # if the user put exit-on-failure on the commandline then
        # here's the place to bail
        if @options[ "ExitOnFailure" ]
          for test, details of results
            if details.failed > 0
              process.exit 1

        # unless we're the last, daisy chain to the next function
        if next
          @runClass next
        else
          @finished?( )

  loadFile: ( filename ) ->
    cwd = process.cwd()

    # find a coffee script, load coffee. If the require throws an
    # exception then so be it.
    if /\.coffee$/.exec( filename ) and not @coffee_loaded
      require "coffee-script"
      @coffee_loaded = true

    actual = if /^\//.exec filename
      filename
    else
      "#{cwd}/#{filename}"

    for cls, func of require actual
      # only run the class we were asked to
      if @options.matchClass
        re = new RegExp @options.matchClass
        continue unless re.exec cls

      # if it's a test, queue it
      if func.isTwerpTest
        @queue.push [ filename, cls, func ]

    return true
