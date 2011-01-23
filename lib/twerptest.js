var assert, assert_functions, func, _fn, _i, _len;
var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; }, __slice = Array.prototype.slice;
assert = require("assert");
exports.TwerpTest = (function() {
  function TwerpTest() {
    this.done = __bind(this.done, this);;
  }
  TwerpTest.prototype.setup = function() {};
  TwerpTest.prototype.teardown = function() {};
  TwerpTest.prototype.display = function(results) {
    var details, longest_test_name, out, spaces, test, _results;
    longest_test_name = 0;
    for (test in results) {
      details = results[test];
      if (test.length > longest_test_name) {
        longest_test_name = test.length;
      }
    }
    _results = [];
    for (test in results) {
      details = results[test];
      spaces = Array(longest_test_name - test.length + 2).join(" ");
      out = "" + test + ":" + spaces + details.passed + "/" + details.expected + " passed ";
      out += "(" + details.failed + " failed)";
      _results.push(console.log(out));
    }
    return _results;
  };
  TwerpTest.prototype.expected = function(count, wait) {
    if (wait == null) {
      wait = false;
    }
    this.run_tests[this.current].expected = count;
    return this.run_tests[this.current].wait = wait;
  };
  TwerpTest.prototype.done = function(callback) {
    var current, expected, total;
    current = this.run_tests[this.current];
    total = current.total;
    expected = current.expected;
    if (total < expected) {
      if (current.wait === true) {
        return setTimeout(this.done, 100, callback);
      } else {
        throw new Error("Ran " + total + " which is less than " + expected + ".");
      }
    } else if (total > expected) {
      throw new Error("Ran " + total + " which is more than " + expected + ".");
    } else {
      this.teardown();
      return (callback != null) && callback(this.run_tests);
    }
  };
  TwerpTest.prototype.run = function(callback) {
    var func, prop, _results;
    this.setup();
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
      try {
        this[prop]();
      } catch (e) {
        this.run_tests[prop].error = e;
      }
      if (this.run_tests[this.current].expected == null) {
        throw new Error("Make sure you call expected() for '" + this.current + "'");
      }
      _results.push(this.done(callback));
    }
    return _results;
  };
  return TwerpTest;
})();
assert_functions = ["fail", "ok", "equal", "notEqual", "deepEqual", "notDeepEqual", "strictEqual", "notStrictEqual", "throws", "doesNotThrow", "ifError"];
_fn = function(func) {
  return exports.TwerpTest.prototype[func] = function() {
    var args;
    args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    try {
      assert[func].apply(this, args);
      return this.run_tests[this.current].passed++;
    } catch (e) {
      this.run_tests[this.current].failed++;
      throw e;
    } finally {
      console.log(this);
      this.run_tests[this.current].total++;
    }
  };
};
for (_i = 0, _len = assert_functions.length; _i < _len; _i++) {
  func = assert_functions[_i];
  _fn(func);
}