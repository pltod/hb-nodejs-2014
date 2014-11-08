var debug = require('debug')('chirp-api-client');
var log = console.log;
var fs = require('fs');
var url = require('url');

var api = require('../../shared/io/reader-writer/node-http');
//var request = require("./chirp-api-facade"); //remove this one

var config = require('./config.json');
var configFileName = "config.json";
var serverOptions = url.parse(config.api_url);
debug(serverOptions);

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
    api.httpPost(getRequestOptions('/register'), data, function (err, status, data) {
      if (err) throw err;
      (status === 200) ? (function () {log('User registered with ID: ' + data); updateConfig(args.user, data)})() : log('Server status ' + status + '. Problem with registering user due to ' + data)
    })
  } else {
    console.log('You must specify user name. See help: ');
    printHelp();
  }
}

function deleteChirp() {
  debug('Deleting chirp...')
  var data = {
    user: config.user,
    key: config.key,
    chirpId: args.chirpId  
  };
  if (isValidConfig()) {
    if(args.chirpId) {
      api.httpDelete(getRequestOptions('/chirp'), data, function (err, status, data) {
        (status === 200) ? log('Deleted chirp with ID: ' + data) : log(data)
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
    user: config.user,
    key: config.key,
    chirpText: args.message  
  };
  if (isValidConfig()) {
    if(args.message) {
      api.httpPost(getRequestOptions('/chirp'), data, function (err, status, data) {
        if (err) throw err;
        (status === 200) ? log('Registered chirp with ID: ' + data) : log(data)
      })      
    } else {
      console.log('You must specify message. See help: ');
      printHelp();      
    }
  }
}

function getMyChirps() {
  debug('Getting my chirps...')
  var url = config.api_url + '/my_chirps?user='+config.user+'&key='+config.key
  debug(url);
  if (isValidConfig()) {
    api.httpGet(url, function (err, status, data) {
      if (err) throw err;
      (status === 200) ? log(data) : log(data)      
    })      
  }
}

function getAllChirps() {
  debug('Getting all chirps...')  
  api.httpGet(config.api_url + '/all_chirps', function (err, status, data) {
    if (err) throw err;
    (status === 200) ? log(data) : log(data)    
  })      
}

function getAllUsers() {
  debug('Getting all users...')  
  api.httpGet(config.api_url + '/all_users', function (err, status, data) {
    if (err) throw err;
    (status === 200) ? log(data) : log(data)
  })      
}

function isValidConfig() {
  return (config.key == undefined || config.user == undefined) ? (function () { console.log('Please register user first!'); return false})() : true;
}

function updateConfig(user, key) {
  
  var newContent = {
    api_url: config.api_url,
    user: user,
    key: key
  }
  fs.writeFileSync(configFileName, JSON.stringify(newContent), 'utf-8');
  config = newContent;
  debug('New config content: ' + JSON.stringify(config))
}

function getRequestOptions(path) {
  return {
    hostname: serverOptions.hostname,
    port: serverOptions.port,
    path: path
  }
}

function printHelp() {
  console.log(fs.readFileSync('usage.txt', 'utf-8'));
}