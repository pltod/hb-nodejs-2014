// TODO 
// Invocable on command line
// Parse arguments and uses client.js

var client = require("./client");
var method = process.argv[2];

console.log(method);

if (method == null) {
  //null or undefined
  client.getHome(print)
} else if (method.indexOf("/all_chirps") !== -1) {
  client.getAllChirps(print)
} else if (method.indexOf("/all_users") !== -1) {
  client.getAllUsers(print)
} else if (method.indexOf("/register") !== -1) {
  client.register({"username": "testUser"}, print);
}

function print (data) {
  console.log(data);
}