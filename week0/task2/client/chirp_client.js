var debug = require('debug')('parse');
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

(commands.indexOf('mygetallusers') === 1) && getAllUsers();


function register() {
  debug('Registering user...')
  var data = {};
  if(args.user) {
    data.user = args.user;
    request.post('/register', data, function (key) {
      debug('Registered user with ID: ' + key);
      updateConfig(args.user, key)
    })
  } else {
    console.log('You must specify user name. See help: ');
    printHelp();
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
      request.post('/chirp', data, function (key) {
        debug('Registered chirp with ID: ' + key)
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
    request.get(url, function (myChirps) {
      console.log(myChirps)
    })      
  }
}

function getAllChirps() {
  debug('Getting all chirps...')  
  request.get(configContent.api_url + '/all_chirps', function (allChirps) {
    console.log(allChirps)
  })      
}

function getAllUsers() {
  debug('Getting all users...')  
  request.get(configContent.api_url + '/all_users', function (allUsers) {
    console.log(allUsers)
  })      
}

function printHelp() {
  console.log(readFile('usage.txt'));
}

function isValidConfig() {
  if (configContent.key == undefined || configContent.user == undefined) {
    console.log('Please register user first!');
    return false;
  } else {
    return true;    
  }
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

