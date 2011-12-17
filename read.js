function read(path, doneFn)
{
  var handlers = read.handlers,
      n = handlers.length - 1;
  
  for (var i = n; i >= 0; i--)
  {
    if (handlers[i].pattern.test(path))
    {
      return handlers[i].handler(path, doneFn);
    }
  }
}

read.handlers = [ /* { pattern: regex, handler: fn } */ ];

read.addMatcher = function (pattern, handler) {
  read.handlers.push({
    pattern:pattern,
    handler:handler
  });
}

read.clearCustomMatchers = function () {
  read.handlers = []
}

module.exports = read