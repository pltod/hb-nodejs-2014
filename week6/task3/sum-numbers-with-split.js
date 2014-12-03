var debug = require('debug')('sum-numbers-with-split');
var split = require('split');
var fs = require('fs');
var sum = 0;

fs.createReadStream('numbers.txt')
  .pipe(split(",\n"))
  .on('data', function(line) {
    if (!isNaN(parseFloat(line))) {
      sum = sum + parseFloat(line);
      debug(sum);
    }
  })
  .on('end', function() {
    console.log('ending');
    console.log(sum);
  })
