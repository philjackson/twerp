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
    var extra, res, test, _results;
    if (filename !== this.current_filename) {
      util.puts((this.current_filename = filename) + ":");
    }
    util.puts(" * " + classname + ":");
    _results = [];
    for (test in results) {
      res = results[test];
      sys.print("    " + test + ": ");
      extra = res.failed > 0 ? this.red("" + res.failed + "/" + res.count + " failed") : this.green("" + res.passed + "/" + res.count + " passed");
      _results.push(util.puts("" + extra + "."));
    }
    return _results;
  };
  return Simple;
})();