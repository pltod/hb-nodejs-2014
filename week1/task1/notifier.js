var storage = require('node-persist');
var _ = require('underscore');
var express = require('express');
var bodyParser = require('body-parser');
var app = express();

storage.init();
console.log(__dirname);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.get('/', function (req, res) {
  res.send('Hello from Notifier!');
});

app.post('/newArticles', function (req, res) {
  
  processSubscriptions(req.body);
  res.send('Mails will be sent shortly');

});

var server = app.listen(3001, function () {

  console.log('Example app listening at localhost port: ' + server.address().port);

})

function processSubscriptions(articles) {
  //console.log(articles);
  storage.values(function(subscriptions) {
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
        console.log("Sending mail to: " + subscription.email + " with articles: " + articlesToSend);
        sendMail(articlesToSend, subscription.email);
      }
    })
  });
}

function sendMail(articles, mail) {
  //TODO Integrate nodemailer
}