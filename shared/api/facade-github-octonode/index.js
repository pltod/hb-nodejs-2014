var debug = require('debug')('facade-github-octonode');
var github = require('octonode');

module.exports = function(token) {

  var token = token;
  var client = github.client(token);

  return {
    //callback -> err, body, headers
    following: function(user, callback) {
      var ghuser = client.user(user);
      ghuser.following(callback);
    },
    //callback -> err, left, max
    limit: function(callback) {
      client.limit(callback)
    }
  }
}
