# Week 6

* Libraries that use streams as main abstraction

* Streams are event emitters

* Readable and Writeable Streams

* Duplex and Transform

* Implementation and Client Interface

> Implementation Interface is to implement some methods that will be invoked by node

> Client interface handles events to get the data when it is available

* util inherits could be useful when creating streams

* Stream benefits

> working with huge data splitting it on chunks....better for the memory

> reducing callback hell


* highWaterMark and objectMode options






* Notes From CodeWinds

> The streaming data is delivered in chunks which allows for efficient use of memory 

> Simplifies realtime communication - socket is duplex stream, sse are also possible to use which are also based on streams

> Standard API for communication - passing/receiving data

> Smaller focused programs - embracing Unix concept