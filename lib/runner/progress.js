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
exports.Progress = (function() {
  __extends(Progress, Runner);
  function Progress() {
    Progress.__super__.constructor.apply(this, arguments);
  }
  Progress.prototype.onStartFile = function(file) {
    return this.file = file;
  };
  Progress.prototype.onStartClass = function(suite) {
    this.suite = suite;
    return process.stderr.write("" + suite + "\n");
  };
  Progress.prototype.onEndClass = function(suite) {};
  Progress.prototype.onStartTest = function(testName) {
    this.testName = testName;
    this.testCount = 0;
    return this.passCount = 0;
  };
  Progress.prototype.onEndTest = function(testName, res) {
    return process.stderr.write("\n");
  };
  Progress.prototype.onAssertionPass = function() {
    this.passCount++;
    this.testCount++;
    return this.progress();
  };
  Progress.prototype.progress = function(err) {
    var color, dotCount, dots, icon, out, status, summary, testName;
    if (this.passCount === this.testCount) {
      status = "Success";
      color = this.green;
      icon = "\u2713";
    } else {
      status = "Failure";
      color = this.red;
      icon = "\u2718";
    }
    if (this.testName) {
      testName = this.testName.replace(/^test:\s+/, "");
      summary = "(" + this.passCount + "/" + this.testCount + ")";
      dotCount = 80 - testName.length - summary.length - 14;
      dots = new Array(dotCount < 0 ? 0 : dotCount).join(".");
      out = (" " + (color(icon)) + " " + testName + " " + dots) + (" (" + this.passCount + "/" + this.testCount + ") " + (color(status)) + "\r");
      process.stderr.write(out);
    }
    if (err) {
      process.stderr.write("\n");
      process.stderr.write("  " + err.stack);
      return process.stderr.write("\n");
    }
  };
  Progress.prototype.onAssertionFail = function(err) {
    this.testCount++;
    return this.progress(err);
  };
  Progress.prototype.onRunEnd = function(summary) {
    process.stderr.write("Time taken: " + summary.time + "\n");
    process.stderr.write("Passed:     " + summary.passed + "\n");
    return process.stderr.write("Failed:     " + summary.failed + "\n");
  };
  return Progress;
})();