var debug = require('debug')('graph-model');
//var dbUtils = require('../../shared/db/utils');
var api = require('./facade-github');

// [
//   {"user": "node1", "follows": ["node2", "node3"], "following": [list with nodes]},
//   {"user": "node2", "follows": ["node1", "node4"]}, //Level 2 
//   {"user": "node3", "follows": ["node4", "node5"]}, //Level 2
//   {"user": "node4", "follows": ["node6", "node7"]}, //Level 3
//   {"user": "node5", "follows": ["node8", "node9"]}  //Level 3
// ]

function DirectedGraph() {
  
  //this.uid = dbUtils.uid();
  this.relations = [];
  
  debug('Contact Github API to build the graph');
  //api.TODO
  debug('Done...');
  
  DirectedGraph.prototype.getUID = function () {
    return this.uid;
  }

  // Returns a list of nodes (strings) for the given node
  DirectedGraph.prototype.getNeighboursFor = function (node) {
    debug('getNeighboursFor invoked with: ' + node);
    return ['A', 'B', 'C'];
  }
  
  // Adds an edge between two nodes. If the nodes does not exist, they should be created.
  DirectedGraph.prototype.addEdge = function (nodeA, nodeB) {
    if (this.relations[nodeA]) {
      this.relations[nodeA].push(nodeB);
    } else {
      this.relations[nodeA] = [nodeB];
    } 
  }
  
  // Returns true if there is a path between nodeA and nodeB. Keep in mind that the graph is directed!
  DirectedGraph.prototype.pathBetween = function (nodeA, nodeB) {
    debug('Searching pathBetween ' + nodeA + ' and ' + nodeB);
    return true;
  }
  
  // Returns a string representation of the graph. This can be the stringified version of the internal structure of the graph.
  DirectedGraph.prototype.toString = function () {
    return 'The String Representation of the Graph';
  }
}

module.exports = DirectedGraph;