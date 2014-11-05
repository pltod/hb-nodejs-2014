var debug = require('debug')('graph-service');
var _ = require('underscore');

module.exports = function (config) {
  var db = require('./graph-db');
  var generator = require('./graph-generator')(config);
  
  return {
    
    generateGraph: function (owner, depth, callback) {
      var existingGraph = db.findByOwnerAndDepth(owner, depth);
      if (existingGraph) {
        // TODO better alternative for setTimeout
        debug('Graph for user ' + owner + ' with depth ' + depth + ' is already created')
        setTimeout(function() {
          callback(null, existingGraph.id);
        }, 0);
      } else {
        generator.generateInSeq(owner, depth, function (err, graph) {
          var graphId = db.insert({owner: owner, depth: depth, data: graph});
          callback(null, graphId);
        });        
      }
    },

    regenerateGraph: function (owner, depth, callback) {
      generator.generateInSeq(owner, depth, function (err, graph) {
        db.deleteByOwnerAndDepth(owner, depth);
        var graphId = db.insert({owner: owner, depth: depth, data: graph});
        callback(null, graphId);
      });
    },

    getAllGraphs: function () {
      return db.findAllGraphsInfo();
    },
    
    getGraph: function (id) {
      return db.findGraphById(id);
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