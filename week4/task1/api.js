var debug = require('debug')('snippet-app-api');
module.exports = function (app) {

  app.get("/snippet", function(req, res) {
    debug('Getting all snippets...');
    var user = req.query.user;
    debug(user);
    if (user) {
      app.db.findSnippetsByUser(user, function(err, snippets) {
        err ? pong(res, 500, {"result": "Unable to find snippets!"}) : pong(res, 200, snippets) 
      });
    } else {
      app.db.findAllSnippets(function(err, snippets) {
        err ? pong(res, 500, {"result": "Unable to find snippets!"}) : pong(res, 200, snippets) 
      });
    }
  });  
  
  app.get("/snippet/:id", function(req, res) {
    debug('Getting snippet with id...');
    debug(req.params.id);

    app.db.findSnippetById(req.params.id, function(err, snippet) {
      err ? pong(res, 500, {"result": "Unable to find snippet!"}) : pong(res, 200, snippet) 
    });
  });
  
  app.post("/snippet", function(req, res) {
    debug('Saving snippet...');
    debug(req.body.lang);
    debug(req.body.file);
    debug(req.body.code);
    debug(req.body.user);
  
    app.db.saveSnippet(req.body, function (err, result) {
      err ? pong(res, 500, {"result": "Unable to save snippet!"}) : pong(res, 200, result) 
    });
  });
  
  app.put("/snippet/:id", function(req, res) {
    debug('Updating snippet...');
    debug(req.params.id);
    debug(req.body);
    app.db.updateSnippet(req.params.id, req.body.code, function (err, result) {
      err ? pong(res, 500, {"result": "Unable to update snippet!"}) : pong(res, 200, result) 
    });
  });
  
  app.delete("/snippet/:id", function(req, res) {
    debug('Deleting snippet...');
    debug(req.params.id);
    app.db.deleteSnippet(req.params.id, function (err, result) {
      err ? pong(res, 500, {"result": "Unable to delete snippet!"}) : pong(res, 200, result) 
    });
  });  
  
}

function pong(res, code, data) {
  res.writeHead(code, {'Content-Type': 'application/json'});
  debug(data);
  (typeof data === "string") ? res.write(data) : res.write(JSON.stringify(data));
  res.end();
}