var debug = require('debug')('notifier');
var _ = require('underscore');
var async = require('async');
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var mailer = require('../../shared/mailer');
var tokenizer = require('../../shared/tokenizer');
var collections = ["articles.json", "subscribers.json"];
var db = require('../../shared/db/facade-node-persist')(collections);
var api = require('../../shared/api/facade-firebase');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.get('/', function(req, res) {
  res.send('Hello from Notifier Module!');
});

app.post('/newArticles', function(req, res) {
  var subscriptions, posts;
  debug('Request accepted!');
  db.init();
  subscriptions = db.findAll(collections[1]);
  posts = db.findAll(collections[0]);
  debug('The number of subscriptions to process: ' + subscriptions.length);
  debug('The number of post to process: ' + posts.length);
  debug('Cleaninng posts to not process them again in the future');
  db.rmAll(collections[0]);

  if (subscriptions.length === 0 || posts.length === 0) {
    res.send('New posts or subscriptions are missing');
  } else {
    processSubscriptions(subscriptions, posts);
    res.send('Subscriptions are going to be processed and mails will be sent shortly');
  }
});

app.listen(3001, function() {
  console.log('Notifier listens on localhost at port 3001');
})

function processSubscriptions(subscriptions, posts) {
  _.each(subscriptions, function(subscription) {
    if (!subscription.confirmed) {
      return;
    }
    createNewsletter(subscription.keywords, posts, function(newsletter) {
      sendMailTo(subscription.email, newsletter);
    });
  })
}

function createNewsletter(keywords, posts, callback) {
  var postsToSend = [];
  var expectedRequests = posts.length;
  debug(expectedRequests);
  var finishedRequests = 0;
  debug('Expected Requests: ' + expectedRequests);
  async.eachSeries(posts, function(post, done) {
    debug('POST');
    var words = tokenizer.tokenize(post.title || post.text);
    var matches = _.intersection(keywords, words);
    var desiredPost = (matches.length > 0);
    debug(desiredPost);
    debug(keywords);
    debug(words);
    debug(matches);

    if (desiredPost && post.type === 'story') {
      debug('STORY');
      postsToSend.push(post);
      finishedRequests = finishedRequests + 1;
      debug('Finished Requests: ' + finishedRequests);
      (expectedRequests === finishedRequests) && callback(postsToSend);
      done();
    } else if (desiredPost && post.type === 'comment') {
      debug('COMMENT');
      api.getParentStory(post.parent, function(err, parentStory) {
        err ? console.log('WARNING: Parent story fail') : post.parentStory = parentStory
        postsToSend.push(post);
        finishedRequests = finishedRequests + 1;
        debug('Finished Requests: ' + finishedRequests);
        (expectedRequests === finishedRequests) && callback(postsToSend);
        done();
      })
    } else {
      finishedRequests = finishedRequests + 1;
      debug('Finished Requests: ' + finishedRequests);
      (expectedRequests === finishedRequests) && callback(postsToSend);
      done();
    }
  });
}

function sendMailTo(email, data) {
  if (data.length > 0) {
    mailer.sendEmail('HN Newsletter Service', 'Newsletter', email, JSON.stringify(data));
  } else {
    debug('Nothing to be sent.');
  }
}
