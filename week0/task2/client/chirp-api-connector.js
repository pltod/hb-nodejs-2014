var debug = require('debug')('chirp-api-connector');
var http = require('http');

exports.get = function (url, callback) { 
  http.get(url, function(res) {
    var payload = "";
    res.on('data', function(data) {
      payload = payload.concat(data);
    });
    
    res.on('end', function () {
      callback(res.statusCode, payload.toString());
    })
  })
  .on('error', function(e) {
    console.log("Got error: " + e.message);
  });  
}  

exports.post = function (path, userData, callback) {

  var options = {
    hostname: 'localhost',
    port: 8080,
    method: 'POST',
    path: path
  };
  
  handleRequest(options, userData, callback);
}

exports.delete = function (path, userData, callback) {

  var options = {
    hostname: 'localhost',
    port: 8080,
    method: 'DELETE',
    path: path
  };
  debug(userData);
  handleRequest(options, userData, callback);
}

function handleRequest(options, userData, callback) {
  var req = http.request(options, function(res) {
    res.on('data', function (chunk) {
      callback(res.statusCode, chunk.toString());
    });
  });
  
  req.on('error', function(e) {
    console.log('problem with request: ' + e.message);
  });

  req.write(JSON.stringify(userData));
  req.end();
}