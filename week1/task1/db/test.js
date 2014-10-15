var debug = require('debug')('db-test');
var test = require("tape");
var _ = require('underscore');
var db = require("./db");

var collection = 'subscribers.json';
var collection2 = 'maxitem.json';

var data = [
  {"email": "1@4th.dim", "keywords": ["coffee", "destruction", "omniscience"]},
  {"email": "2@4th.dim", "keywords": ["nodejs", "javascript"]}
];
var item = {"email": "3@4th.dim", "keywords": ["nodejs", "javascript"]};

test('### Insert Many and Find All ###', function(t) {
  db.insertMany(collection, data);
  var obtained = db.findAll(collection);
  
  t.deepEqual(data, obtained, 'DB init successfully and data has been found');
  t.end();
});

test('### Delete All ###', function(t) {
  var existing = db.findAll(collection);
  t.equal(data.length, existing.length, data.length + " records exists")
  db.rmAll(collection);
  t.equal(0, db.findAll(collection).length, 'everything has been removed!')
  t.end();
});

test('### Insert Many with UID ###', function(t) {
  db.insertManyWithID(collection, data);
  var obtained = db.findAll(collection);
  debug(obtained);
  t.ok(obtained[0].uid, 'UID has been generated');
  t.end();
});

test('### Insert Item ###', function(t) {
  db.rmAll(collection);  
  db.insert(collection, item);
  var obtained = db.findAll(collection);
  t.equal(1, obtained.length, 'Item has been inserted');
  t.end();
});

test('### Insert Item With ID ###', function(t) {
  db.rmAll(collection);  
  var generatedId = db.insertWithID(collection, item);
  t.ok(generatedId, 'The generated id is returned after generation');
  var obtained = db.findAll(collection);
  t.equal(1, obtained.length, 'Item has been inserted');
  t.ok(obtained[0].uid, 'Item has uid property')
  t.end();
});

test('### Remove Item ###', function(t) {
  db.rmAll(collection);
  db.insertManyWithID(collection, data);
  var obtained = db.findAll(collection);
  var item = obtained[0];
  db.rm(collection, item.uid);
  var obtained2 = db.findAll(collection);
  t.equal(obtained.length-1, obtained2.length, 'Item has been removed');
  t.end();
});

test('### Replace Item ###', function(t) {
  var current = db.findAll(collection2);
  db.replace(collection2, current + 1);
  var latest = db.findAll(collection2);
  t.equal(current + 1, latest, 'Item has been replaced');
  t.end();
});