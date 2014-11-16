var debug = require('debug')('sitemapper-app-db');

var config = require('./config.json');
var url = 'mongodb://' + config.server + ":" + config.port + "/" + config.defaultDatabase;
var mongo = require('mongodb');
var ObjectID = mongo.ObjectID;

module.exports = function(app, callback) {

  var sitemapsCollection;

  mongo.connect(url, function(err, db) {
    sitemapsCollection = db.collection(config.defaultCollection);
    app.db = {
      saveSitemap: function(url, callback) {
        sitemapsCollection.findAndModify( 
          { url: url }, 
          [['b', 1]],
          { status: sitemap.status, url: url, links: [] },
          {new:true, upsert:true, w:1},          
          callback
        )
      },
      findAllSitemaps: function(callback) {
        sitemapsCollection.find(
          {},
          {url:1, status: 1}
        ).toArray(function(err, result) {
          callback(err, result);
        });
      },
      findSitemap: function(id, callback) {
        sitemapsCollection.findOne(
        {_id: ObjectID(id)}, 
        {_id: 0, url: 1, status: 1, links: 1},          
        function(err, contact) {
          callback(err, contact)
        });
      },
      updateSitemap: function (data, callback) {
        //TODO
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
