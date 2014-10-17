var http = require('http');

module.exports = function (url, callback) { 
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