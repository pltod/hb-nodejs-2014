var storage = require('node-persist');
var https = require('https');
var fs = require('fs');
var _ = require('underscore');
var maxItem = getStoredMaxItem();
var ids = [];

console.log(__dirname);

storage.initSync();
storage.setItem('articles.json', []);

runProcess();

function runProcess() {
  step1_getLatestMaxItem();
}


function step1_getLatestMaxItem() {
  https.get("https://hacker-news.firebaseio.com/v0/maxitem.json", function (res) {
    var start = maxItem+1;
    var end;
    res.on('data', function(data) {
      var currentItem = parseInt(data.toString());
      if (maxItem === 0) {
        ids = [currentItem];
      } else {
        end = currentItem + 1;
        ids = _.range(start, end);
      }
      storeMaxItem(currentItem);
      step2_getAllArticles();
    });
  }).on('error', function(e) { console.error(e) })
}


function step2_getAllArticles() {
  console.log(ids);
  _.each(ids, function (id) {
    var url = "https://hacker-news.firebaseio.com/v0/item/" + id + ".json?print=pretty";
    https.get(url, function(res) {
      res.on('data', function(data) {
        var dataJSON;
        try {
          dataJSON = JSON.parse(data.toString())
        } catch(e) {
          //Skip on incorrect JSON
          return;
        }
        step3_ProcessFoundData(dataJSON);
      });
    }).on('error', function(e) {
      console.error(e);
    });
  })
}

function step3_ProcessFoundData(data) {
  // This is what we do when we find data
  // Write it in json file
  // console.log(data);
  console.log(data.type);
  if (data.type === 'story') {
    console.log("storing: ")
    console.log(data.id)
    var articles = storage.getItem('articles.json');
    articles.push(data);
    storage.setItem('articles.json', articles)
  } else {
      console.log("skipping")
  }
}

function getStoredMaxItem() {
  return parseInt(fs.readFileSync("maxItem.txt", 'utf-8'));
}

function storeMaxItem(id) {
  fs.writeFileSync("maxItem.txt", id, 'utf-8')
}
