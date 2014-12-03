var debug = require('debug')('number-gen-stream-client');
var test = require('tape');
var fs = require('fs');
var ws = fs.createWriteStream('numbers.txt');
var BigFileStream = require('./index');
var rs = new BigFileStream();

rs.pipe(ws);