register, chirp create and read all are tested with curl

* TODO

> stringify all the response

> parse the payload to get the params and pass them to DB layer

> manage all exceptions where needed

> make a router with all the paths


* Example router: https://gist.github.com/RadoRado/affde79b108b0b909a5e


* try tape deep equal for testing task1

* http://smalljs.org/logging/debug/ -> very good debug module explanation

* see node-inspector help for making converter help

* update lab-nodejs modules to reflect the new test case exports === module.exports

* use pattern to add the support of http methods to simulate express like server

> db api - DONE

> app api -> application logic

> middleware api -> this is the express like stuff

> server core + 'use' pattern to include the APIs - bare bone server that weaves db, middlware, app

> client core (which is API as well)

> 1) client test and 2) client cmd that both use client core

