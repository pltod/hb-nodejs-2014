# Task Summary

Github API based service for tracking following relationship.

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

* the application can be configured to work with mock data and to regenerate graph creation or return already generated

* data is not persistent. It is lost after server restart.

* diagram with all components

![](https://github.com/pltod/hb-nodejs-2014/blob/master/img/architecture.jpg)