var http = require("http");

var options = {
  hostname: 'localhost',
  port: 9615,
  method: 'POST'
};

module.exports = {
  getHome: function (callback) {
    http.get("http://localhost:9615", function(res) {
      res.on("data", function(data) {
        callback(data.toString());
      });
    });
  },
  getAllChirps: function (callback) {
    http.get("http://localhost:9615/all_chirps", function(res) {
      res.on("data", function(data) {
        callback(data.toString());
      });
    });
  },
  getAllUsers: function (callback) {
    http.get("http://localhost:9615/all_users", function(res) {
      res.on("data", function(data) {
        callback(data.toString());
      });
    });
  },
  register: function (userData, callback) {
    options.path = "/register";
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
}
