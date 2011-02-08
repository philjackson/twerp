var assert, assert_functions, func, _fn, _i, _len;
var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; }, __slice = Array.prototype.slice;
assert = require("assert");
exports.TwerpTest = (function() {
  TwerpTest.isTwerpTest = true;
  function TwerpTest(errcallback, passcallback, allcallback) {
    this.errcallback = errcallback;
    this.passcallback = passcallback;
    this.allcallback = allcallback;
    this.done = __bind(this.done, this);;
  }
  TwerpTest.prototype.setup = function() {};
  TwerpTest.prototype.teardown = function() {};
  TwerpTest.prototype.done = function(expected, wait) {
    var current, total;
    current = this.run_tests[this.current];
    total = current.total;
    current.expected = expected;
    if (total < expected) {
      if (wait) {
        setTimeout(this.done, 100, expected, wait);
        return false;
      } else {
        throw new Error("Ran " + total + " which is less than " + expected + ".");
      }
    } else if (total > expected) {
      throw new Error("Ran " + total + " which is more than " + expected + ".");
    } else {
      this.teardown();
      return typeof this.allcallback === "function" ? this.allcallback(this.run_tests) : void 0;
    }
  };
  TwerpTest.prototype.run = function(callback) {
    var func, prop, _results;
    _results = [];
    for (prop in this) {
      func = this[prop];
      if (!/^test[_ A-Z]/.exec(prop)) {
        continue;
      }
      this.current = prop;
      this.run_tests || (this.run_tests = {});
      this.run_tests[prop] = {
        failed: 0,
        passed: 0,
        total: 0
      };
      this.setup();
      this[prop]();
      _results.push(callback(this.run_tests[prop]));
    }
    return _results;
  };
  return TwerpTest;
})();
assert_functions = ["fail", "ok", "equal", "notEqual", "deepEqual", "notDeepEqual", "strictEqual", "notStrictEqual", "throws", "doesNotThrow", "ifError"];
_fn = function(func) {
  return exports.TwerpTest.prototype[func] = function() {
    var args, _base;
    args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    try {
      assert[func].apply(this, args);
      this.run_tests[this.current].passed++;
      return typeof this.passcallback === "function" ? this.passcallback() : void 0;
    } catch (e) {
      this.run_tests[this.current].failed++;
      ((_base = this.run_tests[this.current]).errors || (_base.errors = [])).push(e);
      return typeof this.errcallback === "function" ? this.errcallback(e) : void 0;
    } finally {
      this.run_tests[this.current].total++;
    }
  };
};
for (_i = 0, _len = assert_functions.length; _i < _len; _i++) {
  func = assert_functions[_i];
  _fn(func);
}