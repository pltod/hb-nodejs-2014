**STATE**

[![unstable](http://badges.github.io/stability-badges/dist/unstable.svg)](http://github.com/badges/stability-badges)

# Task Summary

CRUD REST API for code snippets management

Full specification:

> https://github.com/HackBulgaria/NodeJS-1/tree/master/week4/1-Putting-It-All-Together


# How to Run the App

* npm i to install the modules

* start mongodb

* put database info in config.json 

* npm start (or npm run start-dev to see verbose output)

* see test/commands.txt for curl commands

* see api.js for available endpoints that can be runned in the browser


# How to Run the Tests

* install mocha globally

* npm test to run the test suite


# Architecture Notes

There are 3 modules:

* server - contains expressjs logic

* api - contains endpoints and handlers

* db - contains mongodb logic