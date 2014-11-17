NodeJS/JavaScript coding 24x7 in [my](https://twitter.com/pltod) [@HackBulgaria](https://twitter.com/hackbulgaria) experience.


**Table of Contents**

- [Applications](#applications)
- [Reusable Components](#reusable-components)
- [Repository Scaffolding](#repository-scaffolding)
- [License](#license)


# Applications

The list with created applications and used techniques and technologies.

**[Beers and Fries](https://github.com/pltod/hb-nodejs-2014-one)**

* Algorithm for finding best combination of beer and fries

> functional programming with underscore, recursion

**[Web Application for Drawing Triangles on HTML5 Canvas (Source)](https://github.com/pltod/hb-nodejs-2014-two)**

* Draw triangles on HTML5 Canvas, save them in localstorage, and open saved drawings. 

* [Demo](http://pltod.github.io/blog/demos/canvas/) - works in Firefox and Chrome with JavaScript experimental features turned on

> Canvas, Color Picker, Content Editable, Local Storage, JavaScript Generators, CommonJS Modules, Browserify, CSP channels for Javascript


**[Mocha Test Suite for REST Express App](https://github.com/pltod/hb-nodejs-2014-three)**

* Test suite for testing REST API exposed as express web application

> Mocha, Chai, Request, Express etc.

**[ini to JSON and JSON to ini conversion service](https://github.com/pltod/hb-nodejs-2014/tree/master/week0/task1)**

**[Twitter like service for registering messages per users powered by Express](https://github.com/pltod/hb-nodejs-2014/tree/master/week0/task2)**

**[Newsletter and statistic services using HN Firebase API with Express and Nodemailer](https://github.com/pltod/hb-nodejs-2014/tree/master/week1/task2)**


**[NodeJS command line utility for MongoDB Simple Management](https://github.com/pltod/lab-mongodb/mdb)**

* Could be registered with npm link and used for starting mongodb in any directory, as well as collection/db initialisation/reinitialisation with data stored in JSON. Use convention over configuration to work with predefined default paths and file names. Still give possibility to be configured.

> Using nodejs modules child_process, util, path, fs. Minimist for parsing user options. Async for control flow. MongoDB commands like mongod, mongoimport etc.


**[Serve statistical data stored in MongoDB and visualise it in web browser](https://github.com/pltod/hb-nodejs-2014/tree/master/week2/task2)**


**[Geolocation services - saving locations and finding locations - with MongoDB and Express](https://github.com/pltod/hb-nodejs-2014/tree/master/week2/task3)**


**[Github API based service for building graphs for tracking following relationships](https://github.com/pltod/hb-nodejs-2014/tree/master/week3/task1)**

* Github API based service that generate graphs with particular depth, for particular user for tracking following relationship - who follows you back etc.

> express, body-parser, underscore, async, github api consumed with octonode

**[REST API for code snippet management](https://github.com/pltod/hb-nodejs-2014/tree/master/week4/task1)**


**[Smart Phonebook App](https://github.com/pltod/hb-nodejs-2014/tree/master/exam1/smart-phonebook)**

* Contact management plus posibility to create groups automatically based on similarity find in contact names.

> mongodb, express, async

**[Library for Image Processing With Convolution](https://github.com/pltod/hb-nodejs-2014/tree/master/exam1/image-filters-lib)**

* The library supports box blur and edge detection as well as applying custom kernel

> Build with bluebird promise library and lodash. Possibility to adopt ndarray in the future.


**[Site Mapper Service](https://github.com/pltod/hb-nodejs-2014/tree/master/exam1/site-mapper)**

* Creates site map based on given URL. Keeps first 500 links found in MongoDB database. Respects robots.txt rules for each site.

> mongodb, express, async

# Reusable Components

During the development of these applications a set of shared modules have been created. The folder named "shared" holds all these modules.

**In order to prevent separate ```npm i``` in different subfolders of this repo one could do ```npm i``` in this root folder. In this way we also esnure that all modules will be available while runing particular app.**


# Repository Scaffolding

The repo structure is as follows:

* weekX folder

> contains all the solutions to week tasks

* weekX/taskX

> contains the specific task solution

* weekX/taskX/README.md

> contains information about the task, how to run it, and architecture decisions

* weekX/README.md

> contains list with techs and lessons learned during the week



# License

MIT [@pltod](https://twitter.com/pltod)