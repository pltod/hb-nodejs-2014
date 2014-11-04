var debug = require('debug')('test');
var _ = require('underscore');
var config = require('../../../../config');
var async = require('async');
//var api = require('../../../shared/api/facade-github-octonode')(config.token);
var api = require('../../../shared/api/facade-github-octonode/mock');
var Graph = require("../graph-model"); //Store it as graph

var owner = 'pltod';
var depth = 1;
var depthMax = 3;
// var depthMax = 3;
var graph = new Graph();
var visited = [];

collectRelations([owner], function () {
  debug(graph.toString());  
});

function collectRelations(peers, callback) {
  // TODO Optional: I could store the level info directly in my graph structure for optimization
  var nextLevelItems = [];
  var levelItemsNumber = peers.length;

  debug(levelItemsNumber);
  async.eachSeries(peers, function(peer, done) {
    debug('Processing peer: ' + peer);
    var following;
    levelItemsNumber--;
    if (_.contains(visited, peer)) {
      done();
      //return;
    } else {
      visited.push(peer);

      // These are going to be parallel async calls
      following = api.following(peer, function (err, following) {
        debug('Processing output...');
        var names = _.pluck(following, 'login');
        graph.addEdges(peer, names);
        nextLevelItems = nextLevelItems.concat(names);
        debug(nextLevelItems);
        debug(levelItemsNumber);
        
        if (levelItemsNumber > 0) {
          done();
        } else {
          depth++;
          if (depth > depthMax) {
            done();
            callback();
          } else {
            collectRelations(nextLevelItems, callback);
          }
        }
      });
    }
  })
}


