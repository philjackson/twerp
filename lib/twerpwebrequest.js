var TwerpTest;
var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
  for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
  function ctor() { this.constructor = child; }
  ctor.prototype = parent.prototype;
  child.prototype = new ctor;
  child.__super__ = parent.prototype;
  return child;
}, __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
TwerpTest = require("./twerptest").TwerpTest;
exports.TwerpWebRequest = (function() {
  function TwerpWebRequest() {
    TwerpWebRequest.__super__.constructor.apply(this, arguments);
  }
  __extends(TwerpWebRequest, TwerpTest);
  TwerpWebRequest.port = 2000;
  TwerpWebRequest.host = "127.0.0.1";
  TwerpWebRequest.prototype.isRunning = function(app) {
    return app.fd;
  };
  TwerpWebRequest.prototype.stopServer = function(app) {
    if (!this.isRunning(app)) {
      throw new Error("No server to stop. ");
    }
    return app.close();
  };
  TwerpWebRequest.prototype.startServer = function(app, callback) {
    if (this.isRunning(app)) {
      throw new Error("Looks like you already have a running app.");
    }
    return app.listen(TwerpWebRequest.port, TwerpWebRequest.host, callback);
  };
  TwerpWebRequest.prototype.GET = function(app, url, headers, callback) {
    var client, req;
    if (!this.isRunning) {
      throw new Error("Do start the server before making requests of it.");
    }
    client = http.createClient(TwerpWebRequest.port, TwerpWebRequest.host);
    req = client.request("GET", url, headers);
    req.on("response", __bind(function(response) {
      var body;
      response.setEncoding("utf8");
      body = [];
      response.on("data", function(chunk) {
        return body.push(chunk);
      });
      return response.on("end", __bind(function() {
        var body_str;
        body_str = body.join("");
        return callback(body_str, response);
      }, this));
    }, this));
    return req.end();
  };
  return TwerpWebRequest;
})();