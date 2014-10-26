var debug = require('debug')('fb-api')
var read = require('../../../shared/readers/reader-remote');

module.exports = {
  getLatestPostId: getLatestPostId,
  getPost: getPost,
  getParentStory: getParentStory
}

function getLatestPostId(callback) {
  read.https(
    "https://hacker-news.firebaseio.com/v0/maxitem.json",
    callback
  )
}

function getPost(id, callback) {
  var url = "https://hacker-news.firebaseio.com/v0/item/" + id + ".json";
  debug('Obtain post at: ' + url);
  read.https(
    url,
    callback
  )
}

function getParentStory(id, callback) {
  getPost(id, handler);
  
  function handler(err, post) {
    if (err) {
      callback(err, null);
      return;
    }
    var obj = JSON.parse(post)
    debug('Obtained post: ' + obj.id);
    debug('Post type: ' + obj.type);
        
    if (obj.type === 'story') {
      callback(null, post)
    } else {
      getPost(obj.parent, handler)
    }
  }
}