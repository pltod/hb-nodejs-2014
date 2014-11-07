var debug = require('debug')('snippet-app-server-test');
var request = require('supertest')
var expect = require('chai').expect;

describe('Snippet API', function() {
  var app;
  var agent;
  var snippet = {"code": "version1", "file": "test.js", "lang": "js", "user": "one"};
  var snippetUpdate = {"code": "version2", "file": "test.js", "lang": "js", "user": "one"};  
  var snippetId;
  
  before(function(done){
    require('../server')(function(err, app) {
      if (err) {
        console.log('Unable to start application')
      } else {
        app.cleanColl(function (err, result) {
          if (err) {
            debug('Collection is not cleaned')            
          }
          agent = request.agent(app);
          
          // not nice
          agent.closeDb = app.closeDb;
          debug('App server initialized and DB is ready.')
          done();
        })
      }
    });
  })
  
  it('should create snippet', function(done) {

    agent
      .post('/snippet')
      .send(snippet)
      .end(function(err, res) {
        expect(err).to.be.a('null');
        expect(res.status).to.be.equal(200);
        expect(res.body[0]._id).not.to.be.null;
        expect(res.body[0].code).to.equal(snippet.code);
        expect(res.body[0].file).to.equal(snippet.file);
        expect(res.body[0].lang).to.equal(snippet.lang);
        expect(res.body[0].user).to.equal(snippet.user);
        
        snippetId = res.body[0]._id;
        done();

      });
  })

  it('should return all snippets', function(done) {
    agent
      .get('/snippet')
      .end(function(err, res) {
        expect(err).to.be.a('null');
        expect(res.status).to.be.equal(200);
        expect(res.body.length).to.be.equal(1);
        done();
      });
  })

  it('should return snippet by id', function(done) {
    agent
      .get('/snippet/' + snippetId)
      .end(function(err, res) {
        expect(err).to.be.a('null');
        expect(res.status).to.be.equal(200);
        expect(res.body._id).to.be.equal(snippetId);
        done();
      });
  })

  it('should return snippets by user', function(done) {
    agent
      .get('/snippet?user=' + snippet.user)
      .end(function(err, res) {
        expect(err).to.be.a('null');
        expect(res.status).to.be.equal(200);
        expect(res.body.length).to.be.equal(1);
        expect(res.body[0]._id).to.be.equal(snippetId);
        done();
      });
  })

  it('should update the snippet', function(done) {
    agent
      .put('/snippet/' + snippetId)
      .send(snippetUpdate)
      .end(function(err, res) {
        expect(err).to.be.a('null');
        expect(res.status).to.be.equal(200);
        expect(res.body).to.be.equal(1);
        done();
      });
  })

  it('should delete the snippet', function(done) {
    agent
      .delete('/snippet/' + snippetId)
      .end(function(err, res) {
        expect(err).to.be.a('null');
        expect(res.status).to.be.equal(200);
        expect(res.body).to.be.equal(1);
        done();
      });
  })
  
  after(function (done) {
    agent.closeDb(true, function(err, result) {
      err ? debug('Unable to close the DB') : debug('DB is closed.')
      
      done();
    });    
  })
})
