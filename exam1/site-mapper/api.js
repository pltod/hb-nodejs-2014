var debug = require('debug')('sitemapper-app-api');
var _ = require('lodash');
var service = require('./scraper-service');

module.exports = function (app) {

  app.post("/map", function(req, res) {
    debug('Sitemap generation request...');
    var url = req.body.url;
    var id;
    
    app.db.findSitemapByUrl(url, function (err, result) {
      if (result) {
        debug('SITEMAP FOR ' + url + ' ALREADY EXISTS');        
        err ? pong(res, 500, {"result": "Unable to find sitemap!"}) : pong(res, 200, result._id)
      } else {
        app.db.saveSitemap(url, function(err, result) {
          id = result[0]._id;
          debug(result)
          debug('ABOUT TO GENERATE SITEMAP FOR ' + url);
          setImmediate(function () {
            service(url).scrape(function (err, result) {
              app.db.updateSitemap(id, url, result, function (err, result) {
                if (err) {
                  console.log(err)
                } else {
                  console.log("SITEMAP FOR " + url + " WITH ID " + id + " HAS BEEN GENERATED");
                }
              });
            })      
          })
        })
      }
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
      err ? pong(res, 500, {"result": "Unable to find sitemaps!"}) : pong(res, 200, result)
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