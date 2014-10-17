var fs = require('fs');

module.exports = function (file, callback) { 
  fs.readFile(file, 'utf-8', function (err, data) {
    if (err) throw err;
    callback(data.toString());
  });
}