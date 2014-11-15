var debug = require('debug')('phonebook-app-api');
var groupManager = require('./group-manager');
var _ = require('lodash');

module.exports = function (app) {

  app.post("/contact", function(req, res) {
    debug('Saving contact...');
  
    app.db.saveContact(req.body, function (err, result) {
      if (err) {
        pong(res, 500, {"result": "Unable to save contact!"})
      } else {
        setImmediate(function () {
          groupManager.process(app.db, result[0], function (err, result) {
            err ? console.log(err) : console.log(result)
          });
        });
        pong(res, 200, result);
      }
    })
    
  });

  app.get("/contact", function(req, res) {
    debug('Getting all contacts...');
    app.db.findAllContacts(function(err, contacts) {
      err ? pong(res, 500, {"result": "Unable to find contacts!"}) : pong(res, 200, contacts) 
    });
  });  
  
  app.get("/contact/:id", function(req, res) {
    debug('Getting contact for...');
    debug(req.params.id);

    app.db.findContactById(req.params.id, function(err, contact) {
      err ? pong(res, 500, {"result": "Unable to find contact!"}) : pong(res, 200, contact) 
    });
  });
  
  app.delete("/contact/:id", function(req, res) {
    debug('Deleting contact...');
    app.db.deleteContact(req.params.id, function (err, result) {
      err ? pong(res, 500, {"result": "Unable to delete contact!"}) : pong(res, 200, result) 
    });
  });  

  app.get("/groups", function(req, res) {
    debug('Getting all groups...');
    app.db.findAllGroups(function(err, contacts) {
      err ? pong(res, 500, {"result": "Unable to add contact!"}) : pong(res, 200, contacts) 
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