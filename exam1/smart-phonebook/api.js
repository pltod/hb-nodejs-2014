var debug = require('debug')('phonebook-app-api');
module.exports = function (app) {

  app.post("/contact", function(req, res) {
    debug('Saving contact...');
    debug(req.body.phoneNumber);
    debug(req.body.personIdentifier);
  
    app.db.saveContact(req.body, function (err, result) {
      err ? pong(res, 500, {"result": "Unable to save contact!"}) : pong(res, 200, result) 
    });
  });

  app.get("/contact", function(req, res) {
    debug('Getting all contacts...');
    app.db.findAllContacts(function(err, snippets) {
      err ? pong(res, 500, {"result": "Unable to find snippets!"}) : pong(res, 200, snippets) 
    });
  });  
  
  app.get("/contact/:id", function(req, res) {
    debug('Getting contact for...');
    debug(req.params.id);

    app.db.findContactById(req.params.id, function(err, snippet) {
      err ? pong(res, 500, {"result": "Unable to find snippet!"}) : pong(res, 200, snippet) 
    });
  });
  
  app.delete("/contact/:id", function(req, res) {
    debug('Deleting contact...');
    debug(req.params.id);
    app.db.deleteContact(req.params.id, function (err, result) {
      err ? pong(res, 500, {"result": "Unable to delete snippet!"}) : pong(res, 200, result) 
    });
  });  
  
  return app;
}

function pong(res, code, data) {
  res.writeHead(code, {'Content-Type': 'application/json'});
  debug(data);
  (typeof data === "string") ? res.write(data) : res.write(JSON.stringify(data));
  res.end();
}