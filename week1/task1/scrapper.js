var db = require('./db');
var https = require('https');
var fs = require('fs');
var _ = require('underscore');
var articlesCollection = 'articles.json';
var maxItemCollection = 'maxitem.json';
var lastItemUsed = db.findAll(maxItemCollection);
var ids = [];

// TODO run this each two minutes
// TODO call the notifier
runProcess();

function runProcess() {
  step1_getLatestMaxItem();
}

function step1_getLatestMaxItem() {
  https.get("https://hacker-news.firebaseio.com/v0/maxitem.json", function (res) {
    res.on('data', function(itemId) {
      var currentItem = parseInt(itemId.toString());

      //Limit the items to 100
      if ((currentItem - lastItemUsed) > 100 ) {
        ids = _.range(currentItem - 100, currentItem + 1);
      } else {
        ids = _.range(lastItemUsed + 1, currentItem + 1);
      }
      db.replace(maxItemCollection, currentItem);
      step2_getAllArticles();
    });
  }).on('error', function(e) { console.error(e) })
}


function step2_getAllArticles() {
  _.each(ids, function (id, index) {
    var isLast = (index == ids.length - 1);
    var url = "https://hacker-news.firebaseio.com/v0/item/" + id + ".json?print=pretty";
    https.get(url, function(res) {
      res.on('data', function(data) {
        var dataJSON;
        try {
          dataJSON = JSON.parse(data.toString())
        } catch(e) {
          //Some of the responses have incorrect JSON - skip these
          return;
        }
        step3_ProcessFoundData(dataJSON);
        
        if (isLast) {
          // TODO Call Notifier
        }
      });
    }).on('error', function(e) {
      console.error(e);
    });
  })
}

function step3_ProcessFoundData(data) {
  if (data.type === 'story') {
    db.insert(articlesCollection, data)
  }
}
