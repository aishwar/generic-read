generic-reader
--------------

Writing node.js projects, I have often had to read files from various sources (file system, http, https). Writing out the code for each was frustrating. I did not want to spend time writing code for the different data sources; I wanted to spend that time building more interesting things!

I thought "one unified interface that I can use all the time would be great". That is what this is.

Examples:
=========

Include the package:

  var read = require('generic-read');

Reading from the file system:

  read('test.txt', function (err, body) {
    if (err) throw err;
    console.log(body);
  });

Reading from HTTP:

  read('http://www.google.com/', function (err, body) {
    if (err) throw err;
    console.log(body);
  });

Reading from HTTPS:

  read('https://www.google.com/', function (err, body) {
    if (err) throw err;
    console.log(body);
  });

