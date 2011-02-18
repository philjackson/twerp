var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
exports.Runner = (function() {
  function Runner(options, filenames) {
    var f, _i, _len;
    this.options = options;
    this.red = __bind(this.red, this);;
    this.green = __bind(this.green, this);;
    this.cNorm = "\u001B[39m";
    this.cRed = "\u001B[31m";
    this.cGreen = "\u001B[32m";
    this.queue = [];
    this.coffee_loaded = false;
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
  Runner.prototype.onPass = function() {};
  Runner.prototype.onFail = function(e) {};
  Runner.prototype.runClass = function(_arg) {
    var cls, filename, func, next, obj;
    filename = _arg[0], cls = _arg[1], func = _arg[2];
    next = this.getNext();
    obj = new func(this.options);
    obj.on("pass", this.onPass);
    obj.on("fail", this.onFail);
    return __bind(function(next) {
      return obj.run(__bind(function(results) {
        var details, test;
        this.display(filename, cls, results);
        if (this.options["exit-on-failure"]) {
          for (test in results) {
            details = results[test];
            if (details.failed > 0) {
              process.exit(1);
            }
          }
        }
        if (next) {
          return this.runClass(next);
        }
      }, this));
    }, this)(next);
  };
  Runner.prototype.loadFile = function(filename) {
    var actual, cls, cwd, func, _ref;
    cwd = process.cwd();
    if (/\.coffee$/.exec(filename) && !this.coffee_loaded) {
      require("coffee-script");
      this.coffee_loaded = true;
    }
    actual = /^\//.exec(filename) ? filename : "" + cwd + "/" + filename;
    _ref = require(actual);
    for (cls in _ref) {
      func = _ref[cls];
      if (func.isTwerpTest) {
        this.queue.push([filename, cls, func]);
      }
    }
    return true;
  };
  return Runner;
})();