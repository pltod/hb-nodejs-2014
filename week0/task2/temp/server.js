/* global module, console */

module.exports = function(http, port) {
  'use strict';
  var routes = {};
  var exportMethods = {};
  var middlewares = [];

  ['get', 'post', 'put', 'delete'].forEach(function(method) {
    routes[method] = routes[method] || {};
    exportMethods[method] = (function(method) {
      return function(url, callback) {
        return route(method, url, callback);
      };
    }(method));
  });

  var server = http.createServer(function(req, res) {
    
    console.log(routes);
    console.log(middlewares);    
    var requestedUrl = req.url;
    var requestedMethod = req.method.toLowerCase();
    var routeHandler = routes[requestedMethod];

    if(!routeHandler) {
      throw new Error('Cannot handle method: ' + requestedMethod);
    }

    var handled = false;
    Object.keys(routeHandler).forEach(function(url) {
        if(requestedUrl === url) {
          handled = true;
          routeHandler[url].forEach(function(callback) {
              invoke(req, res, callback);
          });
        }
      });
    if(!handled) {
      res.writeHead(404);
      res.end("Not found");
    }
  });


  function invoke(req, res, callback) {
    invokeMiddlewares(req, res, middlewares, callback);
  }

  function invokeMiddlewares(req, res, middlewares, callback) {
    var index = 0;
    function next() {
      if(index === middlewares.length) {
        callback(req, res);
      } else {
        console.log('Executing middleware ' + index);
        middlewares[index++](req, res, next);
      }
    }
    next();
  }

  function use (middleware) {
    middlewares.push(middleware);
  }

  function route(method, url, callback) {
    var routesForMethod = routes[method];
    if(!routesForMethod) {
      throw new Error('Cannot handle method: ' + method);
    }
    routesForMethod[url] = routesForMethod[url] || [];
    routesForMethod[url].push(callback);
  }

  exportMethods.listen = server.listen.bind(server);
  exportMethods.use = use;
  return exportMethods;
};