var should = require('should'),
    read = require('../generic-read');

var fs = require('fs'),
    http = require('http'),
    https = require('https');

var fsFile = 'test/fixtures/content.txt',
    httpUrl = 'http://localhost:8080',
    httpsUrl = 'https://localhost:8443';

var fsFileContent = fs.readFileSync(fsFile).toString(),

    httpServer = http.createServer(function (req, res) {
      res.end(fsFileContent);
    }).listen(8080),
    
    httpsServer = https.createServer({
      key: fs.readFileSync('test/fixtures/privatekey.pem'),
      cert: fs.readFileSync('test/fixtures/certificate.pem')
    }, function (req, res) {
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
      read.addMatcher(/bb/, function (path, callback) {
        callback('This is an unmatched handler. This should not be called', null);
      });
      
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
  
  
  it("reports an error when read from file system fails", function (done) {
    read('test/non-existant.file', function (err, body) {
      should.exist(err);
      done();
    });
  });
  
  
  it("reads files from HTTP", function (done) {
    read(httpUrl, function (err, body) {
      should.not.exist(err);
      body.should.equal(fsFileContent);
      done();
    });
  });
  
  it("reports an error when read is invoked on non-existant http source", function (done) {
    read('http://nonexistant:11', function (err, body) {
      should.exist(err);
      done();
    });
  });
  
  it("reports an error when read is invoked on malformed url", function (done) {
    read('http://#malformed', function (err, body) {
      should.exist(err);
      done();
    });
  });
  
  it("reads files from HTTPS", function (done) {
    read(httpsUrl, function (err, body) {
      should.not.exist(err);
      body.should.equal(fsFileContent);
      done();
    });
  });
  
  
  after(function () {
    httpServer.close();
    httpsServer.close();
  });
});
