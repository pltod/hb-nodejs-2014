var debug = require('debug')('social-service');
var Graph = require("./graph");


module.exports = function (owner, depth) {
  var owner = owner;
  var depth = depth;
  var graph = new Graph(owner, depth);

  debug('Created graph: ' + graph.toString());

  return {
    
    uid: function () {
      return graph.getUID();
    },
    // returns a list with the usersnames of everyone the user follows
    following: function () {
      // Not only the direct level but several level depending on the depth
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

