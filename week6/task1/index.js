var debug = require('debug')('filter-stream');
var Transform = require('stream').Transform;
var inherits = require('util').inherits;

module.exports = Filter;

inherits(Filter, Transform);

function Filter(pattern) {
  
  if (!(this instanceof Filter)) return new Filter(pattern)
    
  if (!pattern && !(pattern instanceof RegExp)) {
    console.log('Please specify pattern in the form of RegExp');
    return;
  }
    
  Transform.call(this, {objectMode: true});
 
  this._pattern = pattern;
}

Filter.prototype._transform = function (chunk, encoding, cb) {
  debug('Accepting and filtering data...')
  if (chunk instanceof RegExp) {
    this.setPattern(chunk);
    cb(null, 'Pattern changed');
  } else {
    this.getPattern().test(chunk) ? cb(null, chunk) : cb(null, 'Sorry there is no match')
  }
}

Filter.prototype.getPattern = function () {
  return this._pattern;
}

Filter.prototype.setPattern = function (pattern) {
  this._pattern = pattern;
}