var debug = require('debug')('phonebook-app-db');

var config = require('./config.json');
var url = 'mongodb://' + config.server + ":" + config.port + "/" + config.defaultDatabase;
var mongo = require('mongodb');
var ObjectID = mongo.ObjectID;

module.exports = function(app, callback) {

  var contactsCollection;
  var groupsCollection;

  mongo.connect(url, function(err, db) {
    contactsCollection = db.collection(config.contactsCollection);
    groupsCollection = db.collection(config.groupsCollection);
    app.db = {
      saveContact: function(contact, callback) {
        contactsCollection.insert(contact, function(err, result) {
          callback(err, result)
        });
      },
      findContactById: function(id, callback) {
        contactsCollection.findOne({_id: ObjectID(id)}, function(err, contact) {
          callback(err, contact)
        });
      },
      findAllContacts: function(callback) {
        contactsCollection.find().toArray(function(err, contacts) {
          callback(err, contacts);
        });
      },
      deleteContact: function(id, callback) {
        contactsCollection.remove({_id: ObjectID(id)}, function(err, result) {
          callback(err, result)
        });
      },
      saveOrUpdateExactGroup: function (groupName, newContact, oldContact, callback) {
        groupsCollection.update(
          { type: 'exact', groupName: groupName },
          { $addToSet: { contacts: { $each: [newContact, oldContact] } } },
          { upsert: true, writeConcern: {w: 1} },
          callback
        )
      },
      saveOrUpdateFuzzyGroup: function(groupName1, groupName2, newContact, oldContact, callback) {
        groupsCollection.update(
          { type: 'fuzzy', groupName: { $in: [groupName1, groupName2] } },
          { 
            $addToSet: { 
              groupName: { $each: [groupName1, groupName2] },
              contacts: { $each: [newContact, oldContact] } 
            },
          },
          { upsert: true, writeConcern: {w: 1} },
          callback
        )
      },
      findAllGroups: function(callback) {
        groupsCollection.find().toArray(function(err, contacts) {
          callback(err, contacts);
        });
      }
    };
    app.closeDb = db.close.bind(db);
    app.cleanContacts = function (callback) {
      contactsCollection.remove(function (err, result) {
        callback(err, result)
      })
    };
    app.cleanGroups = function (callback) {
      groupsCollection.remove(function (err, result) {
        callback(err, result)
      })
    };

    callback(err);
  });

}
