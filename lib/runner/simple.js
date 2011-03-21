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
    this.onRunEnd = __bind(this.onRunEnd, this);;
    this.onAssertionFail = __bind(this.onAssertionFail, this);;
    this.onAssertionPass = __bind(this.onAssertionPass, this);;
    this.onEndTest = __bind(this.onEndTest, this);;    Simple.__super__.constructor.apply(this, arguments);
  }
  __extends(Simple, Runner);
  Simple.prototype.onStartFile = function(filename) {
    return util.puts("" + filename + ":");
  };
  Simple.prototype.onStartClass = function(classname) {
    return util.puts("  " + classname + ":");
  };
  Simple.prototype.onEndClass = function(classname) {};
  Simple.prototype.onStartTest = function(testname) {
    return sys.print("    " + testname + ": ");
  };
  Simple.prototype.onEndTest = function(testname, res) {
    var colour, msg;
    msg = " " + res.passed + "/" + res.count + " passed";
    if (res.expected) {
      colour = res.expected !== res.count ? this.red : this.green;
      msg += " (" + (colour(res.expected)) + " expected)";
    }
    return util.puts("" + msg + ".");
  };
  Simple.prototype.onAssertionPass = function() {
    return sys.print(this.green("."));
  };
  Simple.prototype.onAssertionFail = function(e) {
    var errs, spcr;
    spcr = "\n      ";
    errs = e.stack.split("\n");
    errs[0] = this.red(errs[0]);
    return util.print("" + spcr + (errs.join(spcr)));
  };
  Simple.prototype.onRunEnd = function(summary) {
    util.puts("Time taken: " + summary.time);
    util.puts("Passed:     " + summary.passed);
    return util.puts("Failed:     " + summary.failed);
  };
  return Simple;
})();