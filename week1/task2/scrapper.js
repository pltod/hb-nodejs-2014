var debug = require('debug')('scrapper');
var _ = require('underscore');
var read = require('../../shared/readers/reader-local');
var write = require('../../shared/writers/writer-file');
var http = require('http');
var https = require('https');
var collection = 'articles.json';
var db = require('../../shared/db/facade-node-persist')([collection]);
var api = require('../../shared/api/facade-firebase');

var maxItemFile = 'persist/maxitem.txt';
var lastItemUsed = parseInt(read.sync(maxItemFile));
var ids = [];

runProcess();
setInterval(function() {
  runProcess();
}, 60 * 2000);

function runProcess() {
  step1_getLatestMaxItem();
}

function step1_getLatestMaxItem() {
  api.getLatestPostId(function (err, id) {
    var currentItem = parseInt(id);
    debug('Current Last Item: ' + currentItem);
    debug('Last Item Used: ' + lastItemUsed);    
    //Limit the items to 100
    if ((currentItem - lastItemUsed) > 100 ) {
      ids = _.range(currentItem - 99, currentItem + 1);
    } else {
      ids = _.range(lastItemUsed + 1, currentItem + 1);
    }
    write(maxItemFile, currentItem);
    step2_getAllArticles();
  });
}


function step2_getAllArticles() {
  var expectedRequests = ids.length;
  debug('Expected Requests: ' + expectedRequests);
  var finishedRequests = 0;
  if (expectedRequests === 0) {
    console.log('No new data at this moment');
  } else {
    _.each(ids, function (id) {
      api.getPost(id, function (err, post) {
        var dataJSON;
        finishedRequests = finishedRequests + 1;
        debug('Finished Requests: ' + finishedRequests);
        try {
          debug(post);
          dataJSON = JSON.parse(post)
        } catch(e) {
          //Some of the responses have incorrect JSON - skip these
          return;
        }
        step3_ProcessFoundData(dataJSON, (expectedRequests === finishedRequests));
      })
    })
  }
}

function step3_ProcessFoundData(data, isLast) {
  if (data.type === 'story' || data.type === 'comment') {
    db.insertOne(collection, data, false);
  }
  if (isLast) {
    //wakeUpNotifier();
    console.log('Wake up notifier');
  }
}

function wakeUpNotifier() {
  var options = {
    hostname: 'localhost',
    port: 3001,
    method: 'POST',
    path: '/newArticles'    
  };
  
  // Small delay to ensure that all is in articles.json
  setTimeout(function () {
    debug('Waking up notifier...');
    var req = http.request(options, function(res) {
      res.on('data', function (chunk) {
        console.log(chunk.toString());
      });
    });
  
    req.on('error', function(e) {
      console.log('Problem with request: ' + e.message);
    });
  
    req.end();    
  }, 10000)
}
