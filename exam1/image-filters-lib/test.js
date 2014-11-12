var convolution = require('./convolution');

var image = [
  [1, 2, 3, 4, 5],
  [6, 7, 8, 9, 10],
  [11, 12, 13, 14, 15],
  [16, 17, 18, 19, 20],
  [21, 22, 23, 24, 25]
];
var kernel = [
  [1, 2, 3, 4, 5],
  [6, 7, 8, 9, 10],
  [11, 12, 13, 14, 15],
  [16, 17, 18, 19, 20],
  [21, 22, 23, 24, 25]
];

var xMarksTheSpot = [
  [1, 0, 1],
  [0, 1, 0],
  [1, 0, 1]
];
var verticalBlur = [
  [0, 0.5, 0],
  [0, 0, 0],
  [0, 1, 0]
];
var rbgSport = {
  red: xMarksTheSpot,
  green: xMarksTheSpot,
  blue: xMarksTheSpot
};



convolution(rbgSport, verticalBlur).rgb.applyKernel()
  .then(function(outputImage) {
    console.log(outputImage)
  })
  .catch (function(e) {
  console.log(e)
});

convolution(xMarksTheSpot, verticalBlur).monochrome.applyKernel()
  .then(function(outputImage) {
    console.log(outputImage)
  })
  .catch (function(e) {
  //console.log(e)
  throw e;
});

convolution(rbgSport).rgb.edgeDetection()
  .then(function(outputImage) {
    console.log(outputImage)
  })
  .catch (function(e) {
  console.log(e)
});

convolution(xMarksTheSpot).monochrome.edgeDetection()
  .then(function(outputImage) {
    console.log(outputImage)
  })
  .catch (function(e) {
  //console.log(e)
  throw e;
});
