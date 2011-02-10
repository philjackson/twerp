JS=lib/twerptest.js \
   lib/runner.js \
   lib/runner/simple.js \
	 blah.js

BIN=bin/twerp

all: $(JS) $(BIN)

$(BIN): $(BIN).coffee
	coffee -b -c $(BIN).coffee \
    && mv $(BIN).js $(BIN) \
    && chmod +x $(BIN)

clean:
	-rm -f $(JS) $(BIN)

%.js: %.coffee
	coffee -b -c $<

test: $(JS)
	coffee test/twerptest.coffee

.PHONY: clean test
