# Task Summary

CRUD REST API for contact management

Full specification:

> https://github.com/HackBulgaria/NodeJS-1/tree/master/exam1/1-Smart-Phonebook


# How to Run the App

* npm i to install the modules

* start mongodb

* put database info in config.json 

* npm start (or npm run start-dev to see verbose output)

* see api.js for available endpoints that can be runned in the browser


# How to Run the Tests

* install mocha globally

* npm test to run the test suite


# Architecture Notes

There are 4 modules:

* server - contains expressjs logic

* api - contains endpoints and handlers

* db - contains mongodb logic

* groupManager - handles group creation logic