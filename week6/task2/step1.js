var fs = require('fs');
var http = require('http');


var server = http.createServer(function (req, res) {
  fs.createReadStream('README.md').pipe(res);
})

server.listen()