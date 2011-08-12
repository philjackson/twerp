var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
exports.Runner = (function() {
  function Runner(options, filenames) {
    var f, _i, _len;
    this.options = options;
    this.yellow = __bind(this.yellow, this);
    this.red = __bind(this.red, this);
    this.green = __bind(this.green, this);
    if (this.options.noColor || this.options.noColour) {
      this.cNorm = this.cRed = this.cGreen = "";
    } else {
      this.cNorm = "\u001B[39m";
      this.cRed = "\u001B[31m";
      this.cGreen = "\u001B[32m";
      this.cYellow = "\u001B[33m";
    }
    this.total_failed = 0;
    this.total_passed = 0;
    this.queue = [];
    this.coffee_loaded = false;
    for (_i = 0, _len = filenames.length; _i < _len; _i++) {
      f = filenames[_i];
      this.loadFile(f);
    }
    this.start_time = Date.now();
  }
  Runner.prototype.green = function(text) {
    return "" + this.cGreen + text + this.cNorm;
  };
  Runner.prototype.red = function(text) {
    return "" + this.cRed + text + this.cNorm;
  };
  Runner.prototype.yellow = function(text) {
    return "" + this.cYellow + text + this.cNorm;
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
    if (this.current_filename !== filename) {
      if (this.current_filename != null) {
        this.onEndFile(this.current_filename);
      }
      this.onStartFile(filename);
      this.current_filename = filename;
    }
    try {
      obj = new func(this.options);
    } catch (error) {
      console.log(error.stack);
      return;
    }
    obj.on("pass", __bind(function() {
      this.total_passed++;
      return this.onAssertionPass();
    }, this));
    obj.on("fail", __bind(function(error) {
      this.total_failed++;
      return this.onAssertionFail(error);
    }, this));
    obj.on("startTest", __bind(function(name) {
      return this.onStartTest(name);
    }, this));
    obj.on("endTest", __bind(function(name, test) {
      return this.onEndTest(name, test);
    }, this));
    this.onStartClass(cls);
    return __bind(function(next, cls) {
      return obj.run(__bind(function(results) {
        var summary;
        this.onEndClass(cls, results);
        if (next) {
          return this.runClass(next);
        } else {
          this.onEndFile(this.current_filename);
          this.current_filename = null;
          summary = {
            passed: this.total_passed,
            failed: this.total_failed,
            time: this.calcTime(Date.now() - this.start_time)
          };
          if (typeof this.onRunEnd === "function") {
            this.onRunEnd(summary);
          }
          return typeof this.finished === "function" ? this.finished(results) : void 0;
        }
      }, this));
    }, this)(next, cls);
  };
  Runner.prototype.calcTime = function(ms) {
    var mins, secs;
    if (ms < 1000) {
      ms = ms.toFixed(2);
      return "" + ms + " ms";
    }
    if ((secs = ms / 1000) < 60) {
      secs = secs.toFixed(2);
      return "" + secs + " secs";
    }
    if ((mins = secs / 60) < 60) {
      mins = mins.toFixed(2);
      return "" + mins + " mins";
    }
  };
  Runner.prototype.loadFile = function(filename) {
    var actual, cls, cwd, func, obj, re;
    cwd = process.cwd();
    if (/\.coffee$/.exec(filename) && !this.coffee_loaded) {
      require("coffee-script");
      this.coffee_loaded = true;
    }
    actual = /^\//.exec(filename) ? filename : "" + cwd + "/" + filename;
    obj = require(actual);
    for (cls in obj) {
      func = obj[cls];
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