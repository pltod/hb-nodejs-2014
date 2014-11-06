var debug = require('debug')('snippet-app-server');
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

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));


app.get("/:user/snippet", function(req, res) {
  debug('Getting all user snippets...');
  debug(req.params.user);
  res.send('OK');
});

app.get("/:user/snippet/:id", function(req, res) {
  debug('Getting user snippet with id...');
  debug(req.params.user);
  debug(req.params.id);
  res.send('OK');  
});

app.get("/snippet", function(req, res) {
  debug('Getting all snippets...');
  res.send('OK');  
});

app.post("/snippet", function(req, res) {
  debug('Saving snippet...');
  debug(req.body.lang);
  debug(req.body.file);
  debug(req.body.code);
  debug(req.body.user);

  var c = app.db.collection(config.defaultCollection);
  c.insert(req.body, function (err, result) {
    err ? res.json('KO') : res.json('OK')
  });
});

app.put("/snippet/:id", function(req, res) {
  debug('Updating snippet...');
  debug(req.params.id);  
  res.send('OK');
});

app.delete("/snippet/:id", function(req, res) {
  debug('Deleting snippet...');
  debug(req.params.id);
  res.send('OK');
});

mongo.connect(url, function (err, db) {
  app.db = db;
  app.listen(8000);
})