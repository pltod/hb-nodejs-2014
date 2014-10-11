var fs = require('fs');
var file = {};
var sname;
var pname;
var pvalue;

module.exports = function (data, fileName) {
  var obj = JSON.parse(data);
  var sections = getSections(obj);
  sections.forEach(function (section) {
    var current = obj[section];
    appendToFile('['.concat(section).concat(']').concat('\n'), fileName);
    var lines = getLines(current);
    lines.forEach(function (line) {
      appendToFile(line.concat('=').concat(current[line]).concat('\n'), fileName);
    })
    appendToFile('\n', fileName);
  })
}


function getSections(obj) {
  return Object.keys(obj);
}

function getLines(section) {
  return Object.keys(section);
}

function appendToFile(data, fileName) {
  fs.appendFileSync(fileName, data, 'utf-8');
}
