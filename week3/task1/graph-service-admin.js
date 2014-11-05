var debug = require('debug')('graph-service-admin');
var _ = require('underscore');

module.exports = function(config) {
  var db = require('./graph-db');
  var generator = require('./graph-generator')(config);

  return {

    generateGraph: function(owner, depth, callback) {
      var existingGraph = db.findByOwnerAndDepth(owner, depth);
      if (existingGraph) {
        // TODO better alternative for setTimeout
        debug('Graph for user ' + owner + ' with depth ' + depth + ' is already created')
        setTimeout(function() {
          callback(null, existingGraph.id);
        }, 0);
      } else {
        generator.generateInParallel(owner, depth, function(err, graph) {
          var graphId = db.insert({
            owner: owner,
            depth: depth,
            data: graph
          });
          callback(null, graphId);
        });
      }
    },

    regenerateGraph: function(owner, depth, callback) {
      generator.generateInParallel(owner, depth, function(err, graph) {
        db.deleteByOwnerAndDepth(owner, depth);
        var graphId = db.insert({
          owner: owner,
          depth: depth,
          data: graph
        });
        callback(null, graphId);
      });
    },

    getAllGraphs: function() {
      return db.findAllGraphsInfo();
    },

    getGraph: function(id) {
      return db.findById(id);
    },
    
    getGraphData: function(id) {
      return db.findGraphDataById(id);
    }    
  }
}
