TwerpTest = require( "./twerptest" ).TwerpTest

class exports.TwerpWebRequest extends TwerpTest
  @port = 2000
  @host = "127.0.0.1"

  isRunning: ( app ) -> app.fd

  stopServer: ( app ) ->
    unless @isRunning app
      throw new Error "No server to stop. "

    app.close( )

  startServer: ( app, callback ) ->
    if @isRunning app
      throw new Error "Looks like you already have a running app."

    app.listen TwerpWebRequest.port, TwerpWebRequest.host, callback

  GET: ( app, url, headers, callback ) ->
    unless @isRunning
      throw new Error "Do start the server before making requests of it."

    client  = http.createClient( TwerpWebRequest.port, TwerpWebRequest.host )

    req = client.request "GET", url, headers;

    req.on "response", ( response ) =>
      response.setEncoding( "utf8" )

      body = [ ]
      response.on "data", ( chunk ) -> body.push( chunk )

      response.on "end", ( ) =>
        body_str = body.join ""

        callback body_str, response

    req.end( )
