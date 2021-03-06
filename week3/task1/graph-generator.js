var debug = require('debug')('graph-generator');

var _ = require('underscore');
var async = require('async');

var githubFacade = require('../../shared/api/facade-github-octonode');
var Graph = require("./graph-model");

module.exports = function(config) {

  var api = githubFacade(config);

  return {

    generateInSeq: function(owner, depth, callback) {
      var graph = new Graph();
      var visited = [];
      var currentDepth = 1;
      var maxDepth = adjustDepth(depth);

      runSeq([owner], callback);

      // TODO Optional: I could store the level info directly in my graph structure for optimization

      function runSeq(peers, callback) {
        var nextLevelPeers = [];
        var currentLevelPeersNumber = peers.length;

        debug('The number of peers for processing on level ' + currentDepth + ' is ' + currentLevelPeersNumber);
        async.eachSeries(peers, function(peer, done) {
          debug('Processing peer: ' + peer);
          var following;
          currentLevelPeersNumber--;
          if (_.contains(visited, peer)) {
            done();
            //return;
          } else {
            visited.push(peer);

            // These are going to be parallel async calls
            following = api.following(peer, function(err, following) {
              debug(peer + ' data obtained');
              var names;
              if (following.length === 0) {
                graph.addEdges(peer, following);
              } else {
                names = _.pluck(following, 'login');
                graph.addEdges(peer, names);
                nextLevelPeers = nextLevelPeers.concat(names);
              }
              graph.addDistance(peer, currentDepth);
              if (currentLevelPeersNumber > 0) {
                done();
              } else {
                (++currentDepth > maxDepth) ? callback(null, graph) : runSeq(nextLevelPeers, callback)
              }
            });
          }
        })
      }

    },

    generateInParallel: function(owner, depth, callback) {
      var graph = new Graph();
      var visited = [];
      var currentDepth = 1;
      var maxDepth = adjustDepth(depth);
      
      runParallel([owner], callback);

      function runParallel(peers, callback) {
        var nextLevelPeers = [];
        var currentLevelPeersNumber = peers.length;

        debug('The number of peers for processing on level ' + currentDepth + ' is ' + currentLevelPeersNumber);
        peers.forEach(function(peer) {
          debug('Processing peer: ' + peer);
          var following;
          if (_.contains(visited, peer)) {
            currentLevelPeersNumber--;
            return;
          } else {
            visited.push(peer);
            // These are going to be parallel async calls
            following = api.following(peer, function(err, following, headers) {
              debug(peer + ' data obtained');
              var names;
              currentLevelPeersNumber--;
              if (following.length === 0) {
                graph.addEdges(peer, following);
              } else {
                names = _.pluck(following, 'login');
                graph.addEdges(peer, names);
                nextLevelPeers = nextLevelPeers.concat(names);
              }
              graph.addDistance(peer, currentDepth);
              if (currentLevelPeersNumber === 0) {
                (++currentDepth > maxDepth) ? callback(null, graph) : runParallel(nextLevelPeers, callback)
              }
            });
          }
        })
      }
    }
  }
}

function adjustDepth(depth) {
  // If not correct do not throw just works with the smallest possible depth
  return (depth < 1 || depth > 3) ? 1 : depth
}
