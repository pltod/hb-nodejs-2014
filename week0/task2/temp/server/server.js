var http = require('http');
var _ = require('underscore');

var allMiddleware = [
  {method: 'GET', url: '/', handler: function (payload) {return 'WELCOME TO CHIRP REST SERVER!'}}
];

module.exports = {
  start: function (port) {
    var p = port || 8080
    http.createServer(function (req, res) {
      var URL = req.url;
      var METHOD = req.method;
      var payload = "";

      req.on('data', function(chunk) {
        payload = chunk.toString();
      });

      req.on('end', function() {
      
      var middleware = _.findWhere(allMiddleware, {method: METHOD, url: URL});
      //TODO Invoke many in order for example add logger on all requests; body parser on post requests etc.
      if (middleware) {
        try {
          
          // TODO add async operation support
          res.writeHead(200, "OK", {'Content-Type': 'text/json'});  
          res.end(JSON.stringify(middleware.handler(payload)));
        } catch (e) {
          
        }
      } else {
        res.writeHead(404, "KO", {'Content-Type': 'text/json'});
        res.end('PATH NOT SUPPORTED!');
      }
        //find middleware and execute
        //on error return 404
        //if missing return missing
        //on success return
          //res.writeHead(200, "OK", {'Content-Type': 'text/json'});
          
      });

    }).listen(p);
    
    console.log('Server started on port: ' + p);    
  },
  add: function (middleware) {
    allMiddleware.push(middleware)
  }
}
