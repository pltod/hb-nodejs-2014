var https = require('https');

module.exports = function (url, callback) { 
  https.get(url, function(res) {
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