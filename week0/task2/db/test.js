var debug = require('debug')('db-test');
var test = require("tape");
var _ = require('underscore');
var dbUtils = require("./db-utils");
var db = require("./db");

var testUsers = [
  {"user": 'Zero', "userId": dbUtils.uid(), "chirps": []},
  {"user": 'One', "userId": dbUtils.uid(), "chirps": [{"chirpId": dbUtils.uid(), "chirpTime": dbUtils.date(), "chirpText": "hello"}]},  
  {"user": 'Two', "userId": dbUtils.uid(), "chirps": [{"chirpId": dbUtils.uid(), "chirpTime": dbUtils.date(), "chirpText": "I am user Two"}, {"chirpId": dbUtils.uid(), "chirpTime": dbUtils.date(), "chirpText": "hallouuu"}]}
];

function getInitialChirpsNumber() {
  return _.reduce(testUsers, function (memo, user) {
    return memo + user.chirps.length;
  }, 0)
}


test('### Reinit DB ###', function(t) {
  t.equal(0, db.findAllUsers().length, 'DB is empty');
  db.reinit(testUsers);
  t.equal(testUsers.length, db.findAllUsers().length, 'DB reinit successfull');
  t.end();
});

test('### Find All Users ###', function(t) {
  db.reinit(testUsers);  
  var users = db.findAllUsers();
  t.equal(testUsers.length, users.length, 'All users found');
  t.end();
});

test('### Insert User ###', function(t) {
  db.reinit(testUsers);
  var userId = db.insertUser({"user": "Temp"});
  t.ok(userId, 'inserted user with id: ' + userId);
  t.equal(testUsers.length + 1, db.findAllUsers().length, 'the number of users in the DB after insert are correct');
  t.end();
});

test('### Find User ###', function(t) {
  db.reinit(testUsers);  
  var u = testUsers[2].user;
  var id = testUsers[2].userId;
  
  t.ok(db.isUserExists(u, id), 'user ' + u + ' exist');
  
  var user = db.findUser(u, id);
  t.ok(user, 'user data for ' + u + ' obtained')

  t.end();
});

test('### Find User By ID only ###', function(t) {
  db.reinit(testUsers);  
  var u = testUsers[2].user;
  var id = testUsers[2].userId;
  
  var user = db.findUserById(id);
  t.ok(user, 'user data for ' + u + ' obtained')

  t.end();
});

test('### Find Fake User ###', function(t) {
  db.reinit(testUsers);  
  t.notOk(db.isUserExists('fake', 1), 'fake user does not exist');
  t.equal(undefined, db.findUser('fake', 1), 'fake user data can not be obtained')
  t.end();
});

test('### Find All Chirps ###', function(t) {
  db.reinit(testUsers);  
  var chirps = db.findAllChirps();
  t.equal(getInitialChirpsNumber(), chirps.length, 'All chirps found');
  t.end();
});

test('### Insert Chirp ###', function(t) {
  db.reinit(testUsers);  
  var chirpId = db.insertChirp(testUsers[2].userId, "My chirp text");
  t.ok(chirpId, 'inserted chirp with id: ' + chirpId);
  var chirps = db.findAllChirps();  
  t.equal(getInitialChirpsNumber()+1, chirps.length, 'the number of chirps in the DB after insert are correct');
  t.end();
});

test('### Insert Chirp Wrong User ###', function(t) {
  db.reinit(testUsers);
  function f() {
    db.insertChirp(111, "My chirp text");  
  }  
  t.throws(f, 'insert chirp failure due to wrong user id');
  t.end();
});


test('### Delete Chirp ###', function(t) {
  db.reinit(testUsers);  
  var chirps = db.findAllChirps();
  var sizeBefore = chirps.length;
  var sizeAfter;
    
  db.deleteChirp(testUsers[2].userId, testUsers[2].chirps[0].chirpId);
  chirps = db.findAllChirps();
  sizeAfter = chirps.length;
  t.equal(sizeBefore, sizeAfter + 1, 'the number of chirps in the DB after deletion are correct');
  t.end();
});

test('### Delete Chirp With Wrong User Id ###', function(t) {
  db.reinit(testUsers);  
  function f() {
    db.deleteChirp(111, testUsers[2].chirps[0].chirpId)
  }
  t.throws(f, 'Wrong user id so chirp can not be deleted');
  t.end();
});

test('### Delete Chirp With Wrong Chirp Id ###', function(t) {
  db.reinit(testUsers);  
  function f() {
    db.deleteChirp(testUsers[2].userId, 111)  
  }
  t.throws(f, 'Wrong chirp id so it can be deleted');
  t.end();
});

test('### Find User Chirps ###', function(t) {
  db.reinit(testUsers);
  var chirps = db.findUserChirps(testUsers[2].user, testUsers[2].userId);
  t.equal(testUsers[2].chirps.length, chirps.length, 'User chirps found');
  t.end();
});

test('### Find Chirp By Id ###', function(t) {
  db.reinit(testUsers);
  var chirps = db.findChirpById(testUsers[2].chirps[0].chirpId);
  t.equal(1, chirps.length, 'Exactly 1 chirp found');
  t.equal(testUsers[2].chirps[0].chirpId, chirps[0].chirpId, 'It is the one we are looking for');  
  t.end();
});
