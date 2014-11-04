var debug = require('debug')('facade-github-mock');
var _ = require('underscore');

var data = [
  {"user": "node1", "following": ["node2", "node3"]}, // Level 1
  {"user": "node2", "following": ["node1", "node4"]}, // Level 2 
  {"user": "node3", "following": ["node4", "node5"]}, // Level 2
  {"user": "node4", "following": ["node6", "node7"]}, // Level 3
  {"user": "node5", "following": ["node8", "node9", "node10"]}  // Level 3
]

module.exports = {
  following: function (name) {
    debug(name);
    return _.findWhere(data, {user: name}).following;
  }
}