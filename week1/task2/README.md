# Task Summary

Newsletter service using HN Firebase API with Express and Nodemailer.

Full specification:

> https://github.com/HackBulgaria/NodeJS-1/tree/master/week1/1-hackernews-scraper


Hacker News Firebase API:

> https://github.com/HackerNews/API  


# How to Run the Solution

* clone the repo

* ```npm i``` to install dependencies


## Subscriber Module

* ```npm run subscriber``` to start subscriber service

when server is started go to test folder and do

> adding subscriptions with: curl -H "Content-Type: application/json" --data @subscribe.json http://localhost:8000/subscribe . The data will be persisted in persist/subscribers.json

> removing subscriptions with: curl -H "Content-Type: application/json" --data @unsubscribe.json http://localhost:8000/unsubscribe . remove.json must contain existing subscription key in order to reflect subscribers.json


http://localhost:8000/listSubscribers in the browser list all available subscriptions


## Notifier Module

* ```npm run notifier``` to start notifier service

## Scrapper Module

* when notifier is started the scrapper could be started as well

* ```npm run scrapper``` to start scrapper service


## Database Module

* data is stored in persist folder

> subscribers.json holds the subscriptions

> articles.json holds the articles that must be processed

> maxitem.txt holds the number of last processed article

* db logic is handled by shared component. See in the root folder shared/db/facade-node-persist.


## Mail Sending Module

Setup your email and pass in shared/mailer/config.js so mail sender can work properly.


# Architecture Notes

* The loop with async invocations is the tricky part of the app. We have two kinds of this:

> loop that runs async ops in parallel - when getting all new posts

> loop that runs async ops in series - when goig through all posts and getting the parent story of each post of type comment

* Utilities are architected with facades so we have stable API across the app even if we change the underlying implementation

> db module is facade to node-persist that is our database in this app

> mailer module is facade to nodemailer that is used for sending emails

* All commands have development version for example instead of running ```npm run notifier``` you can do ```npm run notifier-dev``` to see a lot of debug output of the running program