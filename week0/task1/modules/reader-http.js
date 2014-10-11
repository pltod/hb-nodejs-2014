// TODO add http support
var https = require('https');

module.exports = function (url, callback) { 
    https.get(url, function(res) {
      res.on('data', function(data) {
        callback(data.toString());
      });
    })
    .on('error', function(e) {
      console.log("Got error: " + e.message);
    });  
}