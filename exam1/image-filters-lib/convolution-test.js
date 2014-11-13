var convolution = require('./convolution');
var test = require('tape');
var Timer = require('../../shared/util/timer');
var imageData = getImageData();

test('### Test Monochrome Edge Detection ###', function(t) {
  convolution()
    .monochrome(imageData.xMarksTheSpot)
    .edgeDetection()
    .then(function(outputImage) {
      t.deepEqual(outputImage, imageData.expectedResults.monochromeEdge, 'monochrome image with edge detection generated successfully');
      t.end();
    });
});

test('### Test Monochrome Box Blur ###', function(t) {
  convolution()
    .monochrome(imageData.xMarksTheSpot)
    .boxBlur()
    .then(function(outputImage) {
      t.deepEqual(outputImage, imageData.expectedResults.monochromeBlur, 'monochrome image with box blur generated successfully');
      t.end();
    });
});

test('### Test Monochrome Custom Kernel ###', function(t) {
  convolution()
    .monochrome(imageData.xMarksTheSpot)
    .applyKernel(imageData.verticalBlur)
    .then(function(outputImage) {
      t.deepEqual(outputImage, imageData.expectedResults.monochromeKernel, 'monochrome image with custom kernel generated successfully');
      t.end();
    });
});

test('### Test RGB Edge Detection ###', function(t) {
  convolution()
    .rgb(imageData.rgbImage)
    .edgeDetection()
    .then(function(outputImage) {
      t.deepEqual(outputImage, imageData.expectedResults.rgbEdge, 'monochrome image with edge detection generated successfully');
      t.end();
    });
});

test('### Test RGB Box Blur ###', function(t) {
  convolution()
    .rgb(imageData.rgbImage)
    .boxBlur()
    .then(function(outputImage) {
      t.deepEqual(outputImage, imageData.expectedResults.rgbBlur, 'monochrome image with box blur generated successfully');
      t.end();
    });
});

test('### Test RGB Custom Kernel ###', function(t) {
  convolution()
    .rgb(imageData.rgbImage)
    .applyKernel(imageData.verticalBlur)
    .then(function(outputImage) {
      t.deepEqual(outputImage, imageData.expectedResults.rgbKernel, 'monochrome image with custom kernel generated successfully');
      t.end();
    });
});


test('### Very Large Image ###', function(t) {
  var myTimer = Timer('Whole Image Timer').start();
  convolution()
    .rgb(imageData.largeRGBImage)
    .applyKernel(imageData.largeKernel)
    .then(function(outputImage) {
      myTimer.stop();
      t.ok(outputImage, 'Effect on very large image done');
      t.end();
    });
});


function getImageData() {
  return {
    xMarksTheSpot: [
      [1, 0, 1],
      [0, 1, 0],
      [1, 0, 1]
    ],
    verticalBlur: [
      [0, 0.5, 0],
      [0, 0, 0],
      [0, 1, 0]
    ],
    rgbImage: {
      red: [[1, 0, 1],[0, 1, 0],[1, 0, 1]],
      green: [[1, 0, 1],[0, 1, 0],[1, 0, 1]],
      blue: [[1, 0, 1],[0, 1, 0],[1, 0, 1]]
    },
    expectedResults: {
      monochromeEdge: [
        [7, -3, 7],
        [-3, 4, -3],
        [7, -3, 7]
      ],
      monochromeBlur: [
        [0.2222222222222222, 0.3333333333333333, 0.2222222222222222],
        [0.3333333333333333, 0.5555555555555556, 0.3333333333333333],
        [0.2222222222222222, 0.3333333333333333, 0.2222222222222222]
      ],
      monochromeKernel: [
        [0, 1, 0],
        [1.5, 0, 1.5],
        [0, 0.5, 0]
      ],
      rgbEdge: [
        [
          [7, -3, 7],
          [-3, 4, -3],
          [7, -3, 7]
        ],
        [
          [7, -3, 7],
          [-3, 4, -3],
          [7, -3, 7]
        ],
        [
          [7, -3, 7],
          [-3, 4, -3],
          [7, -3, 7]
        ]
      ],
      rgbBlur: [
        [
          [0.2222222222222222, 0.3333333333333333, 0.2222222222222222],
          [0.3333333333333333, 0.5555555555555556, 0.3333333333333333],
          [0.2222222222222222, 0.3333333333333333, 0.2222222222222222]
        ],
        [
          [0.2222222222222222, 0.3333333333333333, 0.2222222222222222],
          [0.3333333333333333, 0.5555555555555556, 0.3333333333333333],
          [0.2222222222222222, 0.3333333333333333, 0.2222222222222222]
        ],
        [
          [0.2222222222222222, 0.3333333333333333, 0.2222222222222222],
          [0.3333333333333333, 0.5555555555555556, 0.3333333333333333],
          [0.2222222222222222, 0.3333333333333333, 0.2222222222222222]
        ]
      ],
      rgbKernel: [
        [
          [0, 1, 0],
          [1.5, 0, 1.5],
          [0, 0.5, 0]
        ],
        [
          [0, 1, 0],
          [1.5, 0, 1.5],
          [0, 0.5, 0]
        ],
        [
          [0, 1, 0],
          [1.5, 0, 1.5],
          [0, 0.5, 0]
        ]
      ]
    },
  
    largeRGBImage: {
      red: largeImage(),
      green: largeImage(),
      blue: largeImage()
    },
    
    largeKernel: largeKernel()
  }

  function largeImage() {
    var image = [];
    var row = [];
    for(var i = 0; i<256; i++) {
      for(var j = 0; j<256; j++) {
        row.push(j);
      }
      image.push(row);
      row = [];
    }
    
    return image;
  }
  
  function largeKernel() {
    var kernel = [];
    var row = [];
    for(var i = 0; i<11; i++) {
      for(var j = 0; j<11; j++) {
        row.push(j);
      }
      kernel.push(row);
      row = [];
    }
    
    return kernel;
  }  

}
