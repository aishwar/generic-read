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

  describe("#addMatcher", function () {
    it ("responds to the first matched handler", function (done) {
      
      read.addMatcher(/aa/, function (path, callback) {
        callback(null, 'aa');
      });
      
      read.addMatcher(/aa/, function (path, callback) {
        callback('Should not run 2nd matched handler', null);
      });
      
      read('aa', function (err, body) {
        should.not.exist(err);
        body.should.equal('aa');
        done();
      });
      
    });
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
