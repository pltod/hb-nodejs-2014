var debug = require('debug')('db-test');
var storage = require('node-persist');
var dbUtils = require("./db-utils");
var _ = require('underscore');

module.exports = {
  insertMany: insertMany,
  insertManyWithID: insertManyWithID,
  insert: insert,
  insertWithID: insertWithID,    
  findAll: findAll,
  rmAll: rmAll,
  rm: rm
}

storage.initSync();

function insertMany(collection, initialValue) {
  storage.setItem(collection, initialValue);
}

function insertManyWithID(collection, initialValue) {
  _.each(initialValue, function (item) {
    item.uid = dbUtils.uid()
  })
  debug(initialValue);
  storage.setItem(collection, initialValue);
}

function insert(collection, item) {
  var current = storage.getItem(collection);
  current.push(item);
  storage.setItem(collection, current); 
}

function insertWithID(collection, item) {
  item.uid = dbUtils.uid();
  var current = storage.getItem(collection);
  current.push(item);
  storage.setItem(collection, current);
  return item.uid;
}

function findAll(collection) {
  return storage.getItem(collection);
}

function rmAll(collection) {
  storage.setItem(collection, []);
}

function rm(collection, uid) {
  debug(uid);
  var items = storage.getItem(collection);
  debug(items);
  var remaining = _.filter(items, function (item) {
    return item.uid != uid;
  })
  debug(remaining);
  storage.setItem(collection, remaining);
}

