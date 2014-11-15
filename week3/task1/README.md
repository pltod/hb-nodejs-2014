**STATE**

[![unstable](http://badges.github.io/stability-badges/dist/unstable.svg)](http://github.com/badges/stability-badges)


# Task Summary

Github API based service that:

* generate graphs with particular depth

* for particular user 

* for tracking following relationship - who follows who


Full specification:

> https://github.com/HackBulgaria/NodeJS-1/tree/master/week3/1-Who-Follows-You-Back


# How to Run the Solution

* put your github access token in config.js

* npm start (or npm run start-dev to see verbose output)

* in test dir run 

> ```curl -H "Content-Type: application/json" --data @graphFor.json http://localhost:8000/createGraphFor```

* in the browser

> http://localhost:8000/graphs - show all generated graphs info

> http://localhost:8000/graph/:graphId - shows the graph data

> http://localhost:8000/mutually_follow/:graphId/:username - shows relationship between graph owner and username - first, second, mutual, none etc.

# How to Run the Tests

* npm run graph-model

> Test suite for the graph model made with Mocha and Chai

* npm run graph-generator

> Test suite for graph generation with sequence and parallel algorithm. Made with tape to leverage async by default test capabilities. Works with mock data.


# Architecture Notes

* the application can be configured to work with mock data

* the application can be run in two modes:

> regenerate already generated graphs

> generate only if not generated until now

* data is not persistent, it is lost after server restart

* all app components relates as follows

![](https://github.com/pltod/hb-nodejs-2014/blob/master/week3/task1/img/architecture.jpg)