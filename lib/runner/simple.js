var Runner, TwerpTest, sys, util;
var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; }, __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
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
    this.display = __bind(this.display, this);;    Simple.__super__.constructor.apply(this, arguments);
  }
  __extends(Simple, Runner);
  Simple.prototype.display = function(filename, classname, name, res) {
    var counts, error, has_failed, only_failures, _i, _len, _ref, _results;
    has_failed = res.failed > 0;
    only_failures = this.options.only_output_failures;
    if ((only_failures && has_failed) || !only_failures) {
      util.print("" + filename + ": " + classname + " - " + name + ": ");
      counts = has_failed ? this.red("" + res.passed + " / " + res.expected) : this.green("" + res.passed + " / " + res.expected);
      sys.puts("" + counts + " passed ( " + res.failed + " failed )");
      if (has_failed) {
        _ref = res.errors;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          error = _ref[_i];
          _results.push(sys.puts(error.stack));
        }
        return _results;
      }
    }
  };
  return Simple;
})();