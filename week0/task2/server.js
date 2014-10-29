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

  debug('Call accepted at: ' + path);
  debug('URL parameters: ' + JSON.stringify(query));
        
  req.on('data', function(chunk) {
    payload = chunk.toString();
    debug(payload)
  });

  req.on('end', function() {
    var p;
    
    debug('Complete Payload: ' + payload);
    if (payload) {
      p = JSON.parse(payload);
    }
    
    (METHOD === "GET" && path === "/all_chirps") && execute(db.findAllChirps, [], res, 409);
    (METHOD === "GET" && path === "/all_users") && execute(db.findAllUsers, [], res, 409);
    (METHOD === "GET" && path === "/my_chirps") && execute(db.findUserChirps, [query.user, query.key], res, 409);
    (METHOD === "GET" && path === "/chirps") && wrapChirps(res);

    (METHOD === "POST" && URL === "/register") && execute(db.insertUser, [p], res, 409);
    (METHOD === "POST" && URL === "/chirp") && execute(db.insertChirp, [p.key, p.chirpText], res, 409);

    (METHOD === "DELETE" && URL === "/chirp") && execute(db.deleteChirp, [p.key, p.chirpId], res, 403);
    
  });

}).listen(port, function (err) {
  if (err) throw err
  console.log('Chirp API live at: ' + port);
});

function wrapChirps(res) {
  if (query.userId) {
    execute(db.findUserById, [query.userId], res, 409);
  } else {
    execute(db.findChirpById, [query.chirpId], res, 409);    
  }
}

function execute(f, params, res, errorCode) {
  var data;
  var code;
  try {            
    data = f.apply(db, params);
    code = 200;
  } catch(e) {
    data = e.toString();
    code = errorCode;
  }
  
  pong(res, code, data);
}

function pong(res, code, data) {
  res.writeHead(code, {'Content-Type': 'application/json'});
  debug(data);
  (typeof data === "string") ? res.write(data) : res.write(JSON.stringify(data));
  res.end();
}
