var debug = require('debug')('convolution');
var _ = require('lodash');
var Promise = require('bluebird');
var Timer = require('../../shared/util/timer');

module.exports = function(imageData) {
  
  var kernel = {}, image = {}, imageWidth, imageHeight;
  var edgeDetectionKernel = [[-1, -1, -1], [-1, 8, -1], [-1, -1, -1]];
  var boxBlurKernel = [[1, 1, 1], [1, 1, 1], [1, 1, 1]];
  
  return {
    
    // For manipulating monochrome images
    monochrome: function(imageData){
      if (!imageData) throw new Error('Missing monochrome image info!')
      image.alpha = imageData;
      imageWidth = imageData[0].length;
      imageHeight = imageData.length;
      
      return {
        /**
         * Applies edge detection to an image.
         *
         * @param {Array} imageData Array-of-Arrays that represents the image
         * @returns Returns a promise object that will be resolved once the image processing has finished.
         * @type Object
         */
        edgeDetection: function() {
          kernel = setKernel(edgeDetectionKernel, {});
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
          kernel = setKernel(boxBlurKernel, {boxBlur: true});
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
          if (!k) throw new Error ('Please specify kernel!');

          kernel = setKernel(k, {});        
          return processImage('alpha');
        }
      }
    },

    // For manipulating rgb images  
    rgb: function(imageData){
      
      if (!imageData.red && !imageData.blue && !imageData.green) throw new Error('Missing RGB info in provided image!');

      image = imageData
      imageWidth = imageData.red[0].length;
      imageHeight = imageData.red.length;      
      
      return {
        /**
         * Applies edge detection to an image.
         *
         * @returns Returns a promise object that will be resolved once the image processing has finished.
         * @type Object
         */
        edgeDetection: function() {
          kernel = setKernel(edgeDetectionKernel, {});
          return processMultipleImages(_.map(["red", "green", "blue"], processImage));
        },

        /**
         * Applies kernel to an image.
         *
         * @returns Returns a promise object that will be resolved once the image processing has finished.
         * @type Object
         */
        boxBlur: function() {
          kernel = setKernel(boxBlurKernel, {boxBlur: true});
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
          if (!k) throw new Error ('Please specify kernel!');

          kernel = setKernel(k, {});        
          return processMultipleImages(_.map(["red", "green", "blue"], processImage));
        }
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
      var img = [];
      _.each(image[ch], function(row, vIndex) {
        debug('Process row: ' + vIndex);
        setImmediate(function() {
          processRow(ch, row, vIndex)
            .then(function(row) {
              debug('Promise executed: ' + row)
              img.push(row);
              (img.length === imageHeight) && resolve(img);
            })
            .catch (function(e) {
              reject(e)
            })
        })
        debug('Row Promise send to callback queue');
      });
    })
  }

  // The execution is blocked for the duration of processing one row

  function processRow(ch, row, vIndex) {
    return new Promise(function(resolve, reject) {
      debug('Row Promise...')
      var myTimer = Timer('Row Timer').start();
      var outputRow = [];
      _.each(row, function(pixel, hIndex) {
        debug('Process cell: ' + hIndex);
        outputRow.push(processCell(ch, vIndex, hIndex));
        (outputRow.length === imageWidth) && resolve(outputRow);
      })
      myTimer.stop();
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
          debug(image[ch][v][h]);
          sum = sum + (image[ch][v][h] * kernel.data[vOffset + kernel.center][hOffset + kernel.center]);
        }
      })
    })
    return kernel.options.boxBlur ? sum / kernel.factor : sum;
  }

  // Checks if kernel cell with vertical and horizontal index has corresponding image cell.

  function inTheZone(v, h) {
    return (imageHeight > v) && (v >= 0) && (imageWidth > h) && (h >= 0);
  }

  // Sets the kernel. Used by all methods with predefined kernels.

  function setKernel(k, options) {
    var center = Math.floor(k.length / 2);
    var factor = k.length * k.length;
    return {
      data: k,
      center: center,
      range: _.range(-center, center + 1),
      factor: factor,
      options: options
    }
  }
  
}
