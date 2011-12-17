var Pattern = {
  url: /^http[s]?\:\/\//,
  fs: /.*/
}

function read(path, doneFn)
{
  var handlers = read.customHandlers,
      n = handlers.length;
  
  // Go through the custom handlers first
  for (var i = 0; i < n; i++)
  {
    if (handlers[i].pattern.test(path))
    {
      return handlers[i].handler(path, doneFn);
    }
  }
  
  handlers = defaultHandlers;
  n = handlers.length;
  
  // If unhandled by custom matchers, check against the default matchers
  for (var i = 0; i < n; i++)
  {
    if (handlers[i].pattern.test(path))
    {
      return handlers[i].handler(path, doneFn);
    }
  }
}

read.customHandlers = [ /* { pattern: regex, handler: fn } */ ];

read.addMatcher = function (pattern, handler) {
  read.customHandlers.push({
    pattern:pattern,
    handler:handler
  });
}

read.clearCustomMatchers = function () {
  read.customHandlers = [];
}

var defaultHandlers = [];

function addDefaultMatcher(pattern, handler)
{
  defaultHandlers.push({
    pattern:pattern,
    handler:handler
  });
}

addDefaultMatcher(Pattern.url, function (path, done) {
  var url = require('url'),
      opts = url.parse(path),
      requestor = opts.protocol.indexOf('https') > -1 ? require('https') : require('http');
  
  requestor.get(url.parse(path), function (res) {
    var output = '';
    
    res.on('data', function (chunk) {
      output += chunk;
    });
    
    res.on('end', function () {
      done(null, output);
    });
    
    res.on('close', function (err) {
      done(err, null);
    });
  }).
  on('error', function (err) {
    done(err, null);
  }).
  setTimeout(read.timeout || 100, function () {
    done('No response recieved from Server!', null);
  });
});

addDefaultMatcher(Pattern.fs, function (path, done) {
  require('fs').readFile(path, function (err, data) {
    data = data ? data.toString() : null
    done(err, data);
  });
});

module.exports = read
