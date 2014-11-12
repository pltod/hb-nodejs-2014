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

module.exports = function(imageData) {

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
  var kernel;
  var imageWidth = imageData.red ? imageData.red[0].length : imageData[0].length;
  var imageHeight = imageData.red ? imageData.red.length : imageData.length;
  var boxBlur = false;

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
        return processImage('alpha');
      },

      /**
       * Applies box blur to an image.
       *
       * @param {Array} imageData Array-of-Arrays that represents the image
       * @returns Returns a promise object that will be resolved once the image processing has finished.
       * @type Object
       */
      boxBlur: function() {
        kernel = setKernel(boxBlurKernel);
        boxBlur = true;
        return processImage('alpha');
      },

      /**
       * Applies kernel to an image.
       *
       * @param {Array} k Array-of-Arrays that represents the kernel used for image convolution
       * @returns Returns a promise object that will be resolved once the kernel has been applied to the image.
       * @type Object
       */
      applyKernel: function(k) {
        if (!k) {
          console.log('Please specify kernel!')
          return;
        }
        kernel = setKernel(k);        
        return processImage('alpha');
      }
    },

    // Holds the methods for manipulating rgb images  
    rgb: {

      /**
       * Applies edge detection to an image.
       *
       * @returns Returns a promise object that will be resolved once the image processing has finished.
       * @type Object
       */
      edgeDetection: function() {
        kernel = setKernel(edgeDetectionKernel);
        return processMultipleImages(_.map(["red", "green", "blue"], processImage));
      },

      /**
       * Applies kernel to an image.
       *
       * @returns Returns a promise object that will be resolved once the image processing has finished.
       * @type Object
       */
      boxBlur: function() {
        kernel = setKernel(boxBlurKernel);
        boxBlur = true;
        return processMultipleImages(_.map(["red", "green", "blue"], processImage));
      },

      /**
       * Applies kernel to an image.
       *
       * @param {Array} kernel Array-of-Arrays that represents the kernel used for image convolution
       * @returns Returns a promise object that will be resolved once the kernel has been applied to the image.
       * @type Object
       */
      applyKernel: function(k) {
        if (!k) {
          console.log('Please specify kernel!')
          return;
        }
        kernel = setKernel(k);        
        return processMultipleImages(_.map(["red", "green", "blue"], processImage));
      }
    }
  }

  // Promise to handle several images preserving the order of the results

  function processMultipleImages(channels) {
    return Promise.all(channels)
      .then(function(image) {
        return image;
      })
      .catch (function(err) {
      console.log(err)
    });
  }

  // Promise to process the whole image
  // Non blocking method. Each row of the input image is put on the next event loop

  function processImage(ch) {
    return new Promise(function(resolve, reject) {
      debug('Image Promise...')
      var image = [];
      _.each(channel[ch], function(row, vIndex) {
        debug('Process row: ' + vIndex);
        setImmediate(function() {
          processRow(ch, row, vIndex)
            .then(function(row) {
              debug('Promise executed: ' + row)
              image.push(row);
              (image.length === imageHeight) && resolve(image);
            }).catch (function(e) {
            reject(e)
          })

        }, 0)
        debug('Row promise send to callback queue');
      });
    })
  }

  // The execution is blocked for the duration of processing one row

  function processRow(ch, row, vIndex) {
    return new Promise(function(resolve, reject) {
      debug('Row Promise...')
      var outputRow = [];
      _.each(row, function(pixel, hIndex) {
        debug('Process cell: ' + hIndex);
        outputRow.push(processCell(ch, vIndex, hIndex));
        (outputRow.length === imageWidth) && resolve(outputRow);
      })
    })
  }

  // Processing cell - calculate the sum that must be stored in the cell

  function processCell(ch, vIndex, hIndex) {
    var sum = 0;
    _.each(kernel.range, function(vOffset) {
      _.each(kernel.range, function(hOffset) {
        var v = vIndex + vOffset;
        var h = hIndex + hOffset;
        if (inTheZone(v, h)) {
          debug(channel[ch][v][h]);
          sum = sum + (channel[ch][v][h] * kernel.data[vOffset + kernel.center][hOffset + kernel.center]);
        }
      })
    })
    return boxBlur ? sum / kernel.factor : sum;
  }

  // Checks if kernel cell with vertical and horizontal index has corresponding image cell.

  function inTheZone(v, h) {
    return (imageHeight > v) && (v >= 0) && (imageWidth > h) && (h >= 0);
  }

  // Sets the kernel. Used by all methods with predefined kernels.

  function setKernel(k) {
    var center = Math.floor(k.length / 2);
    var factor = k.length * k.length;
    return {
      data: k,
      center: center,
      range: _.range(-center, center + 1),
      factor: factor
    }
  }

}
