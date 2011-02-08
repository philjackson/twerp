var Runner, Simple, TwerpTest, s, sys;
var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
  for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
  function ctor() { this.constructor = child; }
  ctor.prototype = parent.prototype;
  child.prototype = new ctor;
  child.__super__ = parent.prototype;
  return child;
};
sys = require("sys");
TwerpTest = require("../../lib/twerptest").TwerpTest;
Runner = require("../runner").Runner;
Simple = (function() {
  function Simple() {
    Simple.__super__.constructor.apply(this, arguments);
  }
  __extends(Simple, Runner);
  Simple.prototype.display = function(name, res) {
    return console.log(name, res);
  };
  return Simple;
})();
s = new Simple();
s.loadFile("../blah");
s.run();