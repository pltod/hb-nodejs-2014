var test = require('tape');
var beerAndFries = require("../src/beerAndFriesMore.js");

function printSuccessInfo(data) {
  return 'Best combination is: ' + data.highestSum + " achieved with " + data.bestCombination;
}

test('### Scenario 1 ###', function(t) {
  
  var testData = [{
    type: "beer",
    score: 10
  }, {
    type: "beer",
    score: 11
  }, {
    type: "fries",
    score: 1
  }, {
    type: "fries",
    score: 5
  }];
  
  var result = beerAndFries(testData);
  t.equal(65, result.highestSum, printSuccessInfo(result));
  t.end();
  
});

test('### Scenario 2 ###', function(t) {
  
  var testData = [{
    type: "beer",
    score: 1
  }, {
    type: "beer",
    score: 11
  }, {
    type: "fries",
    score: 0
  }, {
    type: "fries",
    score: 50
  }];

  var result = beerAndFries(testData);
  t.equal(550, result.highestSum, printSuccessInfo(result));

  t.end();
});

test('### Scenario 3 ###', function(t) {
  
  var testData = [{
    type: "beer",
    score: 5
  }, {
    type: "fries",
    score: 5
  }];

  var result = beerAndFries(testData);
  t.equal(25, result.highestSum, printSuccessInfo(result));

  t.end();
});

test('### Scenario 4 ###', function(t) {
  
  var testData = [];

  var result = beerAndFries(testData);
  t.equal(0, result.highestSum, printSuccessInfo(result));
  
  t.end();
  
});

test('### Scenario 5 ###', function(t) {
  
  var testData = [{
    type: "beer",
    score: 1000
  }, {
    type: "beer",
    score: 1010
  }, {
    type: "beer",
    score: 1020
  }, {
    type: "beer",
    score: 1030
  }, {
    type: "beer",
    score: 1040
  }, {
    type: "fries",
    score: 834
  }, {
    type: "fries",
    score: 500
  }, {
    type: "fries",
    score: -1
  }, {
    type: "fries",
    score: 0
  }, {
    type: "fries",
    score: 60
  }];

  var result = beerAndFries(testData);
  t.equal(1442560, result.highestSum, printSuccessInfo(result));

  t.end();
  
});

test('### Scenario 6 ###', function(t) {
  
  var testData = [{
    type: "beer",
    score: 2000
  }, {
    type: "beer",
    score: 1010
  }, {
    type: "beer",
    score: 55
  }, {
    type: "beer",
    score: 1030
  }, {
    type: "beer",
    score: 1
  }, {
    type: "fries",
    score: 834
  }, {
    type: "fries",
    score: -500
  }, {
    type: "fries",
    score: -1
  }, {
    type: "fries",
    score: 0
  }, {
    type: "fries",
    score: -60
  }];

  var result = beerAndFries(testData);
  t.equal(1663190, result.highestSum, printSuccessInfo(result));

  t.end();
  
});

test('### Scenario 7 ###', function(t) {
  
  var testData = [{
    type: "beer",
    score: 0
  }, {
    type: "beer",
    score: -1
  }, {
    type: "beer",
    score: -2
  }, {
    type: "beer",
    score: -3
  }, {
    type: "beer",
    score: -4
  }, {
    type: "fries",
    score: -5
  }, {
    type: "fries",
    score: 0
  }, {
    type: "fries",
    score: -1
  }, {
    type: "fries",
    score: 0
  }, {
    type: "fries",
    score: -60
  }];

  var result = beerAndFries(testData);
  t.equal(257, result.highestSum, printSuccessInfo(result));

  t.end();
  
});