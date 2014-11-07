var debug = require('debug')('snippet-app-server');
var _ = require('underscore');

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


require('./db')(app, function (err) {
  if (err) {
    console.log('Unable to start application')
  } else {
    require('./api')(app);
    app.listen(8000)
  }
});