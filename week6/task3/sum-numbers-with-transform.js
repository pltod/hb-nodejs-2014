var debug = require('debug')('sum-numbers-with-transform');
var Decoder = require('string_decoder').StringDecoder;
var decoder = new Decoder();
var SumNumbers = require('./sum-numbers-stream');
var fs = require('fs');

fs.createReadStream('numbers.txt')
  .pipe(new SumNumbers())
  .on('data', function(line) {
    debug('dsds');
    debug(decoder.write(line));
  })
  .on('end', function() {
    debug('end');
  })

