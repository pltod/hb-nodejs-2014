var debug = require('debug')('graph-service-social');
var _ = require('underscore');

module.exports = function(graph) {

  var graph = graph;

  return {

    // returns a list with the usersnames of everyone the user follows
    following: function() {
      return graph.data.getNeighboursFor(graph.owner);
    },

    // accepts a username and returns true/false if the main user follows the one specified by the argument
    isFollowing: function(username) {
      return (graph.data.getNeighboursFor(graph.owner).indexOf(username) !== -1)
    },

    isFollowingBack: function(username) {
      return (graph.data.getNeighboursFor(username).indexOf(graph.owner) !== -1)
    },

    hasFollowingInfoFor: function(username) {
      var following = graph.data.getNeighboursFor(username);

      return following ? true : false
    },

    // accepts a username and return the number of hops needed to get to that user following the following(pun not quite intended) relation
    stepsTo: function(username) {
      return graph.data.getDistance(username);
    }

  }

}
