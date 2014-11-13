var debug = require('debug')('phonebook-app-db');

var config = require('./config.json');
var url = 'mongodb://' + config.server + ":" + config.port + "/" + config.defaultDatabase;
var mongo = require('mongodb');
var ObjectID = mongo.ObjectID;

module.exports = function(app, callback) {

  var collection;

  mongo.connect(url, function(err, db) {
    collection = db.collection(config.defaultCollection);
    app.db = {
      saveContact: function(contact, callback) {
        collection.insert(contact, function(err, result) {
          callback(err, result)
        });
      },
      findContactById: function(id, callback) {
        collection.findOne({_id: ObjectID(id)}, function(err, contact) {
          callback(err, contact)
        });
      },
      findAllContacts: function(callback) {
        collection.find().toArray(function(err, contacts) {
          callback(err, contacts);
        });
      },
      deleteContact: function(id, callback) {
        collection.remove({_id: ObjectID(id)}, function(err, result) {
          callback(err, result)
        });
      }
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
