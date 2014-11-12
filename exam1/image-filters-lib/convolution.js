// Works with manual event loop management

var debug = require('debug')('convolution');
var _ = require('lodash');
var Promise = require('bluebird');
var edgeDetectionKernel = [
  [-1, -1, -1],
  [-1, 8, -1],
  [-1, -1, -1]
];
var boxBlurKernel = [
  [1, 1, 1],
  [1, 1, 1],
  [1, 1, 1]
];

module.exports = function(imageData, kernel) {

  if (!imageData) {
    console.log('Please specify image!')
    return;
  }
  
  var channel = {
    alpha: imageData,
    red: imageData.red,
    green: imageData.green,
    blue: imageData.blue
  };
  var imageWidth = imageData.red ? imageData.red[0].length : imageData[0].length;
  var imageHeight = imageData.red ? imageData.red.length : imageData.length;
  var kernel = setKernel(kernel);

  return {
    // Holds the methods for manipulating monochrome images
    monochrome: {
      /**
       * Applies edge detection to an image.
       *
       * @param {Array} imageData Array-of-Arrays that represents the image
       * @returns Returns a promise object that will be resolved once the image processing has finished.
       * @type Object
       */
      edgeDetection: function() {
        kernel = setKernel(edgeDetectionKernel);
        debug(kernel);
        debug(channel);
        debug(imageWidth);                
        return processImage('alpha');
      },

      /**
       * Applies box blur to an image.
       *
       * @param {Array} imageData Array-of-Arrays that represents the image
       * @returns Returns a promise object that will be resolved once the image processing has finished.
       * @type Object
       */
      boxBlur: function(imageData) {
        return new Promise(function(resolve, reject) {
          setTimeout(function() {
            var e = new TypeError('wow');
            reject(e);
          }, 1000)
        });
      },

      /**
       * Applies kernel to an image.
       *
       * @param {Array} imageData Array-of-Arrays that represents the image
       * @param {Array} kernel Array-of-Arrays that represents the kernel used for image convolution
       * @returns Returns a promise object that will be resolved once the kernel has been applied to the image.
       * @type Object
       */
      applyKernel: function() {
        return processImage('alpha');
      }
    },

    // Holds the methods for manipulating rgb images  
    rgb: {

      /**
       * Applies edge detection to an image.
       *
       * @param {Array} imageData Array-of-Arrays that represents the image
       * @returns Returns a promise object that will be resolved once the image processing has finished.
       * @type Object
       */
      edgeDetection: function() {
        kernel = setKernel(edgeDetectionKernel);
        var channels = _.map(["red", "green", "blue"], processImage);
        return Promise.all(channels).then(function(image) {
          return image;
        }).
        catch (function(err) {
          console.log(err)
        });
      },

      /**
       * Applies kernel to an image.
       *
       * @param {Array} imageData Array-of-Arrays that represents the image
       * @returns Returns a promise object that will be resolved once the image processing has finished.
       * @type Object
       */
      boxBlur: function(imageData) {
        return new Promise(function(resolve, reject) {
          setTimeout(function() {
            resolve("processed image");
          }, 1000)
        });
      },

      /**
       * Applies kernel to an image.
       *
       * @param {Array} imageData Array-of-Arrays that represents the image
       * @param {Array} kernel Array-of-Arrays that represents the kernel used for image convolution
       * @returns Returns a promise object that will be resolved once the kernel has been applied to the image.
       * @type Object
       */
      applyKernel: function() {
        var channels = _.map(["red", "green", "blue"], processImage);
        return Promise.all(channels).then(function(image) {
          return image;
        }).
        catch (function(err) {
          console.log(err)
        });
      }
    }
  }

  function processImage(ch) {
    return new Promise(function(resolve, reject) {
      debug('Image Promise...')
      var image = [];
      _(channel[ch]).forEach(function(row, vIndex) {
        debug('Process row: ' + vIndex);
        setImmediate(function() {
          processRow(ch, row, vIndex)
            .then(function(row) {
              debug('Promise executed: ' + row)
              image.push(row);
              (image.length === imageHeight) && resolve(image);
            })
            .
          catch (function(e) {
            reject(e)
          })

        }, 0)
        debug('Row promise send to callback queue');
      });
    })
  }

  function processRow(ch, row, vIndex) {
    return new Promise(function(resolve, reject) {
      debug('Promise 2...')
      var outputRow = [];
      _(row).forEach(function(pixel, hIndex) {
        debug('Process item: ' + hIndex);
        outputRow.push(processItem(ch, vIndex, hIndex));
        (outputRow.length === imageWidth) && resolve(outputRow);
      })
    })
  }

  function processItem(ch, vIndex, hIndex) {
    var sum = 0;
    _(kernel.range).forEach(function(vOffset) {
      _(kernel.range).forEach(function(hOffset) {
        var v = vIndex + vOffset;
        var h = hIndex + hOffset;
        if (inTheZone(v, h)) {
          sum = sum + (channel[ch][v][h] * kernel.data[vOffset + kernel.center][hOffset + kernel.center]);
        }
      })
    })
    return sum;
  }

  function inTheZone(v, h) {
    return (imageHeight > v) && (v >= 0) && (imageWidth > h) && (h >= 0);
  }

  function setKernel(k) {
    var center;
    if (!k) {
      return null;
    } else {
      center = Math.floor(k.length / 2);
      return {
        data: k,
        center: center,
        range: _.range(-center, center + 1)
      }
    }
  }

}
