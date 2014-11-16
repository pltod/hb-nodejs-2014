var debug = require('debug')('scraper-service');
var $ = require('cheerio');
var request = require('request');
var url = require('url');
var robots = require('robots');
var parser = new robots.RobotsParser();


module.exports = function(url) {
  var url = url;
  var links = [];
  
  function resultHandler(err, result) {
    links = links.concat(result);
    if (links.length >= 500) {
      callback(null, links.slice(0, 499));
    } else {
      setImmediate(loop, links, resultHandler)
    }
  }
  
  return {
    scrape: function(callback) {
      loop([url], resultHandler);
    }
  }
}

function loop(urls, callback) {
  var links = [];
  var expectedResults = urls.length;
  var finishedResults = 0;
  urls.forEach(function (url) {
    
    isAllowedUrl(url, function (err, allowed) {
      if (allowed) {
        request(url, function(err, resp, body) {
          if (err) {
            return console.error(err)
          }

          var html = $.load(body);
          

          html('a').map(function(i, link) {
            var href = $(link).attr('href');
              
            debug(href);  
            links.push(href);
          })
      
          if (++finishedResults === expectedResults) {
            callback(null, links)
          }
        })        
      }
    })

  })
  
}

function isAllowedUrl(url, callback) {
  // todo make the url dynamic
  parser.setUrl('http://www.google.com/robots.txt', function(parser, success) {
    if(success) {
      debug('success')
      parser.canFetch('*', url, function (access) {
        if (access) {
          debug('access')
          callback(null, true)
        } else {
          callback(null, false)
        }
      });
    }
  });  
}

function isUrlAllowed(source, destination) {
  var host = url.parse(source).host;
  var host1 = url.parse(destination).host;
  return ((host.indexOf(host1) !== -1) || (host1.indexOf(host) !== -1))
}



