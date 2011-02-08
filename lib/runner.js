var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
exports.Runner = (function() {
  function Runner() {
    this.tests = {};
    this.results = {};
    this.cNorm = "\u001B[39m";
    this.cRed = "\u001B[31m";
    this.cGreen = "\u001B[32m";
  }
  Runner.prototype.green = function(text) {
    return "" + this.cGreen + text + this.cNorm;
  };
  Runner.prototype.red = function(text) {
    return "" + this.cRed + text + this.cNorm;
  };
  Runner.prototype.loadFile = function(filename) {
    var cls, func, _ref, _results;
    _ref = require(filename);
    _results = [];
    for (cls in _ref) {
      func = _ref[cls];
      _results.push(func.isTwerpTest ? __bind(function(cls) {
        return this.tests[cls] = new func;
      }, this)(cls) : void 0);
    }
    return _results;
  };
  Runner.prototype.run = function() {
    var cls, test, _ref, _results;
    _ref = this.tests;
    _results = [];
    for (cls in _ref) {
      test = _ref[cls];
      test.on("done", this.display);
      _results.push(test.run());
    }
    return _results;
  };
  return Runner;
})();