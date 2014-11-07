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
      findSnippetById: function(id, callback) {
        collection.findOne({_id: ObjectID(id)}, function(err, snippet) {
          callback(err, snippet)
        });
      },
      findAllSnippets: function(callback) {
        collection.find().toArray(function(err, snippets) {
          callback(err, snippets);
        });
      },
      findSnippetsByUser: function(user, callback) {
        debug(user);
        collection.find({user: user}).toArray(function(err, snippets) {
          callback(err, snippets)
        });
      },
      saveSnippet: function(snippet, callback) {
        collection.insert(snippet, function(err, result) {
          callback(err, result)
        });
      },
      updateSnippet: function(id, code, callback) {
        collection.update({_id: ObjectID(id)}, {$set: {code: code}}, function(err, result) {
          callback(err, result)
        });
      },
      deleteSnippet: function(id, callback) {
        collection.remove({_id: ObjectID(id)}, function(err, result) {
          callback(err, result)
        });
      }
    };

    callback(err);
  });

}
