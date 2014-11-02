var debug = require('debug')('social-server');
var config = require('./config');
var express = require("express");
var bodyParser = require('body-parser');
var app = express();
var service = require('./social-service')();


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

app.post("/createGraphFor", function (req, res) {
  var graph;
  debug(req.body.username);
  debug(req.body.depth);
  if (config.regenerate) {
    debug('Creating graph in regeneration mode...');
    graph = service.regenerateGraph(req.body.username, req.body.depth);
  } else {
    debug('Creating graph in normal mode...');
    graph = service.generateGraph(req.body.username, req.body.depth);
  }
  debug('Graph created with uid: ' + graph.id);
  res.send(graph.id);
});

app.get("/graphs", function(req, res) {
  res.send(service.generatedGraphs());
});

app.get("/graph/:graphId", function(req, res) {
  debug(req.params.graphId);
  res.send(req.params.graphId);
});

app.get("/mutually_follow/:graphId/:username", function(req, res) {
  debug(req.params.graphId);
  debug(req.params.username); 
  res.send(req.params.graphId + ' - ' + req.params.username);
});

app.listen(8000);