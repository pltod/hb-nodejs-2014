var debug = require('debug')('the-graph');
var dbUtils = require('../../shared/db/utils');
var api = require('./facade-github');

// [
//   {"user": "node1", "followers": ["node2", "node3"], "following": [list with nodes]},
//   {"user": "node2", "followers": ["node1", "node4"]}, //Level 2 
//   {"user": "node3", "followers": ["node4", "node5"]}, //Level 2
//   {"user": "node4", "followers": ["node6", "node7"]}, //Level 3
//   {"user": "node5", "followers": ["node8", "node9"]}  //Level 3
// ]

function DirectedGraph() {
  
  this.uid = dbUtils.uid();
  
  debug('Contact Github API to build the graph');
  //api.TODO
  debug('Done...');
  
  DirectedGraph.prototype.getUID = function () {
    return this.uid;
  }
  
  DirectedGraph.prototype.getNeighboursFor = function (node) {
    //followers + following
    debug('getNeighboursFor invoked with: ' + node);
    return ['A', 'B', 'C'];
  },
  DirectedGraph.prototype.pathBetween = function (nodeA, nodeB) {
    debug('Searching pathBetween ' + nodeA + ' and ' + nodeB);
    return true;
  },
  DirectedGraph.prototype.toString = function () {
    return 'The String Representation of the Graph';
  }
}

module.exports = DirectedGraph;