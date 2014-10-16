var express = require('express');
var bodyParser = require('body-parser');
var app = express();

var db = require('./db');
var collection = "subscribers.json";
db.init();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.get('/', function (req, res) {
  res.send('Hello from Subscriber Module!');
});

app.post('/subscribe', function (req, res) {
  var id = db.insertWithID(collection, req.body);
  var result = {
    "email": req.body.email,
    "subscriberId": id
  }
  res.send(result);
});

app.post('/unsubscribe', function (req, res) {
  db.rm(collection, req.body.subscriberId);
  res.send(req.body.subscriberId + ' has been removed!');
});

app.get('/listSubscribers', function (req, res) {
  res.send(db.findAll(collection));
});

app.listen(3000, function () {
  console.log('Subscriber listens on localhost at port 3000');
})