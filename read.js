var pattern = {
  http: /^http\:\/\//,
  https: /^https\:\/\//,
  fs: /.*/
}

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
  read.handlers = [];
  addDefaultReadHandlers();
}

function addDefaultReadHandlers()
{
  addFSReadHandler();
  //addHTTPReadHandler();
  //addHTTPSReadHandler();
}

function addFSReadHandler()
{
  read.addMatcher(/./, function (path, done) {
  
    require('fs').readFile(path, function (err, data) {
      data = data ? data.toString() : null
      done(err, data);
    });
    
  });
}

/*
function addHTTPReadHandler()
{
}

function addHTTPSReadHandler()
{
}
*/
module.exports = read
