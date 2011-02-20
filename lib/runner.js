var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
exports.Runner = (function() {
  function Runner(options, filenames) {
    var f, _i, _len;
    this.options = options;
    this.red = __bind(this.red, this);;
    this.green = __bind(this.green, this);;
    if (this.options.noColor || this.options.noColour) {
      this.cNorm = this.cRed = this.cGreen = "";
    } else {
      this.cNorm = "\u001B[39m";
      this.cRed = "\u001B[31m";
      this.cGreen = "\u001B[32m";
    }
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
  Runner.prototype.run = function(finished) {
    var current;
    this.finished = finished;
    if (current = this.getNext()) {
      return this.runClass(current);
    }
  };
  Runner.prototype.onAssertionPass = function() {};
  Runner.prototype.onAssertionFail = function(error) {};
  Runner.prototype.onStartTest = function() {};
  Runner.prototype.onEndTest = function() {};
  Runner.prototype.onStartClass = function() {};
  Runner.prototype.onEndClass = function() {};
  Runner.prototype.onStartFile = function() {};
  Runner.prototype.onEndFile = function() {};
  Runner.prototype.runClass = function(_arg) {
    var cls, filename, func, next, obj;
    filename = _arg[0], cls = _arg[1], func = _arg[2];
    next = this.getNext();
    obj = new func(this.options);
    if (this.current_filename !== filename) {
      if (this.current_filename != null) {
        this.onEndFile(this.current_filename);
      }
      this.onStartFile(filename);
      this.current_filename = filename;
    }
    obj.on("pass", this.onAssertionPass);
    obj.on("fail", this.onAssertionFail);
    obj.on("startTest", this.onStartTest);
    obj.on("endTest", this.onEndTest);
    this.onStartClass(cls);
    return __bind(function(next, cls) {
      return obj.run(__bind(function(results) {
        this.onEndClass(cls);
        if (next) {
          return this.runClass(next);
        } else {
          this.onEndFile(this.current_filename);
          this.current_filename = null;
          return typeof this.finished === "function" ? this.finished() : void 0;
        }
      }, this));
    }, this)(next, cls);
  };
  Runner.prototype.loadFile = function(filename) {
    var actual, cls, cwd, func, re, _ref;
    cwd = process.cwd();
    if (/\.coffee$/.exec(filename) && !this.coffee_loaded) {
      require("coffee-script");
      this.coffee_loaded = true;
    }
    actual = /^\//.exec(filename) ? filename : "" + cwd + "/" + filename;
    _ref = require(actual);
    for (cls in _ref) {
      func = _ref[cls];
      if (this.options.matchClass) {
        re = new RegExp(this.options.matchClass);
        if (!re.exec(cls)) {
          continue;
        }
      }
      if (func.isTwerpTest) {
        this.queue.push([filename, cls, func]);
      }
    }
    return true;
  };
  return Runner;
})();