var _ = require('underscore');
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var db = require('./db');
var articlesCollection = "articles.json";
var subscribersCollection = "subscribers.json";

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.get('/', function (req, res) {
  res.send('Hello from Notifier Module!');
});

app.post('/newArticles', function (req, res) {
  processSubscriptions();
  res.send('Subscriptions are going to be processed and mails will be sent shortly');
});

app.listen(3001, function () {
  console.log('Notifier listens on localhost at port 3001');
})

function processSubscriptions() {
  var articles = findAndCleanArticles();
  var subscriptions = db.findAll(subscribersCollection);
  
  _.each(subscriptions, function (subscription) {
    var articlesToSend = [];
    var keywords = subscription.keywords;
    _.each(articles, function (article) {
      var words = article.title.split(' ');
      var matches = _.intersection(keywords, words)
      if (!_.isEmpty(matches)) {
        articlesToSend.push(article);
      }
    });
    if (!_.isEmpty(articlesToSend)) {
      console.log("Sending mail to: " + subscription.email + " / " + subscription.uid + " with articles: " + articlesToSend);
      sendMail(articlesToSend, subscription.email);
    } else {
      console.log("No emails will be sent to: " + subscription.email + " / " + subscription.uid)
    }
  })
}

function findAndCleanArticles() {
  var articles = db.findAll(articlesCollection);
  db.rmAll(articlesCollection);
  return articles;
}

function sendMail(articles, mail) {
  //TODO Integrate nodemailer
}