var debug = require('debug')('facade-github-mock');
var _ = require('underscore');

var data = [
  {"user": "pltod", "following": [{"login": "node2"}, {"login": "node3"}]}, // Level 1
  {"user": "node2", "following": [{"login": "pltod"}, {"login": "node4"}]}, // Level 2 
  {"user": "node3", "following": [{"login": "node4"}, {"login": "node5"}]}, // Level 2
  {"user": "node4", "following": [{"login": "node6"}, {"login": "node7"}]}, // Level 3
  {"user": "node5", "following": [{"login": "node8"}, {"login": "node9"}, {"login": "node10"}]}  // Level 3
]

module.exports = {
  following: function(name, callback) {
    setTimeout(function() {
      debug('Searching followers of ' + name);
      var result = _.findWhere(data, {user: name}).following;
      callback(null, result);
    }, 0);
  }
}
