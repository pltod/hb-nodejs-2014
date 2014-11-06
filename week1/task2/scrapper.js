var debug = require('debug')('scrapper');
var api = require('../../shared/api/facade-firebase');

run();

function run() {
  function allDone() {
    console.log('Scrapping done. Will run after two minutes again.')
    setTimeout(function() {
      s1_identifyPosts(allDone);
    }, 60 * 3000);
  }
  s1_identifyPosts(allDone);
}

function s1_identifyPosts(allDone) {
  api.getLatestPostId(function(err, id) {
    var ids = getPostIds(parseInt(id));
    if (ids.length === 0) {
      console.log('No new data at this moment');
      return;
    }
    s2_getPosts(
      ids,
      s3_savePosts,
      allDone
    );
  });
}

function s2_getPosts(ids, done, allDone) {
  var expectedRequests = ids.length;
  var finishedRequests = 0;
  var posts = [];
  debug('Expected Requests: ' + expectedRequests);

  ids.forEach(function(id) {
    api.getPost(id, function(err, post) {
      var dataJSON = JSON.parse(post)
      finishedRequests++;
      debug('Finished Requests: ' + finishedRequests);
      dataJSON && (dataJSON.type === 'story' || dataJSON.type === 'comment') && posts.push(dataJSON);
      (expectedRequests === finishedRequests) && s3_savePosts(posts, allDone);
    })
  })
}

function s3_savePosts(posts, allDone) {
  var collection = 'articles.json';
  var db = require('../../shared/db/facade-node-persist')([collection]);
  db.insertMany(collection, posts, false);
  console.log(db.findAll(collection));
  process.nextTick(s4_wakeUpNotifier);
  allDone();
}

function s4_wakeUpNotifier() {
  var invoke = require('../../shared/readers/reader-remote');
  invoke.httpPost(
    {
      hostname: 'localhost',
      port: 3001,
      method: 'POST',
      path: '/newArticles'
    },
    function (err, data) {
      err ? console.log(err) : console.log(data)
    }
  );
}

function getLastUsedId(latestId) {
  var read = require('../../shared/readers/reader-local');
  var write = require('../../shared/writers/writer-file');
  var maxItemFile = 'persist/maxitem.txt';
  var lastUsedId = parseInt(read.sync(maxItemFile));

  write(maxItemFile, latestId);
  return lastUsedId;
}

function getPostIds(id) {
  var _ = require('underscore');
  var latestId = parseInt(id);
  var lastUsedId = getLastUsedId(latestId);

  debug('Current Last Item: ' + latestId);
  debug('Last Item Used: ' + lastUsedId);

  //Limit the items to last 100 if the process has not been started for too long
  if ((latestId - lastUsedId) > 100) {
    return _.range(latestId - 99, latestId + 1);
  } else {
    return _.range(lastUsedId + 1, latestId + 1);
  }
}