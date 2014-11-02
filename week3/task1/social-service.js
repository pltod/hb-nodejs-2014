var debug = require('debug')('social-service');
var _ = require('underscore');
var utils = require('../../shared/db/utils');
//var owner = 'pltod';
//var nodes = api.following(owner);


var api = require('./facade-github'); //Obtain data
var Graph = require("./graph"); //Store it as graph

// TODO

// * call API FACADE
// * build graph representation with adjacency list
// * keep a structure id <-> instantiated Graph

//debug(graphs);


module.exports = function () {
  var graphs = [];


  // var owner = owner;
  // var depth = depth;
  // 
  // nodes.forEach(function (node) {
  //   debug(node.login);
  // });
  
  // This could be with new Graph (DATA) 
  //var graph = new Graph(owner, depth);

  //debug('Created graph: ' + graph.toString());

  return {
    
    generateGraph: function (owner, depth) {
      var graph;
      var existingGraph = _.findWhere(graphs, {owner: owner, depth: depth});
      if (existingGraph) {
        return existingGraph;
      } else {
        graph = {id: utils.uid(), owner: owner, depth: depth, graph: new Graph()};        
        graphs.push(graph);
        return graph;
      }
    },

    regenerateGraph: function (owner, depth) {
      var graph = {id: utils.uid(), owner: owner, depth: depth, graph: new Graph()};
      graphs = _.filter(graphs, function(graph){ return ((graph.owner !== owner) && (graph.depth !== depth)) });
      graphs.push(graph);
      return graph;
    },

    generatedGraphs: function () {
      return _.map(graphs, function (graph) {
        return _.pick(graph, 'id', 'owner', 'depth');
      })
    },
    
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

