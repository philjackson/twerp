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
  function Progress() {
    Progress.__super__.constructor.apply(this, arguments);
  }
  __extends(Progress, Runner);
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
  Progress.prototype.progress = function() {
    var background, color, colorCounts, colorName, dotCount, dots, icon, out, status, summary, testName;
    if (this.passCount === this.testCount) {
      status = "Success";
      color = this.green;
      colorName = function(str) {
        return str;
      };
      colorCounts = function(str) {
        return str;
      };
      background = function(str) {
        return str;
      };
      icon = "\u2713";
    } else {
      status = "FAILURE";
      color = this.red;
      background = function(str) {
        return "\033[39;0;47m" + str + "\033[39;0;48m";
      };
      colorName = function(str) {
        return "\033[39;2;47m" + str + "\033[39;0;47m";
      };
      colorCounts = function(str) {
        return "\033[39;2;47m" + str + "\033[39;0;47m";
      };
      icon = "\u2718";
    }
    testName = this.testName.replace(/^test:\s+/, "");
    summary = "(" + this.passCount + "/" + this.testCount + ")";
    dotCount = 80 - testName.length - summary.length - 14;
    dots = new Array(dotCount < 0 ? 0 : dotCount).join(".");
    out = "  " + (background("" + (color(icon)) + " " + (colorName("" + testName + " " + dots)) + " (" + (colorCounts(this.passCount)) + "/" + (colorCounts(this.testCount)) + ") " + (color(status)))) + "\r";
    return process.stderr.write(out);
  };
  Progress.prototype.onAssertionFail = function(e) {
    this.testCount++;
    return this.progress();
  };
  Progress.prototype.onRunEnd = function(summary) {
    process.stderr.write("Time taken: " + summary.time + "\n");
    process.stderr.write("Passed:     " + summary.passed + "\n");
    return process.stderr.write("Failed:     " + summary.failed + "\n");
  };
  return Progress;
})();