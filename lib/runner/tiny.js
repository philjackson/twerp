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
    this.onAssertionFail = __bind(this.onAssertionFail, this);;
    this.onAssertionPass = __bind(this.onAssertionPass, this);;
    this.onStartTest = __bind(this.onStartTest, this);;
    this.onStartClass = __bind(this.onStartClass, this);;
    this.onStartFile = __bind(this.onStartFile, this);;    Tiny.__super__.constructor.apply(this, arguments);
  }
  __extends(Tiny, Runner);
  Tiny.prototype.onStartFile = function(filename) {
    return this.filename = filename;
  };
  Tiny.prototype.onStartClass = function(classname) {
    return this.classname = classname;
  };
  Tiny.prototype.onStartTest = function(testname) {
    return sys.print("" + this.filename + " " + this.classname + " " + testname + ": ");
  };
  Tiny.prototype.onEndFile = function(filename) {
    return util.puts("");
  };
  Tiny.prototype.onEndTest = function(testname) {
    return util.puts("");
  };
  Tiny.prototype.onAssertionPass = function() {
    return sys.print(this.green("."));
  };
  Tiny.prototype.onAssertionFail = function(e) {
    var errs, spcr;
    spcr = "\n      ";
    errs = e.stack.split("\n");
    errs[0] = this.red(errs[0]);
    return util.print("" + spcr + (errs.join(spcr)));
  };
  return Tiny;
})();