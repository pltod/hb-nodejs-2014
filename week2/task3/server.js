var debug = require('debug')('geo-server');
var _ = require('underscore');
var config = require('./config.json');
var url = 'mongodb://' + config.server + ":" + config.port + "/" + config.defaultDatabase;
var mongo = require('mongodb');

var express = require("express");
var bodyParser = require('body-parser');
var app = express();


app.all("*", function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", ["X-Requested-With", "Content-Type", "Access-Control-Allow-Methods"]);
  res.header("Access-Control-Allow-Methods", ["GET"]);
  next();
});


app.use( bodyParser.json() );
app.use(bodyParser.urlencoded({
  extended: true
}));

app.get("/locations", function(req, res) {
  debug('Getting locations with...');  
  var c = app.db.collection(config.defaultCollection);
  var lng = parseFloat(req.query.position.lng);
  debug('Longitude: ' + lng);
  var lat = parseFloat(req.query.position.lat);
  debug('Latitude: ' + lat);
  var data = c.find(
     {
       loc: {
          $nearSphere: {
             $geometry: {
                type : "Point",
                coordinates : [lng, lat]
             },
             $maxDistance: req.query.range * 1000
          }
       }
     }
  ).toArray(function (err, docs) {
    var validLocs = [];
    if (err) {
      res.json('KO')
    } else {
      debug('Found locations: ');
      debug(docs);
      docs.forEach(function (doc) {
        if (_.intersection(req.query.tags, doc.tags).length > 0) {
          validLocs.push(doc);
        }
      })
      res.json(validLocs);
    }
  });
});

app.post("/locations", function(req, res) {
  debug('Saving location with...');  
  debug('Longitude: ' + req.body.position.lng);
  debug('Latitude: ' + req.body.position.lat);  
  var item = {
    "name": req.body.name,
    "loc" : { "type": "Point", "coordinates": [ req.body.position.lng, req.body.position.lat ] },          
    "tags": req.body.tags,
  }
  
  var c = app.db.collection(config.defaultCollection);
  c.insert(item, function (err, result) {
    err ? res.json('KO') : res.json(result)
  });

});

mongo.connect(url, function (err, db) {
  app.db = db;
  app.listen(8000);
})

