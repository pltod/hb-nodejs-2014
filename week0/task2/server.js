var http = require('http');
var db = require('./db');


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
      res.end(postChirp(payload));
    } else if (isPOST(METHOD) && URL === "/register") {
      res.end(register(payload));
    } else if (isDELETE(METHOD) && URL === "/chirp") {
      res.end(deleteChirp())
    } else if (isGET(METHOD) && URL === "/") {
      res.end("WELCOME TO CHIRP!");
    } else {
      res.end("PATH NOT FOUND!");
    }
  });

}).listen(8080);

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

function register(payload) {
  return db.insertUser(JSON.parse(payload));
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

