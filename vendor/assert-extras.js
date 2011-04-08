function extend (target, source) {
    Object.keys(source).forEach(function (property) {
        target[property] = source[property];
    });

    return target;
}

var assert = extend(exports, require("assert"));

assert.isNull = function (value, message) {
    if (value !== null) {
        assert.fail(value, null, message, "===", assert.isNull);
    }
}

assert.isNotNull = function (value, message) {
    if (value === null) {
        assert.fail(value, null, message, "!==", assert.isNotNull);
    }
}

function typeOf (value, type, message, stackStart) {
    if (typeof value != type) {
        assert.fail(value, type, message, "typeof", stackStart);
    }
}

function notTypeOf (value, type, message, stackStart) {
    if (typeof value == type) {
        assert.fail(value, type, message, "!typeof", stackStart);
    }
}

assert.isTypeOf = function (value, type, message) {
    typeOf(value, type, message, assert.isTypeOf);
};

assert.isNotTypeOf = function (value, type, message) {
    notTypeOf(value, type, message, assert.isNotTypeOf);
};

assert.isObject = function (value, message) {
    typeOf(value, "object", message, assert.isObject);
};

assert.isFunction = function (value, message) {
    typeOf(value, "function", message, assert.isFunction);
};

assert.isString = function (value, message) {
    typeOf(value, "string", message, assert.isString);
};

assert.isBoolean = function (value, message) {
    typeOf(value, "boolean", message, assert.isBoolean);
};

assert.isNumber = function (value, message) {
    typeOf(value, "number", message, assert.isNumber);
};

assert.isUndefined = function (value, message) {
    typeOf(value, "undefined", message, assert.isUndefined);
};

assert.isNotUndefined = function (value, message) {
    notTypeOf(value, "undefined", message, assert.isNotUndefined);
};

assert.isArray = function (value, message) {
    if (Object.prototype.toString.call(value) != "[object Array]") {
        assert.fail(value, "Array", message, "[[Class]]", assert.isArray);
    }
};

assert.isNaN = function (value, message) {
    if (!isNaN(value)) {
        assert.fail(value, "NaN", message, "==", assert.isNaN);
    }
}

assert.isNotNaN = function (value, message) {
    if (isNaN(value)) {
        assert.fail(value, "NaN", message, "!=", assert.isNotNaN);
    }
}

assert.match = function (value, pattern, message) {
    if (!pattern.test(value)) {
        assert.fail(value, pattern, message, "test", assert.match);
    }
}

assert.noMatch = function (value, pattern, message) {
    if (pattern.test(value)) {
        assert.fail(value, pattern, message, "!test", assert.noMatch);
    }
}

assert.isPrototypeOf = function (proto, object, message) {
    if (!proto.isPrototypeOf(object)) {
        assert.fail(proto, object, message, "isPrototypeOf", assert.isPrototypeOf);
    }
}

assert.isNotPrototypeOf = function (proto, object, message) {
    if (proto.isPrototypeOf(object)) {
        assert.fail(proto, object, message, "!isPrototypeOf", assert.isNotPrototypeOf);
    }
}

assert.isWritable = function (object, property, message) {
    var descriptor = Object.getOwnPropertyDescriptor(object, property);

    if (!descriptor.writable) {
        assert.fail(object, property, message, "isWritable", assert.isWritable);
    }
}

assert.isNotWritable = function (object, property, message) {
    var descriptor = Object.getOwnPropertyDescriptor(object, property);

    if (descriptor.writable) {
        assert.fail(object, property, message, "isNotWritable", assert.isNotWritable);
    }
}

assert.isConfigurable = function (object, property, message) {
    var descriptor = Object.getOwnPropertyDescriptor(object, property);

    if (!descriptor.configurable) {
        assert.fail(object, property, message, "isConfigurable", assert.isConfigurable);
    }
}

assert.isNotConfigurable = function (object, property, message) {
    var descriptor = Object.getOwnPropertyDescriptor(object, property);

    if (descriptor.configurable) {
        assert.fail(object, property, message, "isNotConfigurable", assert.isNotConfigurable);
    }
}

assert.isEnumerable = function (object, property, message) {
    var descriptor = Object.getOwnPropertyDescriptor(object, property);

    if (!descriptor.enumerable) {
        assert.fail(object, property, message, "isEnumerable", assert.isEnumerable);
    }
}

assert.isNotEnumerable = function (object, property, message) {
    var descriptor = Object.getOwnPropertyDescriptor(object, property);

    if (descriptor.enumerable) {
        assert.fail(object, property, message, "isNotEnumerable", assert.isNotEnumerable);
    }
}

http = require( "http" );

// for now...
var port = 2000;

assert.response = function(server, req, res, msg){
    // Check that the server is ready or defer
    if (!server.fd) {
        server.__deferred = server.__deferred || [];
        server.__deferred.push(arguments);
        server.listen(server.__port = port++, '127.0.0.1', function(){
            server.__listening = true;
            if (server.__deferred) {
                server.__deferred.forEach(function(args){
                    assert.response.apply(assert, args);
                });
                server.__deferred = null;
            }
        });
        return;
    }

    // The socket was created but is not yet listening, so keep deferring
    if (!server.__listening) {
        server.__deferred.push(arguments);
        return;
    }

    // Callback as third or fourth arg
    var callback = typeof res === 'function'
        ? res
        : typeof msg === 'function'
            ? msg
            : function(){};

    // Default messate to test title
    if (typeof msg === 'function') msg = null;
    msg = msg || assert.testTitle;
    msg += '. ';

    // Pending responses
    server.__pending = server.__pending || 0;
    server.__pending++;

    // Create client
    if (!server.fd) {
        server.listen(server.__port = port++, '127.0.0.1', issue);
    } else {
        issue();
    }

    function issue(){
        if (!server.client)
            server.client = http.createClient(server.__port);

        // Issue request
        var timer,
            client = server.client,
            method = req.method || 'GET',
            status = res.status || res.statusCode,
            data = req.data || req.body,
            requestTimeout = req.timeout || 0;

        var request = client.request(method, req.url, req.headers);

        var check = function() {
            if (--server.__pending === 0) {
                server.close();
                server.__listening = false;
            }
        };

        // Timeout
        if (requestTimeout) {
            timer = setTimeout(function(){
                check();
                delete req.timeout;
                assert.fail(msg + 'Request timed out after ' + requestTimeout + 'ms.');
            }, requestTimeout);
        }

        if (data) request.write(data);
        request.on('response', function(response){
            response.body = '';
            response.setEncoding('utf8');
            response.on('data', function(chunk){ response.body += chunk; });
            response.on('end', function(){
                if (timer) clearTimeout(timer);

                // Assert response body
                if (res.body !== undefined) {
                    var eql = res.body instanceof RegExp
                      ? res.body.test(response.body)
                      : res.body === response.body;
                    assert.ok(
                        eql,
                        msg + 'Invalid response body.\n'
                            + '    Expected: ' + sys.inspect(res.body) + '\n'
                            + '    Got: ' + sys.inspect(response.body)
                    );
                }

                // Assert response status
                if (typeof status === 'number') {
                    assert.equal(
                        response.statusCode,
                        status,
                        msg + 'Invalid response status code.\n'
                            + '    Expected: [green]{' + status + '}\n'
                            + '    Got: [red]{' + response.statusCode + '}'
                    );
                }

                // Assert response headers
                if (res.headers) {
                    var keys = Object.keys(res.headers);
                    for (var i = 0, len = keys.length; i < len; ++i) {
                        var name = keys[i],
                            actual = response.headers[name.toLowerCase()],
                            expected = res.headers[name],
                            eql = expected instanceof RegExp
                              ? expected.test(actual)
                              : expected == actual;
                        assert.ok(
                            eql,
                            msg + colorize('Invalid response header [bold]{' + name + '}.\n'
                                + '    Expected: [green]{' + expected + '}\n'
                                + '    Got: [red]{' + actual + '}')
                        );
                    }
                }

                // Callback
                callback(response);
                check();
            });
        });
        request.end();
      }
};
