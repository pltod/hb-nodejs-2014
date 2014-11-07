var http = require('http');
var https = require('https');

module.exports = {
  async: httpsGet,
  httpGet: httpGet,
  httpsGet: httpsGet,
  httpPost: httpPost 
}

function httpGet(url, callback) {
  doGet(http, url, callback)
}

function httpsGet(url, callback) {
  doGet(https, url, callback)
}

function httpPost(options, callback) {
  doPost(http, options, callback)
}

function doPost(protocol, options, callback) {
  protocol.request(options, function(res) {
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
  }).
  end();
}

function doGet(protocol, url, callback) { 
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
