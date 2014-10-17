var client = require("./client");
var args = require("minimist")(process.argv.slice(2));
var commands = Object.keys(args);

if (args.help || args.h) {
  printHelp();
  return;
} 

(commands.indexOf('all_users') === 1) && allUsers();
(commands.indexOf('all_chirps') === 1) && allChirps();
(commands.indexOf('register') === 1) && register();
(commands.indexOf('chirp') === 1) && chirp();
(commands.indexOf('my_chirps') === 1) && myChirps();
(commands.indexOf('chirps') === 1) && chirps();


function allUsers() {
  client.getAllUsers();
}

function allChirps() {
  client.getAllChirps();
}

function register() {
  if(args.user) {
    console.log(JSON.parse(getConfig()));
  } else {
    printHelp();
  }
}


function chirp() {
  if (args.user && args.key && args.chirpText) {
    
  } else if(args.user && args.chirpId) {
    
  } else {
    printHelp();
  }
}

function myChirps() {
  if (args.user && args.key) {
    
  } else {
    printHelp();
  }
}

function chirps() {
  if (args.key || args.chirpId) {
    
  } else {
    
  }
}


function readFile(fileName) {
  return fs.readFileSync(fileName, 'utf-8');
}

function getConfig() {
  return readFile('config.json');
}

function printHelp() {
  var fs = require('fs');
  console.log(readFile('usage.txt'));
}