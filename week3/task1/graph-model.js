var debug = require('debug')('graph-model');

function DirectedGraph() {
  
  //  Format: {'node0': ['node1', 'node2']}
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