var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
exports.Runner = (function() {
  function Runner(options, filenames) {
    var f, _i, _len;
    this.options = options;
    this.cNorm = "\u001B[39m";
    this.cRed = "\u001B[31m";
    this.cGreen = "\u001B[32m";
    this.queue = [];
    for (_i = 0, _len = filenames.length; _i < _len; _i++) {
      f = filenames[_i];
      this.loadFile(f);
    }
  }
  Runner.prototype.green = function(text) {
    return "" + this.cGreen + text + this.cNorm;
  };
  Runner.prototype.red = function(text) {
    return "" + this.cRed + text + this.cNorm;
  };
  Runner.prototype.getNext = function() {
    return this.queue.shift();
  };
  Runner.prototype.run = function() {
    var current;
    if (current = this.getNext()) {
      return this.runClass(current);
    }
  };
  Runner.prototype.display = console.log;
  Runner.prototype.runClass = function(func) {
    var next, obj;
    next = this.getNext();
    obj = new func();
    return __bind(function(next) {
      return obj.run(__bind(function(results) {
        this.display(results);
        if (next) {
          return this.runClass(next);
        }
      }, this));
    }, this)(next);
  };
  Runner.prototype.loadFile = function(filename) {
    var actual, cls, cwd, func, _ref;
    cwd = process.cwd();
    if (/\.coffee$/.exec(filename && !this.coffee_loaded)) {
      require("coffee-script");
      this.coffee_loaded = 1;
    }
    actual = /^\//.exec(filename) ? filename : "" + cwd + "/" + filename;
    _ref = require(actual);
    for (cls in _ref) {
      func = _ref[cls];
      if (func.isTwerpTest) {
        this.queue.push(func);
      }
    }
    return true;
  };
  return Runner;
})();