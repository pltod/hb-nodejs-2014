var url = 'http://www.google.com';
var service = require('./scraper-service')(url);



service.scrape(function (err, result) {
  console.log('PRINTING RESULTSSSSSS......')
  console.log(result);
})