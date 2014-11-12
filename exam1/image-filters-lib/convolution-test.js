var convolution = require('./convolution');

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

var rgbSport = {
  red: xMarksTheSpot,
  green: xMarksTheSpot,
  blue: xMarksTheSpot
};

convolution(rgbSport, verticalBlur).rgb.applyKernel()
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
    console.log(e)
  });

convolution(rgbSport).rgb.edgeDetection()
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
    console.log(e)
  });

convolution(rgbSport).rgb.boxBlur()
  .then(function(outputImage) {
    console.log(outputImage)
  })
  .catch (function(e) {
    console.log(e)
  });

convolution(xMarksTheSpot).monochrome.boxBlur()
  .then(function(outputImage) {
    console.log(outputImage)
  })
  .catch (function(e) {
    console.log(e)
  });

