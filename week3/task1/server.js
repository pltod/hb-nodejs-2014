var debug = require('debug')('social-server');
var express = require("express");
var bodyParser = require('body-parser');
var app = express();
var service = require('./social-service');


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
  debug(req.body.username);
  debug(req.body.depth);
  
  debug('Creating graph...');
  var s1 = service(req.body.username, req.body.depth);
  debug('Graph created with uid: ' + s1.uid());
  res.send(s1.uid());
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