var debug = require('debug')('notifier');
var _ = require('underscore');

var express = require('express');
var bodyParser = require('body-parser');
var app = express();

var mailer = require('../../shared/mailer');
var collections = ["articles.json", "subscribers.json"];
var db = require('../../shared/db/facade-node-persist')([collection]);
var api = require('../../shared/api/facade-firebase');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.get('/', function (req, res) {
  res.send('Hello from Notifier Module!');
});

app.post('/newArticles', function (req, res) {
  debug('Request accepted!');
  // db.init();
  var subscriptions = db.findAll(collections[1]);
  var articles = db.findAll(collections[0]);
  //clean for the next time...these will be processed now
  db.rmAll(collections[0]);
  debug(articles.length);  
  processSubscriptions(subscriptions, articles);
  res.send('Subscriptions are going to be processed and mails will be sent shortly');
});

app.listen(3001, function () {
  console.log('Notifier listens on localhost at port 3001');
})

function processSubscriptions(subscriptions, articles) {
  _.each(subscriptions, function (subscription) {
    
    if (!subscription.confirmed) {
      // Not confirmed subscriptions are skipped
      return;
    }
    
    var articlesToSend = [];
    var keywords = subscription.keywords;
    _.each(articles, function (article) {
      var words;
      if (article.title !== undefined) {
        // Sometimes titles are empty..deleted items for example
        words = article.title.split(' '); 
      }
      
      var matches = _.intersection(keywords, words)
      if (!_.isEmpty(matches)) {
        articlesToSend.push(article);
        if (article.type === 'comment') {
          // TODO Obtain the parent story and add it in articlesToSend
          // api.getParentStory(article.id)
        }
      }
    });
    if (!_.isEmpty(articlesToSend)) {
      debug(articlesToSend);
      console.log(mailer.sendEmail(subscription.email, JSON.stringify(articlesToSend)))
    } else {
      console.log("No emails will be sent to: " + subscription.email + " / " + subscription.uid)
    }
  })
}