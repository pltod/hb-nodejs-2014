var debug = require('debug')('graph-server');
var config = require('../../../config');
var express = require("express");
var bodyParser = require('body-parser');
var app = express();
var adminService = require('./graph-service-admin')(config.api);
var socialService = require('./graph-service-social');

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
  res.send(adminService.getGraphData(req.params.graphId));
});

app.get("/mutually_follow/:graphId/:username", function(req, res) {
  debug(req.params.graphId);
  debug(req.params.username);
  
  var user = req.params.username;
  var graph = adminService.getGraph(req.params.graphId);
  debug(graph);

  var service = socialService(graph);
  var following = service.isFollowing(user);
  debug(following);

  var hasFollowBackInfo = service.hasFollowingInfoFor(user);
  debug(hasFollowBackInfo);
    
  if (following) {
    (service.isFollowingBack(user)) ? res.send({"relation": "mutual"}) : res.send({"relation": "first"})
  } else if (!following && hasFollowBackInfo) {
    (service.isFollowingBack(user)) ? res.send({"relation": "second"}) : res.send({"relation": "none"})      
  } else if (!following && !hasFollowBackInfo) {
    res.send({"relation": "possibly second but no complete info in generated graph"});
  }
});

app.listen(8000);