var debug = require('debug')('filter-stream');
var Transform = require('stream').Transform;
var inherits = require('util').inherits;

module.exports = SumNumbers;

inherits(SumNumbers, Transform);

function SumNumbers() {
  
  if (!(this instanceof SumNumbers)) return new SumNumbers()
    
  Transform.call(this, {});
    
}

SumNumbers.prototype._transform = function (chunk, encoding, cb) {
  cb(null, chunk);
}
