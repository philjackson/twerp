class exports.Runner
  constructor: ( @options, filenames ) ->
    # colour output if we're allowed
    if @options.noColor or @options.noColour
      @cNorm = @cRed = @cGreen = ""
    else
      @cNorm  = "\u001B[39m"
      @cRed   = "\u001B[31m"
      @cGreen = "\u001B[32m"
      @cYellow = "\u001B[33m"

    @total_failed = 0
    @total_passed = 0

    # will contain a list of classes to run
    @queue  = [ ]

    # not loaded yet
    @coffee_loaded = false

    # load the files we're given
    @loadFile f for f in filenames

    @start_time = Date.now( )

  green:  ( text ) => "#{@cGreen}#{text}#{@cNorm}"
  red:    ( text ) => "#{@cRed}#{text}#{@cNorm}"
  yellow: ( text ) => "#{@cYellow}#{text}#{@cNorm}"

  getNext: ( ) -> @queue.shift( )

  run: ( @finished ) ->
    if current = @getNext( )
      @runClass current

  onAssertionPass: ( ) ->
  onAssertionFail: ( error ) ->

  onStartTest: ( ) ->
  onEndTest: ( ) ->

  onStartClass: ( ) ->
  onEndClass: ( ) ->

  onStartFile: ( ) ->
  onEndFile: ( ) ->

  runClass: ( [ filename, cls, func ] ) ->
    next = @getNext( )

    if @current_filename isnt filename
      if @current_filename?
        @onEndFile @current_filename

      @onStartFile filename
      @current_filename = filename

    try
      obj  = new func( @options )
    catch error
      console.log( error.stack )
      return

    # stuff a runner implementor might override.
    obj.on "pass", ( ) =>
      @total_passed++
      @onAssertionPass( )

    obj.on "fail", ( error ) =>
      @total_failed++
      @onAssertionFail( error )

    obj.on "startTest", ( name ) => @onStartTest( name )
    obj.on "endTest", ( name, test ) => @onEndTest( name, test )

    @onStartClass cls

    do ( next, cls ) =>
      obj.run ( results ) =>
        @onEndClass cls, results

        # unless we're the last, daisy chain to the next function
        if next
          @runClass next
        else
          @onEndFile @current_filename
          @current_filename = null

          summary =
            passed: @total_passed
            failed: @total_failed
            time:   @calcTime( Date.now( ) - @start_time )

          @onRunEnd? summary
          @finished? results

  calcTime: ( ms ) ->
    if ms < 1000
      ms = ms.toFixed 2
      return "#{ms} ms"

    if ( secs = ( ms / 1000 ) ) < 60
      secs = secs.toFixed 2
      return "#{secs} secs"

    if ( mins = ( secs / 60 ) ) < 60
      mins = mins.toFixed 2
      return "#{mins} mins"

  loadFile: ( filename ) ->
    cwd = process.cwd()

    # find a coffee script, load coffee. If the require throws an
    # exception then so be it.
    if /\.coffee$/.exec( filename ) and not @coffee_loaded
      require "coffee-script/register"
      @coffee_loaded = true

    actual = if /^\//.exec filename
      filename
    else
      "#{cwd}/#{filename}"

    obj = require actual

    for cls, func of obj
      # only run the class we were asked to
      if @options.matchClass
        re = new RegExp @options.matchClass
        continue unless re.exec cls

      # if it's a test, queue it
      if func.isTwerpTest
        @queue.push [ filename, cls, func ]

    return true
