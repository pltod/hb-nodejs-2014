var uuid = require('node-uuid');
var storage = require('node-persist');
var express = require('express');
var bodyParser = require('body-parser');
var app = express();

storage.init();
console.log(__dirname);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.get('/', function (req, res) {
  res.send('Hello from Subscriber!');
});

app.get('/listSubscribers', function (req, res) {
  storage.values(function(vals) {
    res.send(vals);
  });
});

app.post('/subscribe', function (req, res) {
  var subscrId = uuid.v4();
  storage.setItem(subscrId, req.body);
  res.send(subscrId);
});

app.post('/unsubscribe', function (req, res) {
  storage.removeItem(req.body.key);
  res.send('Removed!');
});

var server = app.listen(3000, function () {

  console.log('Example app listening at localhost port: ' + server.address().port);

})