# General TODOs

* middleware thing

* refactoring all 

> shared components

> using path modules instead of some exotic functions

> JS doc where necessary

* this task

# Task Summary

* DONE on subscribe send email via mailer - DONE

* DONE when user confirm subscription -> confirmed to true - DONE

* notifier must send only to confirmed = true

* notifier must check for story or comment subscription

> find the parent story so it is also included in the mail

* DONE scrapper to be changed so it saves type = comment in the articles.json - DONE

* statistic service

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


# How to Run the Solution

TODO


# Architecture Notes

TODO
  


