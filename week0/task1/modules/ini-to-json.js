var fs = require('fs');
var file = {};

module.exports = function (data, fileName) {
  transform(data);
  return JSON.stringify(file,null,'\t');
}

function transform(data) {
  var sname;
  var sections = data.split('\n');
  sections.forEach(function (item) {
    if (!ignoreLine(item)) {
      if (isNewSection(item)) {
        sname = getSectionName(item);
        file[sname] = {};
      } else {
        var keyValue = getKeyValue(item);
        file[sname][keyValue[0].trim()] = keyValue[1].trim();
      }
    }
  });
}

function isNewSection(data) {
  return data.indexOf('[') !== -1;
}

function isComment(data) {
  return data.indexOf(';') !== -1;
}

function ignoreLine(data) {
  return data === "" || isComment(data);
}

function getSectionName(data) {
  return data.substr(1, data.length-2);
}

function getKeyValue(data) {
  return data.split('='); 
}

