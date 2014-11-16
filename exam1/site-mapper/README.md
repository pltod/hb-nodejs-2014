**STATE**

[![stable](http://badges.github.io/stability-badges/dist/stable.svg)](http://github.com/badges/stability-badges)


# Task Summary

HTTP API for creating site maps and store them in MongoDB database.

Full specification:

> https://github.com/HackBulgaria/NodeJS-1/tree/master/exams/exam1/3-Site-Mapper


# How to Run the App

* npm i to install the modules

* start mongodb

* put database info in config.json 

* npm start (or npm run start-dev to see verbose output)

* see api.js for available endpoints that can be runned in the browser or via curl


# Architecture Notes

There are 4 modules:

* server - contains expressjs logic

* api - contains endpoints and handlers

* db - contains mongodb logic

* scraper-service - handles scraping logic