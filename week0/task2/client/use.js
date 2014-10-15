exports.use = function(fn, options) {
  fn(this, options);
  return this;
};