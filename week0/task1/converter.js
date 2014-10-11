#!/usr/bin/env node

var fs = require('fs');
var file = process.argv[2];

// Validation
if (inputIsNotValid(file)) {
  console.log('Please specify correct file name!')
  return;
}

// Utils
var read = getReader(file);
var convert = getConverter(file);
var write = require('./modules/writer-file');

read(file, function (data) {
  write(getOutputFile(file), convert(data));
})

function inputIsNotValid(file) {
  if (file == null) {
    return true;
  }
  return false;
}

function getReader(file) {
  return isRemote(file) ? require('./modules/reader-http') : require('./modules/reader-file')
}

function getConverter(file) {
  return getFileType(file) === 'ini' ? require('./modules/ini-to-json') : require('./modules/json-to-ini');
}

function getOutputFile(file) {
  
  var fileName;
  var pathParts;
  var fileParts;
  
  if (file.indexOf('/') == -1) {
    // local, name only
    fileName = file
  } else {
    // remote or with path
    pathParts = file.split('/')
    fileName = pathParts[pathParts.length - 1]
  }
  
  fileParts = fileName.split('.');
  return fileParts[1] === 'ini' ? fileParts[0].concat('.json') : fileParts[0].concat('.ini')
}

function isRemote(file) {
  if (file.substr(0, 5) === 'http:' || file.substr(0, 6) === 'https:') {
    return true;
  }
  return false;
}

// Do it with lazy evaluation - one execution at several invocations
function getFileType(file) {
  var r = file.split('.');
  return r[r.length - 1];
}