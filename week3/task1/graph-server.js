var debug = require('debug')('graph-server');
var config = require('../../../config');
var express = require("express");
var bodyParser = require('body-parser');
var app = express();
var service = require('./graph-service')(config.api);

app.all("*", function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", ["X-Requested-With", "Content-Type", "Access-Control-Allow-Methods"]);
  res.header("Access-Control-Allow-Methods", ["GET"]);
  next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.post("/createGraphFor", function (req, res) {
  debug(req.body.username);
  debug(req.body.depth);
  if (config.regenerate) {
    debug('Creating graph in regeneration mode...');
    service.regenerateGraph(req.body.username, req.body.depth, function (err, graphId) {
      debug('Graph created with uid: ' + graphId);
      res.send(graphId);
    });
  } else {
    debug('Creating graph in normal mode...');
    service.generateGraph(req.body.username, req.body.depth, function (err, graphId) {
      debug('Graph created with uid: ' + graphId);
      res.send(graphId);
    });
  }
});

app.get("/graphs", function(req, res) {
  res.send(service.getAllGraphs());
});

app.get("/graph/:graphId", function(req, res) {
  res.send(service.getGraph(req.params.graphId));
});

app.get("/mutually_follow/:graphId/:username", function(req, res) {
  debug(req.params.graphId);
  debug(req.params.username);
  var computedRelation = 'mutual';
  var answer = {
    "relation": computedRelation
  } 
  res.send(answer);
});

app.listen(8000);