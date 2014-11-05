var test = require('tape');
var expectedData = {
  node1: ['node2', 'node3'],
  node2: ['node1', 'node4'],
  node3: ['node4', 'node5'],
  node4: ['node6', 'node7'],
  node5: ['node8', 'node9', 'node10']
};
var config = {
  mock: true,
  mockData: [
    {"user": "node1", "following": [{"login": "node2"}, {"login": "node3"}]}, // Level 1
    {"user": "node2", "following": [{"login": "node1"}, {"login": "node4"}]}, // Level 2 
    {"user": "node3", "following": [{"login": "node4"}, {"login": "node5"}]}, // Level 2
    {"user": "node4", "following": [{"login": "node6"}, {"login": "node7"}]}, // Level 3
    {"user": "node5", "following": [{"login": "node8"}, {"login": "node9"}, {"login": "node10"}]}  // Level 3
  ]
};
var graphGenerator = require('../graph-generator')(config);

test('### Test Sequence Generation ###', function(t) {
  graphGenerator.generateInSeq('node1', 3, function (err, result) {
    t.deepEqual(result.relations, expectedData, 'graph is generated successfully');
    t.end();
  })
});

test('### Test Parallel Generation ###', function(t) {
  graphGenerator.generateInParallel('node1', 3, function(err, result) {
    t.deepEqual(result.relations, expectedData, 'graph is generated successfully');
    t.end();
  })
});
