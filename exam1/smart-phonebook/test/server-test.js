var debug = require('debug')('snippet-app-server-test');
var request = require('supertest')
var expect = require('chai').expect;

describe('Contact API', function() {
  var app, agent, contactId;
  var contact = {"phoneNumber": "123", "personIdentifier": "name1"};
  
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
  
  it('should create contact', function(done) {

    agent
      .post('/contact')
      .send(contact)
      .end(function(err, res) {
        expect(err).to.be.a('null');
        expect(res.status).to.be.equal(200);
        expect(res.body[0]._id).not.to.be.null;
        expect(res.body[0].personIdentifier).to.equal(contact.personIdentifier);
        expect(res.body[0].phoneNumber).to.equal(contact.phoneNumber);
        
        contactId = res.body[0]._id;
        done();

      });
  })

  it('should return all contacts', function(done) {
    agent
      .get('/contact')
      .end(function(err, res) {
        expect(err).to.be.a('null');
        expect(res.status).to.be.equal(200);
        expect(res.body.length).to.be.equal(1);
        done();
      });
  })

  it('should return contact by id', function(done) {
    agent
      .get('/contact/' + contactId)
      .end(function(err, res) {
        expect(err).to.be.a('null');
        expect(res.status).to.be.equal(200);
        expect(res.body._id).to.be.equal(contactId);
        done();
      });
  })

  it('should delete the contact', function(done) {
    agent
      .delete('/contact/' + contactId)
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
