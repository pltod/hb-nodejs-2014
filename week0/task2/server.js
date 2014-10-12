var http = require('http');

// In the form objects with: user, key, chirps[]
var DB = [
{"user": "One", "key": 1, "chirps": ['test1', "test2"]}, 
{"user": "Two", "key": 2, "chirps": ['test3']}
];

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
      res.end(getAllChirps());
    } else if (isGET(METHOD) && URL === "/all_users") {
      res.end(getAllUsers());
    } else if (isGET(METHOD) && URL === "/my_chirps") {
      res.end(getMyChirps());
    } else if (isPOST(METHOD) && URL === "/chirp") {
      res.end(postChirp());
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

}).listen(9615);

function getMyChirps() {
  return "MY CHIRPS";  
}

function postChirp() {
  return "CHIRP POSTED";  
}

function getAllChirps() {
  if (DB.length === 0) {
    return "THERE ARE NO CHIRPS AT ALL!";    
  }
  return DB.reduce(function (previous, current) {
    return previous.concat(current.chirps);
  }, []).toString();
}

function getAllUsers() {
  if (DB.length === 0) {
    return "THERE ARE NO USERS AT ALL!";    
  }
  return DB.reduce(function (previous, current) {
    return previous.concat(current.user);
  }, []).toString();
}

function register(payload) {
  DB.push(payload);
  return DB.toString();  
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

