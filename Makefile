JS=lib/twerptest.js \
   lib/runner.js \
	 lib/runner/index.js \
   lib/runner/simple.js

BIN=bin/twerp

all: $(JS) $(BIN)

$(BIN): $(BIN).coffee
	coffee -b -c $(BIN).coffee \
    && mv $(BIN).js $(BIN) \
	  && sed -i '1i\#!/usr/bin/env node' $(BIN) \
    && chmod +x $(BIN)

clean:
	-rm -f $(JS) $(BIN)

%.js: %.coffee
	coffee -b -c $<

test: $(JS)
	coffee test/twerptest.coffee && \
    coffee test/runner.coffee

.PHONY: clean test

