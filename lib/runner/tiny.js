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
exports.Tiny = (function() {
  function Tiny() {
    this.onRunEnd = __bind(this.onRunEnd, this);;
    this.onAssertionFail = __bind(this.onAssertionFail, this);;
    this.onAssertionPass = __bind(this.onAssertionPass, this);;
    this.onStartTest = __bind(this.onStartTest, this);;
    this.onStartClass = __bind(this.onStartClass, this);;    Tiny.__super__.constructor.apply(this, arguments);
  }
  __extends(Tiny, Runner);
  Tiny.prototype.onStartClass = function(classname) {
    return this.classname = classname;
  };
  Tiny.prototype.onStartTest = function(testname) {
    var matches;
    if (matches = /^test[ _]?(.+)$/.exec(testname)) {
      testname = matches[1];
    }
    this.current_test_count = 0;
    return this.current_test = testname;
  };
  Tiny.prototype.onEndTest = function(testname, res) {
    var colour, msg;
    msg = "\r" + this.classname + ": " + this.current_test + ":";
    msg += res.expected ? (colour = res.expected !== res.count ? this.red : this.green, " " + (this.green(res.count)) + " of " + (colour(res.expected))) : void 0;
    return util.puts("" + msg);
  };
  Tiny.prototype.onAssertionPass = function() {
    return sys.print("\r" + this.classname + ": " + this.current_test + ": " + (++this.current_test_count) + " ");
  };
  Tiny.prototype.onAssertionFail = function(e) {
    var errs, spcr;
    this.current_test_count++;
    sys.print("\r" + this.classname + ": " + this.current_test + ":");
    spcr = "\n      ";
    errs = e.stack.split("\n");
    errs[0] = this.red(errs[0]);
    return util.print("" + spcr + (errs.join(spcr)) + "\n");
  };
  Tiny.prototype.onRunEnd = function(summary) {
    util.puts("Time taken: " + summary.time);
    util.puts("Passed:     " + summary.passed);
    return util.puts("Failed:     " + summary.failed);
  };
  return Tiny;
})();