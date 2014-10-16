# Lessons Learned

* javascript language specifics

* JavaScript Scoping

> function expressions name leakage and possibility for recursion using the function expression name

* IIFE

* node basics and installation

* Command line debugger vs. node-inspector

* modules

> directory with index.js

> directory with package.json and main property inside it to locate the file

> exports vs. module.exports


* http, https, and fs modules

* http create server method

> The memory between each request remains. For example if we have counter it will increase with each request.

* reading and writing files with sync and async functions

* conversion from ini to json and vice versa with JSON stringify and parse

* how to install node modules as terminal utilities

> script specified in bin property in package.json

> npm link to make an alias

* npm unlink does not work as expected, namely the opposite of npm link

> see the issue in detail https://github.com/npm/npm/issues/4005

> use ```npm r [module] -g``` instead



