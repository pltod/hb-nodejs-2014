var debug = require('debug')('scrapper-statistics');
var api = require('../../shared/api/facade-firebase');
var async = require('async');
var tokenizer = require('../../shared/util/tokenizer');
var config = require('./config.json');
var url = 'mongodb://' + config.server + ":" + config.port + "/" + config.defaultDatabase;
var mongo = require('mongodb');

run();

function run() {
  // allDone callback just invokes the process again
  function allDone() {
    console.log('Scrapping done. It will run automatically after two minutes.')
    setTimeout(function() {
      s1_identifyPosts(allDone);
    }, 60 * 3000);
  }
  s1_identifyPosts(allDone);
}

// Async function - gets the latest id and invokes another async function for geting posts
function s1_identifyPosts(allDone) {
  api.getLatestPostId(function(err, id) {
    var ids = getPostIds(parseInt(id));
    if (ids.length === 0) {
      console.log('No new data at this moment');
      return;
    }
    s2_getPosts(
      ids,
      s3_saveStatistic,
      allDone
    );
  });
}

// forEach is sync but it invokes async operation and waits for all of them to finish before continue the whole process
function s2_getPosts(ids, done, allDone) {
  var expectedRequests = ids.length;
  var finishedRequests = 0;
  var words = [];
  debug('Expected Requests: ' + expectedRequests);

  ids.forEach(function(id) {
    api.getPost(id, function(err, result) {
      var post = JSON.parse(result)
      finishedRequests++;
      debug('Finished Requests: ' + finishedRequests);
      if (post && (post.type === 'story' || post.type === 'comment')) {
        words = words.concat(tokenizer.tokenize(post.title || post.text));
      }
      (expectedRequests === finishedRequests) && done(words, allDone);
    })
  })
}

// Async operation for inserting records into the DB
function s3_saveStatistic(words, allDone) {
  var obj = { };
  var finishedRequests = 0;
  var differentWords;
  var expectedRequests;
  
  words.forEach(function (word) {
    obj[word] = (obj[word] || 0) + 1;
  })
  
  differentWords = Object.keys(obj);
  expectedRequests = differentWords.length;
  
  mongo.connect(url, function (err, db) {
    var collection = db.collection(config.defaultCollection);
    debug('Expected Requests: ' + expectedRequests);
    async.eachSeries(differentWords, function (key, done) {
      finishedRequests++;
      debug('Finished Requests: ' + finishedRequests);
      collection.update(
        { keyword: key },
        { $inc: { count: obj[key] } },
        { upsert: true, writeConcern: {w: 1} },
        function (err, result) {
          if (expectedRequests === finishedRequests) {
            db.close();
            allDone();           
          }
          done();
        }
      )
    })
  })
}

// Gets ids to process and updates max item used.
// Intentionally left synchronous.
function getPostIds(id) {
  var _ = require('underscore');
  var read = require('../../shared/io/reader/reader-file');
  var write = require('../../shared/io/writer/writer-file');
  var maxItemFile = 'maxitem-store/maxitemstats.txt';
  var lastUsedId = parseInt(read.sync(maxItemFile));
  var latestId = parseInt(id);
  var maxElementsToProcess = 50;
  
  debug('Current Last Item: ' + latestId);
  debug('Last Item Used: ' + lastUsedId);

  if ((lastUsedId + maxElementsToProcess) > latestId) {
    write(maxItemFile, latestId);
    return _.range(lastUsedId + 1, latestId);  
  } else {
    write(maxItemFile, lastUsedId + maxElementsToProcess);
    return _.range(lastUsedId + 1, lastUsedId + maxElementsToProcess + 1); 
  }
}