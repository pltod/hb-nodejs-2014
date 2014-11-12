# Task Summary

Library for image processing with convolution.

Full specification:

> https://github.com/HackBulgaria/NodeJS-1/tree/master/exam1/2-Image-Filters-library


# How to Use It

```
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

convolution(xMarksTheSpot)
  .monochrome
  .applyKernel(verticalBlur)
  .then(function(outputImage) {
    console.log(outputImage)
  })
  .catch (function(e) {
    console.log(e)
  });
  
```

# How to Run the Tests

* ```npm i```

* ```npm test```


# Architecture Notes

* From performance point of view:

> Lodash is used for the loops and Bluebird is used for the promises

> Each row of the input image is scheduled for the next event loop to not block the execution for too long

* Additional optimization could be made:

> using typed array Uint8ClampedArray 

> or nodejs libraries like ndarray (https://www.npmjs.org/package/ndarray)