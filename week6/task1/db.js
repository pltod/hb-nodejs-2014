var debug = require('debug')('snippet-app-db');

var config = require('./config.json');
var url = 'mongodb://' + config.server + ":" + config.port + "/" + config.defaultDatabase;
var mongo = require('mongodb');
var ObjectID = mongo.ObjectID;

module.exports = function(app, callback) {

  var collection;

  mongo.connect(url, function(err, db) {
    collection = db.collection(config.defaultCollection);
    app.db = {
      // Empty
    };
    app.closeDb = db.close.bind(db);
    app.cleanColl = function (callback) {
      collection.remove(function (err, result) {
        callback(err, result)
      })
    };

    callback(err);
  });

}
