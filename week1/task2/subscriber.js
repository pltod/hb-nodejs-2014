var debug = require('debug')('subscriber-service');
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var collection = "subscribers.json";
var db = require('./db')([collection]);
var mailer = require('../../shared/mailer');
var port = 8000;
var mailTemplate = 'You have been subscribed! Please confirm <a href="http://localhost:' + port + '/confirm?email={email}&id={id}">here</a>';
  
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.get('/', function (req, res) {
  res.send('Hello from Subscriber Module!');
});


app.get('/confirm', function (req, res) {
  debug('Doing confirmation...');
  var subscription = db.rmOne(collection, req.query.id);
  if(subscription.email === req.query.email) {
    subscription.confirmed = true;
    db.insertOne(collection, subscription, false);
    mailer.sendEmail(req.query.email, 'Thanks for your subscription!');
  } else {
    mailer.sendEmail(req.query.email, 'You subscription request has been expired. Please make it again!');
  }
  
  res.send('Confirmation successful');
});

app.post('/subscribe', function (req, res) {
  var id = db.insertOne(collection, req.body, true);
  if (id) {
    mailer.sendEmail(
      req.body.email, 
      mailTemplate
        .replace('{email}', req.body.email)
        .replace("{id}", id)
    );
    res.send({"email": req.body.email, "subscriberId": id});
  } 
});

app.post('/unsubscribe', function (req, res) {
  db.rmOne(collection, req.body.subscriberId);
  res.send(req.body.subscriberId + ' has been removed!');
});

app.get('/listSubscribers', function (req, res) {
  res.send(db.findAll(collection));
});

app.listen(port, function () {
  console.log('Subscriber listens on localhost at port ' + port);
})