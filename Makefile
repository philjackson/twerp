JS=lib/twerptest.js \
   lib/runner.js \
   lib/runner/simple.js

all: $(JS)

clean:
	-rm -f $(JS)

%.js: %.coffee
	coffee -b -c $<

test: $(JS)
	coffee test/twerptest.coffee

.PHONY: clean test
