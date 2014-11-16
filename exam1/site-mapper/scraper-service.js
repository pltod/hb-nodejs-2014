var debug = require('debug')('scraper-service');
var async = require('async');
var _ = require('lodash');
var $ = require('cheerio');
var request = require('request');
var urlParser = require('url');
var robots = require('robots');
var parser = new robots.RobotsParser();

module.exports = function(url) {
  var rootUrl = url;
  var robotsFile = rootUrl + '/robots.txt'; 
  var allLinks = [];
  var robotParser = null;
  var totalNumberOfLinks = 500;
  var rootUrlMeta = urlParser.parse(rootUrl);
  
    
  return {
    scrape: function(callback) {
      initRobotsParser(function (err, parser) {
        robotParser = parser;
        fetch(rootUrl, resultHandler);
      })
      
      function resultHandler(err, result) {
        allLinks = allLinks.concat(result);
        debug('TOTAL LINKS AFTER THIS ROUND: ' + allLinks.length);
        
        if (allLinks.length < totalNumberOfLinks) {
          //schedule fetching for the next event loop
          setImmediate(loop, robotParser, _.cloneDeep(allLinks), resultHandler)
        } else {
          callback(null, allLinks.slice(0, totalNumberOfLinks));
        }
      }
    }
  }
  
  function initRobotsParser(callback) {
    parser.setUrl(robotsFile, function(parser, success) {
      if(success) {
        callback(null, parser);
      } else {
        callback("Robots NOT OK", null);
      }
    })  
  }

  function loop(parser, urls, callback) {
    var links = [];
    async.whilst (
      function () { 
        return ((urls.length !== 0) && ((links.length + allLinks.length) < totalNumberOfLinks)) 
      },
      function (done) {
        var url = urls.shift();

        if (parser) {
          parser.canFetch('*', url, function (access) {
            if (access) {
              //startFetching(url, done)
              fetch(url, function (err, result) {
                if (err) {
                  console.log(err);
                } else {
                  links = links.concat(result);
                }
                done();
              })
            } else {
              done();
            }
          })
        } else {
          //startFetching(url, done)
          fetch(url, function (err, result) {
            if (err) {
              console.log(err);
            } else {
              links = links.concat(result);
            }
            done();
          });
        }
      },
      function (err) {
        callback(err, links);
      }
    )
  }

  // Fetch the URLs refered by particular URL
  function fetch(url, callback) {
    debug('Fetch url: ' + url);
    var links = [];
    request(url, function(err, resp, body) {
      if (err) {
        return console.error(err)
      }

      var html = $.load(body);
  
      html('a').map(function(index, link) {
        var fixedLink;
        var link = $(link).attr('href');
        if (link) {
          fixedLink = fixLink(url, link)
          if (validLink(fixedLink)) {
            links.push(fixedLink);
          }
        }
      })
      callback(null, links);
    })        
  }


  // Adds the initial url if it is missing in the link
  function fixLink(source, url) {
    return urlParser.parse(url).protocol ? url : source.slice(0, source.length-1) + url;
  }

  // Check for domain restrictions - don't crawl out of the domain rule
  function validLink(url) {
    var host, host1, urlMeta;
    if (rootUrl === url || rootUrl+'#' === url || rootUrl.slice(0, rootUrl.length-1)+'#' === url) {
      return false;
    }

    if (url) {
      urlMeta = urlParser.parse(url);
      if (urlMeta.protocol === 'javascript:') {
        return false
      } else {
        return ((rootUrlMeta.host.indexOf(urlMeta.host) !== -1) || (urlMeta.host.indexOf(rootUrlMeta.host) !== -1)); 
      }
    } else {
      return false;
    }
  }

}


