var debug = require('debug')("chirp-api-server");
var http = require('http');
var url = require('url') ;
var db = require('./db');
var port = 8080;

http.createServer(function (req, res) {
  var URL = req.url;
  var METHOD = req.method;
  var path = url.parse(URL,true).pathname;
  var query = url.parse(URL,true).query;  
  var payload = "";

  debug('API accepted on path: ' + path);
  debug('URL parameters: ' + JSON.stringify(query));
        
  req.on('data', function(chunk) {
    payload = chunk.toString();
  });

  req.on('end', function() {
    var result;
    
    res.writeHead(200, "OK", {'Content-Type': 'text/html'});
    
    if (isGET(METHOD) && path === "/all_chirps") {
      res.end(JSON.stringify(db.findAllChirps()));
      
    } else if (isGET(METHOD) && path === "/all_users") {
      res.end(JSON.stringify(db.findAllUsers()));
      
    } else if (isGET(METHOD) && path === "/my_chirps") {
      res.end(JSON.stringify(db.findUserChirps(query.user, query.key)));
      
    } else if (isGET(METHOD) && path === "/chirps") {
      if (query.userId) {
        res.end(JSON.stringify(db.findUserById(query.userId)));
      } else {
        res.end(JSON.stringify(db.findChirpById(query.chirpId)));
      }
      
    } else if (isPOST(METHOD) && URL === "/chirp") {
      debug('Payload: ' + payload);
      var p = JSON.parse(payload)
      try {
        result = db.insertChirp(p.key, p.chirpText)
      } catch (e) {
        result = e.toString();
        result.statusCode = 409;
      }
      res.end(result);

    } else if (isPOST(METHOD) && URL === "/register") {
      debug('Payload: ' + payload);
      try {
        result = db.insertUser(JSON.parse(payload));
      } catch (e) {
        result = e.toString();
        res.statusCode = 409;  
      }
      res.end(result);
    } else if (isDELETE(METHOD) && URL === "/chirp") {
      debug('Payload: ' + payload);
      var p = JSON.parse(payload)
      try {            
        result = res.end(db.deleteChirp(p.key, p.chirpId))
      } catch(e) {
        result = e.toString();
        res.statusCode = 403;
      }
      res.end(result);
    } else if (isGET(METHOD) && path === "/") {
      res.end("WELCOME TO CHIRP API!");
      
    } else {
      res.end("NO API ENDPOINT HERE!");
    }
  });

}).listen(port, function (err) {
  if (err) throw err
  
  console.log('Chirp API live at: ' + port);
});


function isPOST(method) {
  return method === "POST";
}

function isDELETE(method) {
  return method === "DELETE";  
}

function isGET(method) {
  return method === "GET";
}

