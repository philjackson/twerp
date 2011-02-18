var EE, assert, assert_functions, func, path, _fn, _i, _len;
var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; }, __slice = Array.prototype.slice;
EE = require("events").EventEmitter;
assert = require("../vendor/assert-extras");
path = require("path");
exports.TwerpTest = (function() {
  TwerpTest.isTwerpTest = true;
  function TwerpTest() {
    this.queue = this.gatherRunnables();
    this.tests = {};
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
  TwerpTest.prototype.run = function(finished_callback) {
    var current;
    this.finished_callback = finished_callback;
    if (current = this.getNext()) {
      return this.runTest(current);
    }
  };
  TwerpTest.prototype.runTest = function(_arg) {
    var capture, next_test;
    this.current = _arg[0], capture = _arg[1];
    next_test = this.getNext() || ["done", false];
    return __bind(function(next_test, capture) {
      var _base, _name;
      if (capture) {
        (_base = this.tests)[_name = this.current] || (_base[_name] = {});
      }
      return this[this.current](__bind(function(expected) {
        var _ref;
        if ((_ref = this.tests[this.current]) != null) {
          _ref.expected = expected;
        }
        return this.runTest(next_test);
      }, this));
    }, this)(next_test, capture);
  };
  TwerpTest.prototype.finished = function() {
    return this.finished_callback(this.tests);
  };
  TwerpTest.prototype.gatherRunnables = function() {
    var func, prop, runnables;
    runnables = [];
    for (prop in this) {
      func = this[prop];
      if (!/^test[_ A-Z]/.exec(prop)) {
        continue;
      }
      runnables.push(["setup", false], [prop, true], ["teardown", false]);
    }
    runnables.push(["finished", false]);
    return runnables;
  };
  return TwerpTest;
})();
assert_functions = ["fail", "ok", "equal", "notEqual", "deepEqual", "notDeepEqual", "strictEqual", "notStrictEqual", "throws", "doesNotThrow", "ifError", "isNull", "isNotNull", "isTypeOf", "isNotTypeOf", "isObject", "isFunction", "isString", "isBoolean", "isNumber", "isUndefined", "isNotUndefined", "isArray", "isNaN", "isNotNaN", "match", "noMatch", "isPrototypeOf", "isNotPrototypeOf", "isWritable", "isNotWritable", "isConfigurable", "isNotConfigurable", "isEnumerable", "isNotEnumerable"];
_fn = function(func) {
  return exports.TwerpTest.prototype[func] = function() {
    var args, cur;
    args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    try {
      assert[func].apply(this, args);
      if (cur = this.tests[this.current]) {
        return cur.passed = cur.passed ? cur.passed + 1 : 1;
      }
    } catch (e) {
      if (cur = this.tests[this.current]) {
        return cur.failed = (cur.errors || (cur.errors = [])).push(e);
      }
    } finally {
      if (cur = this.tests[this.current]) {
        cur.count = cur.count ? cur.count + 1 : 1;
      }
    }
  };
};
for (_i = 0, _len = assert_functions.length; _i < _len; _i++) {
  func = assert_functions[_i];
  _fn(func);
}