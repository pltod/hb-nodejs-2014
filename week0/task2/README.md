# Task Summary

Twitter like service for sending micro messages.

Full specification:

> https://github.com/HackBulgaria/NodeJS-1/tree/master/week0/2-Chirper


# How to Run

* npm i

> to install dependencies

> make sure that deps for the shared modules are also installed in the very root folder of this repo


## Server

* npm start (or npm run start-dev to see verbose output)


## Client

* ```node chirp_client -h``` to see cli app usage


# How to Test

* ```npm run db-test```

> runs db test suite which is in db-test.js



# Architecture Notes

There are 3 modules:

* server

> contains http server logic


* db

> stores data in memory


* chirp_client

> cli app for interacting with the chirp server