var debug = require('debug')('chirp-api-client');
var log = console.log;
var fs = require('fs');

var request = require("./chirp-api-connector");
var configFile = 'config.json';
var configContent = JSON.parse(readFile(configFile));
debug(configContent);
var args = require("minimist")(process.argv.slice(2));
var commands = Object.keys(args);


if (args.help || args.h) {
  printHelp();
  return;
} 

(commands.indexOf('register') === 1) && register();
(commands.indexOf('create') === 1) && createChirp();
(commands.indexOf('getall') === 1) && getAllChirps();
(commands.indexOf('getself') === 1) && getMyChirps();
(commands.indexOf('delete') === 1) && deleteChirp();
(commands.indexOf('getallusers') === 1) && getAllUsers();


function register() {
  debug('Registering user...')
  var data = {};
  if(args.user) {
    data.user = args.user;
    request.post('/register', data, function (status, key) {
      (status === 200) ? (function () {log('User registered with ID: ' + key); updateConfig(args.user, key)})() : log(key)
    })
  } else {
    console.log('You must specify user name. See help: ');
    printHelp();
  }
}

function deleteChirp() {
  debug('Deleting chirp...')
  var data = {
    user: configContent.user,
    key: configContent.key,
    chirpId: args.chirpId  
  };
  if (isValidConfig()) {
    if(args.chirpId) {
      request.delete('/chirp', data, function (status, key) {
        (status === 200) ? log('Deleted chirp with ID: ' + key) : log(key)
      })      
    } else {
      console.log('You must specify chirp id. See help: ');
      printHelp();      
    }
  }
}

function createChirp() {
  debug('Creating chirp...')
  var data = {
    user: configContent.user,
    key: configContent.key,
    chirpText: args.message  
  };
  if (isValidConfig()) {
    if(args.message) {
      request.post('/chirp', data, function (status, key) {
        (status === 200) ? log('Registered chirp with ID: ' + key) : log(key)
      })      
    } else {
      console.log('You must specify message. See help: ');
      printHelp();      
    }
  }
}

function getMyChirps() {
  debug('Getting my chirps...')
  var url = configContent.api_url + '/my_chirps?user='+configContent.user+'&key='+configContent.key
  debug(url);
  if (isValidConfig()) {
    request.get(url, function (status, myChirps) {
      (status === 200) ? log(myChirps) : log(key)      
    })      
  }
}

function getAllChirps() {
  debug('Getting all chirps...')  
  request.get(configContent.api_url + '/all_chirps', function (status, allChirps) {
    (status === 200) ? log(allChirps) : log(key)    
  })      
}

function getAllUsers() {
  debug('Getting all users...')  
  request.get(configContent.api_url + '/all_users', function (status, allUsers) {
    (status === 200) ? log(allUsers) : log(key)
  })      
}

function printHelp() {
  console.log(readFile('usage.txt'));
}

function isValidConfig() {
  return (configContent.key == undefined || configContent.user == undefined) ? (function () { console.log('Please register user first!'); return false})() : true;
}

function updateConfig(user, key) {
  
  var newContent = {
    api_url: configContent.api_url,
    user: user,
    key: key
  }
  fs.writeFileSync(configFile, JSON.stringify(newContent), 'utf-8');
  configContent = newContent;
  debug('New config content: ' + JSON.stringify(configContent))
}

function readFile(fileName) {
  return fs.readFileSync(fileName, 'utf-8');
}

