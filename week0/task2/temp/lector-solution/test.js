var http= require("http"),
      router = require("./server")(http);

router.use(function(req, res, next) {
  var data = '';

  req.on('data', function(chunk){
    data+=chunk.toString();
  });

  req.on('end', function() {
    req.data = data;

    try {
      var body = JSON.parse(data);
      req.body=body;
      next();
    } catch(e) {
      next('Invalid JSON body.');
    }
  });
});

router.get('/panda', function(req, res) {
  res.write('Not panda!');
});

router.get('/panda', function(req, res) {
  res.end('Pandaaaaaa!');
});

router.get('/panda2', function(req, res) {
  res.write('panda 2!');
});

router.listen(8081);