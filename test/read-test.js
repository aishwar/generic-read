var should = require('should'),
    read = require('../read');

var fs = require('fs'),
    http = require('http'),
    https = require('https');

var fsFile = __dirname + '/fixture.txt',
    httpFile = 'http://www.google.com/',
    httpsFile = 'https://www.google.com/';

var fsFileContent = fs.readFileSync(fsFile);

describe("read", function () {

  describe("interface", function () {
    it ("provides an addMatcher method", function () {
      should.exist(read.addMatcher)
    });
    
    it ("provides a clearCustomMatchers method", function () {
      should.exist(read.clearCustomMatchers)
    });
  });
  
  beforeEach(function () {
    read.clearCustomMatchers();
  });

  describe("addMatcher", function () {
    it ("responds to a matched handler", function (done) {
    
      read.addMatcher(/a/, function (path, callback) {
        callback(null, 'done');
      });
      
      read('a', function (err, body) {
        should.not.exist(err);
        body.should.equal('done');      
        done();
      });
      
    });
    
    //it ("responds to only one matched handler", functin (done) {});
  });

  describe("read", function () {
    it("reads files from the file system", function (done) {
    
      read(fsFile, function (err, body) {
        should.not.exist(err);
        body.should.equal(fsFileContent.toString());
        done();
      });
      
    });
    
    //it("reads files from HTTP", function (done) {});
    //it("reads files from HTTPS", function (done) {});
    
  });

});
