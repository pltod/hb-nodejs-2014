var debug = require('debug')('test-filer-stream');
var test = require('tape');
var Filter = require('./index');
var pattern = /ab+c/;


test('### Testing Filter - Initial Saving Pattern ###', function(t) {
  var f = new Filter(pattern);
  t.equal(f.getPattern(), pattern, 'pattern is stored');
  t.end();    
});


test('### Testing Filter - Passing Not Matching ###', function(t) {
  var f = new Filter(pattern);
  debug('Sending data...')
  f.write('ac');
  f.end();
  
  f.on("readable", function () {
    while (null !== (chunk = f.read())) {
      debug('Reading transformed data back...')
      t.equal(chunk, "Sorry there is no match", 'input data do not match and is filtered');
    }
    t.end();    
  })
});

test('### Testing Filter - Passing Matching ###', function(t) {
  var f = new Filter(pattern);

  debug('Sending data...')
  f.write('abc');
  f.end();
  
  f.on("readable", function () {
    while (null !== (chunk = f.read())) {
      debug('Reading transformed data back...')
      t.equal(chunk, "abc", 'input data match and is returned back');
    }
    t.end();    
  })
});

test('### Testing Filter - Change Pattern Via Message ###', function(t) {
  var f = new Filter(pattern);
  var changed = false;
  
  debug('Sending data...')
  f.write(/ac/);
  f.write('ac');
  f.end();
  
  f.on("readable", function () {
    while (null !== (chunk = f.read())) {
      debug('Reading transformed data back...')
      if (!changed) {
        t.equal(chunk, "Pattern changed", 'pattern changed');
        changed = true;
      } else {
        t.equal(chunk, "ac", 'input data match and is returned back');
      }
    }
    t.end();    
  })
});