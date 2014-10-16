var debug = require('debug')('scrapper');
var _ = require('underscore');

var http = require('http');
var https = require('https');

var db = require('./db');
db.init();
var articlesCollection = 'articles.json';
var maxItemCollection = 'maxitem.json';
var lastItemUsed = db.findAll(maxItemCollection, true);
var ids = [];

runProcess();
setInterval(function() {
  runProcess();
}, 60 * 2000);

function runProcess() {
  step1_getLatestMaxItem();
}

function step1_getLatestMaxItem() {
  https.get("https://hacker-news.firebaseio.com/v0/maxitem.json", function (res) {
    res.on('data', function(itemId) {
      var currentItem = parseInt(itemId.toString());

      //Limit the items to 100
      if ((currentItem - lastItemUsed) > 100 ) {
        ids = _.range(currentItem - 99, currentItem + 1);
      } else {
        ids = _.range(lastItemUsed + 1, currentItem + 1);
      }
      db.replace(maxItemCollection, currentItem);
      step2_getAllArticles();
    });
  }).on('error', function(e) { console.error(e) })
}


function step2_getAllArticles() {
  var expectedRequests = ids.length;
  debug('Expected Requests: ' + expectedRequests);
  var finishedRequests = 0;
  if (expectedRequests === 0) {
    console.log('No new data at this moment');
  } else {
    _.each(ids, function (id) {
      var url = "https://hacker-news.firebaseio.com/v0/item/" + id + ".json?print=pretty";
      https.get(url, function(res) {
        var payload = "";
        res.on('data', function(data) {
          payload = payload.concat(data);
        });
        
        res.on('end', function () {
          var dataJSON;
          finishedRequests = finishedRequests + 1;
          debug('Finished Requests: ' + finishedRequests);
          debug('With URL: ' + url);
          try {
            debug(payload.toString());
            dataJSON = JSON.parse(payload.toString())
          } catch(e) {
            //Some of the responses have incorrect JSON - skip these
            return;
          }
          step3_ProcessFoundData(dataJSON, (expectedRequests === finishedRequests));
        });
        
      }).on('error', function(e) {
        console.error(e);
      });
    })
  }
}

function step3_ProcessFoundData(data, isLast) {
  if (data.type === 'story') {
    db.insert(articlesCollection, data);
  }
  if (isLast) {
    wakeUpNotifier();
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
