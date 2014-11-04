var debug = require('debug')('graph-service');
var _ = require('underscore');
var db = require('./graph-db');
var generator = require('./graph-generator');

module.exports = function () {

  return {
    
    generateGraph: function (owner, depth) {
      var graph;
      var existingGraph = db.findByOwnerAndDepth(owner, depth);
      if (existingGraph) {
        // TODO make it async
        return existingGraph;
      } else {
        // TODO Move the callback in the server
        generator.createGraph(owner, depth, function (err, graph) {
          graphs.push(graph);
          return graph;
        });        
      }
    },

    regenerateGraph: function (owner, depth) {
      var graph = generator.createGraph(owner, depth);
      graphs = db.deleteByOwnerAndDepth(owner, depth);
      graphs.push(graph);
      return graph;
    },

    getAllGraphs: function () {
      return _.map(graphs, function (graph) {
        return _.pick(graph, 'id', 'owner', 'depth');
      })
    },
    
    getGraph: function (id) {
      var graph = findById(id);
      if (graph) {
        return graph.data.toString()
      }
      
      return 'Graph with ' + id + ' does not exists';
    },
    
    // THE METHODS BELLOW COULD BE IN A SEPARATE INTERFACE THAT WORKS IN A CONTEXT OF GRAPH ID
    
    // returns a list with the usersnames of everyone the user follows
    following: function () {
      // Not only the direct level but several level depending on the depth ???
      // May be only the first level of following
      
      // use DirectedGraph.prototype.getNeighboursFor ()
      
      return [];
    },
    // accepts a username and returns true/false if the main user follows the one specified by the argument
    isFollowing: function (username) {
      // main user is the 'owner' of the current graph used
      return graph.pathBetween(owner, username);
    },
    // accepts a username and return the number of hops needed to get to that user following the following(pun not quite intended) relation
    stepsTo: function (username) {
      // users = graph.getNeighboursFor(owner)
      // if exists return 1 if not for each of the users get neighbours
      return 2;
    }
  }  
}