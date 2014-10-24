var debug = require('debug')('db-test');
var storage = require('node-persist');
var dbUtils = require("../../../shared/utils/db-utils");
var _ = require('underscore');



module.exports = function (collections) {
  storage.initSync();
  
  // init empty
  _.each(collections, function (collection) {
    storage.setItem(collection, []);
  })
  
  return {
    insertMany: insertMany,
    insertOne: insertOne,  
    findAll: findAll,
    rmAll: rmAll,
    rmOne: rmOne,
    //TODO update to handle the case with confirmed = true
  }
}

function insertMany(collection, data) {
  _.each(data, function (item) {
    tagItem(item);
  })
  debug(data);
  storage.setItem(collection, data);
}

function insertOne(collection, item) {
  var data = storage.getItem(collection);
  tagItem(item);
  data.push(item);
  storage.setItem(collection, data);
  return item.uid;
}

function findAll(collection, isNumber) {
  return storage.getItem(collection);
}

function rmAll(collection) {
  storage.setItem(collection, []);
}

function rmOne(collection, uid) {
  debug(uid);
  var items = storage.getItem(collection);
  debug(items);
  var remaining = _.filter(items, function (item) {
    return item.uid != uid;
  })
  debug(remaining);
  storage.setItem(collection, remaining);
}

function tagItem(item) {
  item.uid = dbUtils.uid();
  item.confirmed = false;
}