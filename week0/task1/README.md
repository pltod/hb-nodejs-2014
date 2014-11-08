# Task Summary

Writing converter from ini to json and vice versa that can work with local and remote files.

Task specification:

> https://github.com/HackBulgaria/NodeJS-1/blob/master/week0/1-ini-parsing/README.markdown


# How To Run

* npm i 

> to install dependencies


* ```node parse -h```

> to see how to use the app


## How To Test

* npm test

> runs original test suite - creates files in the root folder parsing files from test-files directory


* ```npm run {command}```

> see package.json script property for available commands that execute different use cases


# Architecture Notes

* separate shared modules are used for each reusable function 

* having some special symbols like '.' and '/' in the file names is not supported




