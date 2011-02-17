var EE, assert, assert_functions, func, path, _fn, _i, _len;
var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; }, __slice = Array.prototype.slice;
EE = require("events").EventEmitter;
assert = require("assert");
path = require("path");
exports.TwerpTest = (function() {
  function TwerpTest() {
    this.isTwerpTest = true;
    this.queue = this.gatherRunnables();
  }
  TwerpTest.prototype.setup = function(callback) {
    return callback();
  };
  TwerpTest.prototype.teardown = function(callback) {
    return callback();
  };
  TwerpTest.prototype.done = function() {};
  TwerpTest.prototype.getNext = function() {
    return this.queue.shift();
  };
  TwerpTest.prototype.run = function() {
    var current;
    if (current = this.getNext()) {
      return this.runTest(current);
    }
  };
  TwerpTest.prototype.runTest = function(test_name) {
    var next_name;
    next_name = this.getNext() || "done";
    return __bind(function(next_name) {
      return this[test_name](__bind(function(count) {
        return this.runTest(next_name);
      }, this));
    }, this)(next_name);
  };
  TwerpTest.prototype.gatherRunnables = function() {
    var func, prop, runnables;
    runnables = [];
    for (prop in this) {
      func = this[prop];
      if (!/^test[_ A-Z]/.exec(prop)) {
        continue;
      }
      runnables.push("setup", prop, "teardown");
    }
    return runnables;
  };
  return TwerpTest;
})();
assert_functions = ["fail", "ok", "equal", "notEqual", "deepEqual", "notDeepEqual", "strictEqual", "notStrictEqual", "throws", "doesNotThrow", "ifError"];
_fn = function(func) {
  return exports.TwerpTest.prototype[func] = function() {
    var args;
    args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    return assert[func].apply(this, args);
  };
};
for (_i = 0, _len = assert_functions.length; _i < _len; _i++) {
  func = assert_functions[_i];
  _fn(func);
}