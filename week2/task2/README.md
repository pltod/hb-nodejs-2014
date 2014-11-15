**STATE**

[![experimental](http://badges.github.io/stability-badges/dist/experimental.svg)](http://github.com/badges/stability-badges)



DATA TRANSFORMATION

1. Scrapper is doing the following output:

{
    "JavaScript": 1000,
    "Python": 200
}

2. In mongo we must have:

{
  "keyword": "JavaScript",
  "count": 1000
},
{
  "keyword": "Python",
  "count": 200
}

3. In UI we must have

{
  "rank": 1,
  "keyword": "JavaScript",
  "count": 1000
}, 
{
  "rank": 2,
  "keyword": "Python",
  "count": 200
};
