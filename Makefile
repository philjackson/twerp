JS=lib/twerptest.js

all: $(JS)

clean:
	-rm -f $(JS)

%.js: %.coffee
	coffee -b -c $<

test:
	coffee test/twerptest.coffee

.PHONY: clean test
