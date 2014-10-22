process.env.MONGO_HOST = process.env.MONGO_HOST || 'localhost';
process.env.MONGO_PORT = process.env.MONGO_PORT || 27017;
process.env.DB = process.env.DB || 'hb-week2-task1';

var fs = require('fs');
var Db = require('mongodb').Db;
var MongoClient = require('mongodb').MongoClient;
var args = require("minimist")(process.argv.slice(2));
var url = 'mongodb://' + process.env.MONGO_HOST + ":" + process.env.MONGO_PORT + "/" + process.env.DB;


var file = args._[0];
var data = fs.readFileSync(file, 'utf-8');
var fileName = file.split('.')[0];

MongoClient.connect(url, function(err, db) {
  db.collection(fileName).insert(JSON.parse(data), function(err, result) {
    console.log(result)
    db.close();
  });
});