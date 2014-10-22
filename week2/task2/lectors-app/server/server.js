var url = require('url');
var express = require("express");
var mongodb = require('express-mongo-db');
var app = express();
app.use(mongodb(require('mongodb'), {db: 'hb-week2-task1'}));
var position = 0;

var data = [{
  "rank": 1,
  "keyword": "JavaScript",
  "count": 10000
}, {
  "rank": 2,
  "keyword": "Python",
  "count": 8000
}];


app.all("*", function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", ["X-Requested-With", "Content-Type", "Access-Control-Allow-Methods"]);
  res.header("Access-Control-Allow-Methods", ["GET"]);
  next();
});

app.get("/keywords", function(req, res) {

  var pos = parseInt(req.query.fromPosition);
  var direction = req.query.direction;
  
  if (!isNaN(pos)) {
    
    if (direction === 'prev') {
      if (pos <= 4) {
        position = 0
      } else {
        position = pos - 4;
      }
    } else {
      position = pos
    }
    
  }
  
  
  var collection = req.db.collection('keywords');

  collection.find().sort([['count', -1]]).toArray(function(err, docs) {
    console.log(docs);
  });

  collection.find().sort([['count', -1]]).skip(position).limit(2).toArray(function(err, docs) {
    docs.forEach(function (doc, index) {
      doc.rank = position + index + 1
    });
    console.log(docs);
    res.json(docs);
  });
  
  
});

app.listen(8000);