var http = require('http');

exports.get = function (url, callback) { 
  http.get(url, function(res) {
    var payload = "";
    res.on('data', function(data) {
      payload = payload.concat(data);
    });
    
    res.on('end', function () {
      callback(payload.toString());
    })
  })
  .on('error', function(e) {
    console.log("Got error: " + e.message);
  });  
}  

exports.post = function (path, userData, callback) {

  // TODO construct it from config  
  var options = {
    hostname: 'localhost',
    port: 8080,
    method: 'POST',
    path: path
  };
  
  var req = http.request(options, function(res) {
    res.on('data', function (chunk) {
      callback(chunk.toString());
    });
  });
  
  req.on('error', function(e) {
    console.log('problem with request: ' + e.message);
  });

  req.write(JSON.stringify(userData));
  req.end();
}