var debug = require('debug')('graph-model');

var data = [
  {"user": "node1", "follows": ["node2", "node3"]}, // Level 1
  {"user": "node2", "follows": ["node1", "node4"]}, // Level 2 
  {"user": "node3", "follows": ["node4", "node5"]}, // Level 2
  {"user": "node4", "follows": ["node6", "node7"]}, // Level 3
  {"user": "node5", "follows": ["node8", "node9", "node10"]}  // Level 3
]

function DirectedGraph() {
  
  this.relations = {};
  
  DirectedGraph.prototype.getUID = function () {
    return this.uid;
  }

  // Returns a list of nodes (strings) for the given node
  DirectedGraph.prototype.getNeighboursFor = function (node) {
    debug('getNeighboursFor invoked with: ' + node);
    return this.relations[node];
  }
  
  // Adds an edge between two nodes. If the nodes does not exist, they should be created.
  DirectedGraph.prototype.addEdge = function (nodeA, nodeB) {
    if (this.relations[nodeA]) {
      this.relations[nodeA].push(nodeB);
    } else {
      this.relations[nodeA] = [nodeB];
    } 
  }

  DirectedGraph.prototype.addEdges = function (node, neighbours) {
    this.relations[node] = neighbours;
  }
  
  // Returns true if there is a path between nodeA and nodeB. Keep in mind that the graph is directed!
  DirectedGraph.prototype.pathBetween = function (nodeA, nodeB) {
    debug('Searching pathBetween ' + nodeA + ' and ' + nodeB);
    return true;
  }
  
  // Returns a string representation of the graph. This can be the stringified version of the internal structure of the graph.
  DirectedGraph.prototype.toString = function () {
    return JSON.stringify(this.relations);
  }
}

module.exports = DirectedGraph;