# Task Summary

Twitter like service for sending micro messages.

Full specification:

> https://github.com/HackBulgaria/NodeJS-1/tree/master/week0/2-Chirper



# How to Run the Solution

* npm i

* npm start (or npm run start-dev to see verbose output)

* in client dir run node chirp_client -h to see its usage

> use DEBUG=* node chirp-client [COMMAND] for verbose output


# Architecture Notes

* db layer is designed as separate module. It has test suite that can be runned as follows:

> go in db folder and run ```npm i```

> run ```npm test```


* Connection logic to server is encapsulated inside client/client-api-connector.js

> in such way it is reused in command line program and in a test suite

