var EE, assert, assert_functions, func, path, _fn, _i, _len;
var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; }, __slice = Array.prototype.slice;
EE = require("events").EventEmitter;
assert = require("../vendor/assert-extras");
path = require("path");
exports.TwerpTest = (function() {
  TwerpTest.isTwerpTest = true;
  function TwerpTest(options) {
    this.options = options;
    this.queue = this.gatherRunnables();
    this.tests = {};
    this.ee = new EE();
    this.on = this.ee.on;
    this.emit = this.ee.emit;
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
    var capture, name, next_test;
    name = _arg[0], capture = _arg[1];
    next_test = this.getNext() || ["done", false];
    return __bind(function(next_test, capture) {
      var previous_name, _base;
      if (previous_name = this.current) {
        this.emit("endTest", previous_name, this.tests[previous_name]);
        this.current = null;
      }
      if (capture) {
        (_base = this.tests)[name] || (_base[name] = {});
        this.current = name;
        this.emit("startTest", name);
      }
      return this[name](__bind(function(expected) {
        var _ref;
        if ((_ref = this.tests[name]) != null) {
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
    var func, prop, re, runnables;
    runnables = [];
    for (prop in this) {
      func = this[prop];
      if (!/^test[_ A-Z]/.exec(prop)) {
        continue;
      }
      if (this.options.matchFunction) {
        re = new RegExp(this.options.matchFunction);
        if (!re.exec(prop)) {
          continue;
        }
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
    var args, cur, errored;
    args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    errored = false;
    try {
      assert[func].apply(this, args);
      if (cur = this.tests[this.current]) {
        cur.passed || (cur.passed = 0);
        cur.passed++;
      }
      return this.emit("pass");
    } catch (e) {
      if (cur = this.tests[this.current]) {
        cur.failed = (cur.errors || (cur.errors = [])).push(e);
      }
      this.emit("fail", e);
      return errored = true;
    } finally {
      if (cur = this.tests[this.current]) {
        cur.count || (cur.count = 0);
        cur.count++;
      }
      if (errored && this.options["exitOnFailure"]) {
        this.emit("endTest", this.current, cur);
        process.exit(1);
      }
    }
  };
};
for (_i = 0, _len = assert_functions.length; _i < _len; _i++) {
  func = assert_functions[_i];
  _fn(func);
}