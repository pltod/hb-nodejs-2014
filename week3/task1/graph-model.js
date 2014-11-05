var debug = require('debug')('graph-model');

module.exports = DirectedGraph;

function DirectedGraph() {
  
  //  Format: {'node0': ['node1', 'node2']}
  this.nodes = {};

  //  Format: {'node0': 'distance'}
  // This is a matter of trade-off. More memory but keeps nodes structure concise
  this.distances = {};

  // Adds an edge between two nodes. If the nodes does not exist, they should be created.
  DirectedGraph.prototype.addEdge = function (nodeA, nodeB) {
    if (this.nodes[nodeA]) {
      this.nodes[nodeA].push(nodeB);
    } else {
      this.nodes[nodeA] = [nodeB];
    } 
  }

  DirectedGraph.prototype.addEdges = function (node, neighbours) {
    this.nodes[node] = neighbours;
  }

  DirectedGraph.prototype.addDistance = function (node, distance) {
    this.distances[node] = distance;
  }

  DirectedGraph.prototype.getDistance = function (node) {
    return this.distances[node];
  }
  
  // Returns a list of nodes (strings) for the given node
  DirectedGraph.prototype.getNeighboursFor = function (node) {
    debug('getNeighboursFor invoked with: ' + node);
    return this.nodes[node];
  }
  
  // Returns true if there is a path between nodeA and nodeB. Keep in mind that the graph is directed!
  DirectedGraph.prototype.pathBetween = function (nodeA, nodeB) {
    debug('Searching pathBetween ' + nodeA + ' and ' + nodeB);
    return searchPath(this.nodes, nodeA, nodeB);
  }
  
  DirectedGraph.prototype.getNodes = function () {
    return this.nodes;
  }
  
  // Returns a string representation of the graph. This can be the stringified version of the internal structure of the graph.
  DirectedGraph.prototype.toString = function () {
    return JSON.stringify(this.nodes);
  }
}

function searchPath(nodes, nodeA, nodeB) {
  var queue = [];
  var checkedNodes = [];
  var currentNode;
  var neighbours;
  var found = false;

  queue.push(nodeA);
  while (queue.length > 0) {
    currentNode = queue.shift();
    neighbours = nodes[currentNode];
    if (!neighbours) {
      // This means that we reached the last extracted level
      break;
    } else if (neighbours.indexOf(nodeB) !== -1) {
      found = true;
      break;
    } else {
      neighbours.forEach(function(neighbour) {
        if (checkedNodes.indexOf(neighbour) === -1) {
          checkedNodes.push(neighbour);
          queue.push(neighbour);
        }
      })
    }
  }
  return found;
}


