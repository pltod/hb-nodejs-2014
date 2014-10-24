var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var collection = "subscribers.json";
var db = require('./db')([collection]);


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.get('/', function (req, res) {
  res.send('Hello from Subscriber Module!');
});

app.post('/subscribe', function (req, res) {
  var id = db.insertOne(collection, req.body, true);
  var result = {
    "email": req.body.email,
    "subscriberId": id
  }
  res.send(result);
});

app.post('/unsubscribe', function (req, res) {
  db.rmOne(collection, req.body.subscriberId);
  res.send(req.body.subscriberId + ' has been removed!');
});

app.get('/listSubscribers', function (req, res) {
  res.send(db.findAll(collection));
});

app.listen(3000, function () {
  console.log('Subscriber listens on localhost at port 3000');
})