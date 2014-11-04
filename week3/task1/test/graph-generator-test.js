var config = require('../../../../config');
var test = require('tape');

// ensures that the test is always working against the mock
config.api.mock = true;
var expectedData = {
  node1: ['node2', 'node3'],
  node2: ['node1', 'node4'],
  node3: ['node4', 'node5'],
  node4: ['node6', 'node7'],
  node5: ['node8', 'node9', 'node10']
};
var graphGenerator = require('../graph-generator')(config.api);

test('### Test Sequence Generation ###', function(t) {
  graphGenerator.generateInSeq('node1', 3, function (result) {
    t.deepEqual(result, JSON.stringify(expectedData), 'graph is ok');
    t.end();
  })
});

test('### Test Parallel Generation ###', function(t) {
  graphGenerator.generateInParallel('node1', 3, function(result) {
    t.equal(result, JSON.stringify(expectedData), 'graph is ok');
    t.end();
  })
});
