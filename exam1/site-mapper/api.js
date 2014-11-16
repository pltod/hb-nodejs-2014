var debug = require('debug')('sitemapper-app-api');
var _ = require('lodash');

module.exports = function (app) {

  app.post("/map", function(req, res) {
    debug('Sitemap generation request...');

    app.db.saveSitemap(req.body.ur, function(err, result) {
      debug(err)
      debug(result)
      err ? pong(res, 500, {"result": "Unable to find contacts!"}) : pong(res, 200, result._id) 
    })
  });

  app.get("/sitemap", function(req, res) {
    debug('Getting sitemap with id...');
    debug(req.body.id);

    app.db.findSitemap(req.body.id, function(err, result) {
      err ? pong(res, 500, {"result": "Unable to find sitemap!"}) : pong(res, 200, result) 
    });
  });  
  
  app.get("/listSitemaps", function(req, res) {
    debug('Getting sitemap with id...');
    app.db.findAllSitemaps(function(err, result) {
      err ? pong(res, 500, {"result": "Unable to find contacts!"}) : pong(res, 200, result)
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