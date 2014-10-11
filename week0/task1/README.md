# Task Specification

Writing converter from ini to json and vice versa that can work with local and remote files.

Task specification:

> https://github.com/HackBulgaria/NodeJS-1/blob/master/week0/1-ini-parsing/README.markdown


# Solution


## Approach

TODO: Brief explanation of the solution

## How to Run It

Two ways:

* In task 1 folder write

> ```converter.js [file location]```

or 

* Register converter as terminal command with ```npm link``` and run it from any location with:

> ```converter [file location]```


## Lessons Learned

* http and https modules

* fs module

* how to install node modules as terminal utilities

> script specified in bin property in package.json

> npm link to make an alias

* npm unlink does not work as expected, namely the opposite of npm link

> see the issue in detail https://github.com/npm/npm/issues/4005

> use ```npm r [module] -g``` instead