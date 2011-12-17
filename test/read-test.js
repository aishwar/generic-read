var should = require('should');

var fs = require('fs'),
    http = require('http'),
    https = require('https');

var fsFile = __dirname + '/fixture.txt',
    httpFile = 'http://www.google.com/',
    httpsFile = 'https://www.google.com/';

var fsFileContent = fs.readFileSync(fsFile);

describe("read", function () {
  it("reads files from the file system", function (done) {
    
  });
});
