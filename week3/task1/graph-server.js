var debug = require('debug')('graph-server');
var config = require('../../../config');
var express = require("express");
var bodyParser = require('body-parser');
var app = express();
var adminService = require('./graph-service-admin')(config.api);
var socialService = require('./graph-service-admin');

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
    adminService.regenerateGraph(req.body.username, req.body.depth, function (err, graphId) {
      debug('Graph created with uid: ' + graphId);
      res.send(graphId);
    });
  } else {
    debug('Creating graph in normal mode...');
    adminService.generateGraph(req.body.username, req.body.depth, function (err, graphId) {
      debug('Graph created with uid: ' + graphId);
      res.send(graphId);
    });
  }
});

app.get("/graphs", function(req, res) {
  res.send(adminService.getAllGraphs());
});

app.get("/graph/:graphId", function(req, res) {
  res.send(adminService.getGraph(req.params.graphId));
});

app.get("/mutually_follow/:graphId/:username", function(req, res) {
  debug(req.params.graphId);
  debug(req.params.username);
  
  var user = req.params.username;
  var answer = {};
  var service = socialService(adminService.getGraph(req.params.graphId));
  var forward = service.isFollowing(user);
  var hasBackwardInfo = service.hasFollowingInfoFor(user);
  
  if (forward && hasBackwardInfo) {
    if (service.isFollowingBack(user)) {
      answer.relation = 'mutual'
      res.send(answer);
    } else {
      answer.relation = 'first'
      res.send(answer);
    }
  } else if (!forward && hasBackwardInfo) {
    if (service.isFollowingBack(user)) {
      answer.relation = 'second'
      res.send(answer);
    } else {
      answer.relation = 'none'
      res.send(answer);
    }
  } else if (forward && !hasBackwardInfo) {
    answer.relation = 'possibly mutual but no complete info in generated graph';
    res.send(answer);
  }

  res.send(answer);
});

app.listen(8000);