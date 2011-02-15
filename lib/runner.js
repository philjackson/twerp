exports.Runner = (function() {
  function Runner(options) {
    this.options = options;
    this.cNorm = "\u001B[39m";
    this.cRed = "\u001B[31m";
    this.cGreen = "\u001B[32m";
    this.alltests = {};
    this.results = {};
    this.options || (this.options = {});
  }
  Runner.prototype.green = function(text) {
    return "" + this.cGreen + text + this.cNorm;
  };
  Runner.prototype.red = function(text) {
    return "" + this.cRed + text + this.cNorm;
  };
  Runner.prototype.canCoffee = function() {
    return this.coffee || (this.coffee = (function() {
      try {
        require("coffee-script");
        return true;
      } catch (e) {
        return true;
      }
    })());
  };
  Runner.prototype.loadFile = function(filename) {
    var actual, cls, cwd, func, _base, _ref;
    cwd = process.cwd();
    if (/.coffee$/.exec(filename)) {
      this.canCoffee();
    }
    actual = /^\//.exec(filename) ? filename : "" + cwd + "/" + filename;
    _ref = require(actual);
    for (cls in _ref) {
      func = _ref[cls];
      if (func.isTwerpTest) {
        (_base = this.alltests)[filename] || (_base[filename] = {});
        this.alltests[filename][cls] = new func(filename, cls);
      }
    }
    return true;
  };
  Runner.prototype.run = function() {
    var cls, filename, test, tests, _ref;
    _ref = this.alltests;
    for (filename in _ref) {
      tests = _ref[filename];
      for (cls in tests) {
        test = tests[cls];
        test.on("done", this.display);
        test.run();
      }
    }
    return true;
  };
  return Runner;
})();