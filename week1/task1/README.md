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








# General TODOs

* middleware thing ( shared component ??? )

* refactoring all 

> shared components

> using path modules instead of some exotic functions

> JS doc where necessary

* this task

# Task Summary

* 4. statistic service

> last 10000

> for each publication tokenize with https://github.com/NaturalNode/natural and count the appearance of each new token

> save the results

histogram.json to store the statistics - this was the original intent

{
    "JavaScript": 1000,
    "Python": 200
}

now it is better to directly store it in mongo with the following structure:

{
  "keyword": "JavaScript",
  "count": 1000
},
{
  "keyword": "Python",
  "count": 200
}

in this way we are going to consume it easy in the next task and do visualisation



Additions

* DONE type of subscription - story ili commentar

* email confirmation - iskate li da se subscribnete sus link za potvurjdenie. pazim potvurjdeniqta v basata i notifier-a ne isprashta maili na ne potvurdeni adresi.

> TESTED: mongodb TTL


{
   "createdAt": new Date(),
   "logEvent": 2,
   "logMessage": "Success!"
}

we must have TTL index on createdAt field

Example of one our validation is:

db.log_events.ensureIndex( { "createdAt": 1 }, { expireAfterSeconds: 3600 } )

3 minutes:

db.log_events.ensureIndex( { "createdAt": 1 }, { expireAfterSeconds: 240 } )



> SHOULD BE EASY uuid with html mail and link

* kogato ima suvpadenie v komentar da se namira kam koe story e toi i da se isprashta v maila. Tricky tursene na parents po pole parents - koga da se sluchva?

* 4ti process - da se prochete celiq hacker news...ot 1 natatuk, hvashta vsichki sus text pole, rasbiva go na dumi i smqta koq duma kolko pati se sreshta v parvite nqkolko itemi da rechem i zapisva 

> da zapisva direktno v mongodb za da se polsva ot drugiq servis za visualisation

> da se napravi no s poslednite 1000 posta

> dali mogat da se pusnat paralelni zaqvki i da se ismeri za kolko vreme moje da se sluchi vsichko

