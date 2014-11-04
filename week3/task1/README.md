**WIP**



# TASKS


## Component 1 - Util

* graph.js - the graph utils with 3 methods

* test.js - testing the graph logic

## Component 1.1 - Test Util

* Mocha + Chai

## Component 2 - Graph Builder

* social service that builds the graph. Methods:

**following** - returns a list with the usersnames of everyone the user follows
**isFollowing** - accepts a username and returns true/false if the main user follows the one specified by the argument
**stepsTo** - accepts a username and return the number of hops needed to ge to that user following the following(pun not quite intended) relation


## Component 3 - Server

POST /createGraphFor

GET /graph/{graphId} 

GET /mutually_follow/{graphId}/{username}


## Component 4 - Github API Connector

* https://developer.github.com/v3/

## Component 5 - Graph Storage

* Store in DB - neo4j ???



**TODO: TESTING ALL LAYERS**

http://blog.abcedmindedness.com/2014/10/getting-started-with-hapijs-and-testing.html - could be used for server testing




