var should = require('should'),
    read = require('../read');

var fs = require('fs'),
    http = require('http'),
    https = require('https');

var fsFile = __dirname + '/fixture.txt',
    httpFile = 'http://localhost:8080',
    httpsFile = 'https://localhost:8443';

var fsFileContent = fs.readFileSync(fsFile).toString(),
    httpServer = http.createServer(function (req, res) {
      res.end(fsFileContent);
    }).listen(8080),
    httpsServer = https.createServer(function (req, res) {
      res.end(fsFileContent);
    }).listen(8443);




describe("read:", function () {
  beforeEach(function () {
    read.clearCustomMatchers();
  });


  describe("interface", function () {
    it ("provides an addMatcher method", function () {
      should.exist(read.addMatcher)
    });
    
    it ("provides a clearCustomMatchers method", function () {
      should.exist(read.clearCustomMatchers)
    });
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
  
  
  it("reads files from the file system", function (done) {
  
    read(fsFile, function (err, body) {
      should.not.exist(err);
      body.should.equal(fsFileContent);
      done();
    });
    
  });
  
  it("reads files from HTTP", function (done) {
  
    read(httpFile, function (err, body) {
      should.not.exist(err);
      body.should.equal(fsFileContent);
      done();
    });
    
  });
  //it("reads files from HTTPS", function (done) {});
  
  
  after(function () {
    httpServer.close();
    httpsServer.close();
  });
});
