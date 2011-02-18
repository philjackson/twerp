var Runner, TwerpTest, sys, util;
var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
  for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
  function ctor() { this.constructor = child; }
  ctor.prototype = parent.prototype;
  child.prototype = new ctor;
  child.__super__ = parent.prototype;
  return child;
};
sys = require("sys");
util = require("util");
TwerpTest = require("../../lib/twerptest").TwerpTest;
Runner = require("../runner").Runner;
exports.Simple = (function() {
  function Simple() {
    Simple.__super__.constructor.apply(this, arguments);
  }
  __extends(Simple, Runner);
  Simple.current_filename = null;
  Simple.prototype.display = function(filename, classname, results) {
    var err, extra, res, test, _results;
    if (filename !== this.current_filename) {
      util.puts((this.current_filename = filename) + ":");
    }
    util.puts(" * " + classname + ":");
    _results = [];
    for (test in results) {
      res = results[test];
      sys.print("    " + test + ": ");
      _results.push(extra = (function() {
        var _i, _len, _ref, _results;
        if (res.failed > 0) {
          util.puts(this.red("" + res.failed + "/" + res.count + " failed:"));
          _ref = res.errors;
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            err = _ref[_i];
            _results.push(console.log(err.stack));
          }
          return _results;
        } else {
          return util.puts(this.green("" + res.passed + "/" + res.count + " passed"));
        }
      }).call(this));
    }
    return _results;
  };
  return Simple;
})();