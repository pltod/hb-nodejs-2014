var http = require('http');
var https = require('https');

module.exports = {
  http: readHttp,
  https: readHttps
}

function readHttp(url, callback) {
  read(http, url, callback)
}

function readHttps(url, callback) {
  read(https, url, callback)
}

function read(protocol, url, callback) { 
  protocol.get(url, function(res) {
    var payload = "";
    res.on('data', function(data) {
      payload = payload.concat(data);
    });
    
    res.on('end', function () {
      callback(null, payload.toString());
    })
  })
  .on('error', function(e) {
    callback(e, null);
  });  
}
