# Task Summary

Writing converter from ini to json and vice versa that can work with local and remote files.

Task specification:

> https://github.com/HackBulgaria/NodeJS-1/blob/master/week0/1-ini-parsing/README.markdown


# How To Run

* npm i 

> to install dependencies

* npm test 

> to run original test suite - creates files in the root folder parsing files from test-files directory


## More Info

* ```node parse -h```

> to see the app help

* ```npm run {command}```

> see package.json script property for available commands that execute different app cases


# Architecture Notes

* separate shared modules are used for each reusable function 

* having some special symbols like '.' and '/' in the file names is not supported




