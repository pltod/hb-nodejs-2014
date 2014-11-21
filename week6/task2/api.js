var debug = require('debug')('snippet-app-api');
var fs = require('fs');

module.exports = function (app) {

  app.get("/hello", function(req, res) {
    debug('hello...');
    var dataLength = 0;
    var rs = fs.createReadStream('README.md');
    
    rs
      .on('data', function (chunk) {
        dataLength += chunk.length;
      })
      .on('end', function () {
        debug('The length was: ' + dataLength + ' bytes');
      });
    
    rs.pipe(res);
    
  });  

  app.get("/pull", function(req, res) {
    debug('hello...');
    var dataLength = 0;
    var rs = fs.createReadStream('README.md');
    
    rs
      .on('readable', function () {
         var chunk;
         var all = "";
         while (null !== (chunk = rs.read())) {
           dataLength += chunk.length;
           all = all.concat(chunk);
         }
         
         pong(res, 200, all);
       })
      .on('end', function () {
        debug('The length was: ' + dataLength + ' bytes');
        
      });
    
  });  
  
  return app;
}

function pong(res, code, data) {
  res.writeHead(code, {'Content-Type': 'application/json'});
  debug(data);
  (typeof data === "string") ? res.write(data) : res.write(JSON.stringify(data));
  res.end();
}