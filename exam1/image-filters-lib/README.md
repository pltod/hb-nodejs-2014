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

convolution()
  .monochrome(xMarksTheSpot)
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

* Considering the performance aspect:

> Lodash is used for loop statements

> Bluebird is used for constructing Promises

> Each row of the input image is scheduled for the next event loop. In this way the program is only blocked for the duration of each row calculations.

* Additional optimization could be made:

> Using typed array Uint8ClampedArray 

> Or nodejs libraries like ndarray (https://www.npmjs.org/package/ndarray)