Those commands can be used against running subscriber server.
Specify the needed data in corresponding json files and run curl commands in terminal.

* curl -H "Content-Type: application/json" --data @s1.json http://localhost:3000/subscribe

* curl -H "Content-Type: application/json" --data @remove.json http://localhost:3000/unsubscribe


* curl -H "Content-Type: application/json" --data @newArticles.json http://localhost:3001/newArticles