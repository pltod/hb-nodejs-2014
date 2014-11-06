var debug = require('debug')('subscriber-service');
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var collection = "subscribers.json";
var db = require('../../shared/db/facade-node-persist')([collection]);
var mailer = require('../../shared/util/mailer');
var port = 8000;
var mailTemplate = 'You have been subscribed! Please confirm <a href="http://localhost:' + port + '/confirm?email={email}&id={id}">here</a>';
var mailOptions = {
 sender: 'HN Service',
 subject: 'HN Service Subscription Confirmation'
};

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
    mailer.sendEmail(
      mailOptions.sender, 
      mailOptions.subject, 
      req.query.email, 
      'Thanks for your subscription!');
  } else {
    mailer.sendEmail(
      mailOptions.sender, 
      mailOptions.subject, 
      req.query.email, 
      'You subscription request has been expired. Please make it again!');
  }
  
  res.send('Confirmation successful');
});

app.post('/subscribe', function (req, res) {
  var id = db.insertOne(collection, req.body, true);
  if (id) {
    mailer.sendEmail(
      mailOptions.sender, 
      mailOptions.subject, 
      req.body.email, 
      mailTemplate
        .replace('{email}', req.body.email)
        .replace("{id}", id)
    );
    res.send({"email": req.body.email, "subscriberId": id});
  } 
});

app.post('/unsubscribe', function (req, res) {
  debug('Trying to unsibscribe ' + req.body.subscriberId);  
  var removed = db.rmOne(collection, req.body.subscriberId);
  if (removed) {
    res.send('User ' + removed.uid + ' has been removed');
  } else {
    res.send('User does not exists!');
  }
});

app.get('/listSubscribers', function (req, res) {
  res.send(db.findAll(collection));
});

app.listen(port, function () {
  console.log('Subscriber listens on localhost at port ' + port);
})