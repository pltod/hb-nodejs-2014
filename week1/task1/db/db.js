var debug = require('debug')('db-test');
var storage = require('node-persist');
var dbUtils = require("./db-utils");
var _ = require('underscore');



module.exports = {
  init: init,
  insertMany: insertMany,
  insertManyWithID: insertManyWithID,
  insert: insert,
  insertWithID: insertWithID,    
  findAll: findAll,
  rmAll: rmAll,
  rm: rm,
  replace: replace,
  persist: persist 
}

function init() {
  storage.initSync();
}

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
  if (current === undefined) {
    storage.setItem(collection, []);
    current = storage.getItem(collection);
  }
  current.push(item);
  storage.setItem(collection, current); 
}

function insertWithID(collection, item) {
  item.uid = dbUtils.uid();
  var current = storage.getItem(collection);
  if (current === undefined) {
    storage.setItem(collection, []);
    current = storage.getItem(collection);
  }
  current.push(item);
  storage.setItem(collection, current);
  return item.uid;
}

function findAll(collection, isNumber) {
  var items = storage.getItem(collection);
  // Not good here :)
  if (items === undefined && !isNumber) {
    storage.setItem(collection, []);
  } else if (items === undefined && isNumber) {
    storage.setItem(collection, 0);
  }
  return storage.getItem(collection);
}

function replace(collection, item) {
  storage.setItem(collection, item);
}

function rmAll(collection) {
  storage.setItem(collection, []);
}

function rm(collection, uid) {
  debug(uid);
  var items = storage.getItem(collection);
  if (items !== undefined) {
    debug(items);
    var remaining = _.filter(items, function (item) {
      return item.uid != uid;
    })
    debug(remaining);
    storage.setItem(collection, remaining);
  }
}

function persist() {
  storage.persistSync();
}

