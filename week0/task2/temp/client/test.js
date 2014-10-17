var test = require("tape");
var client = require("./client");

test('### Home Page ###', function(t) {
  client.getHome(function (data) {
    t.equal("WELCOME TO CHIRP!", data);
    t.end();
  })
});


