var debug = require('debug')("chirp-api-server");
var http = require('http');
var db = require('./db');
var port = 8080;

http.createServer(function (req, res) {
  var URL = req.url;
  var METHOD = req.method;

  var payload = "";
  
  console.log(JSON.stringify(req.body));
      
  req.on('data', function(chunk) {
    console.log("Received body data:");
    payload = chunk.toString();
  });

  req.on('end', function() {
    
    console.log('Ending...');
    console.log(payload);
    
    res.writeHead(200, "OK", {'Content-Type': 'text/html'});
    
    if (isGET(METHOD) && URL === "/all_chirps") {
      res.end(JSON.stringify(getAllChirps()));
    } else if (isGET(METHOD) && URL === "/all_users") {
      res.end(JSON.stringify(getAllUsers()));
    } else if (isGET(METHOD) && URL === "/my_chirps") {
      res.end(JSON.stringify(getMyChirps()));
    } else if (isPOST(METHOD) && URL === "/chirp") {
      debug('API accept create chirp call with data: ');
      debug(payload);
      var p = JSON.parse(payload)
      res.end(db.insertChirp(p.key, p.chirpText));
    } else if (isPOST(METHOD) && URL === "/register") {
      debug('API accept register call with data: ');
      debug(payload);
      res.end(db.insertUser(JSON.parse(payload)));
    } else if (isDELETE(METHOD) && URL === "/chirp") {
      res.end(deleteChirp())
    } else if (isGET(METHOD) && URL === "/") {
      res.end("WELCOME TO CHIRP API!");
    } else {
      res.end("NO API ENDPOINT HERE!");
    }
  });

}).listen(port, function (err) {
  if (err) throw err
  
  console.log('Chirp API live at: ' + port);
});

function getMyChirps() {
  return "MY CHIRPS";  
}

function postChirp(payload) {
  var p = JSON.parse(payload)
  console.log(p);
  return db.insertChirp(p.key, p.message);  
}

function getAllChirps() {
  return db.findAllChirps();
}

function getAllUsers() {
  return db.findAllUsers();
}

function getUserChirps() {
  return "USER CHIRPS";
}

function deleteChirp() {
  return "CHIRP DELETED";
}

function isPOST(method) {
  return method === "POST";
}

function isDELETE(method) {
  return method === "DELETE";  
}

function isGET(method) {
  return method === "GET";
}

