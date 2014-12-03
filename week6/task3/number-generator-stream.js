var debug = require('debug')('number-gen-stream');
var Readable = require('stream').Readable;
var inherits = require('util').inherits;

module.exports = NumberGenerator;

inherits(NumberGenerator, Readable);

//function NumberGenerator(length, options) {

function NumberGenerator() {
  if (!(this instanceof NumberGenerator)) {
    return new NumberGenerator();
  }

  Readable.call(this, {});

  // this.maxLength = length;
  // this.maxLength = 1000000;
  this.maxLength = 1000000000
}

NumberGenerator.prototype._read = function(size) {
  var s = 8, ready = true, item, length;
  while (ready) {
    item = Math.random() + ',\n';
    length = Buffer.byteLength(item);
    if (length < this.maxLength) {
      ready = this.push(item);
      this.maxLength -= length;
    } else {
      this.push(null);
      ready = false;
    }
  }
};