var debug = require('debug')('snippet-app-server-test');
var request = require('supertest');
var expect = require('chai').expect;

describe('Contact API', function() {
  var app, agent, contactId;
  var contact = {"phoneNumber": "123", "personIdentifier": "name1 1212222"};
  var contact2 = {"phoneNumber": "123", "personIdentifier": "name1 test"};
  var contact3 = {"phoneNumber": "123", "personIdentifier": "name"};
      
  before(function(done){
    require('../server')(function(err, app) {
      if (err) {
        console.log('Unable to start application')
      } else {
        app.cleanGroups(function (err, result) {
          if (err) console.log('Groups is not cleaned')
          app.cleanContacts(function (err, result) {
            if (err) {
              console.log('Contacts collection is not cleaned')            
            }
            agent = request.agent(app);
          
            // not nice
            agent.closeDb = app.closeDb;
            debug('App server initialized and DB is ready.')
            done();
          })
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

  it('should create contact 2', function(done) {

    agent
      .post('/contact')
      .send(contact2)
      .end(function(err, res) {
        expect(err).to.be.a('null');
        expect(res.status).to.be.equal(200);
        expect(res.body[0]._id).not.to.be.null;
        expect(res.body[0].personIdentifier).to.equal(contact2.personIdentifier);
        expect(res.body[0].phoneNumber).to.equal(contact2.phoneNumber);
        
        contactId = res.body[0]._id;
        done();

      });
  })

  it('should create contact 3', function(done) {

    agent
      .post('/contact')
      .send(contact3)
      .end(function(err, res) {
        expect(err).to.be.a('null');
        expect(res.status).to.be.equal(200);
        expect(res.body[0]._id).not.to.be.null;
        expect(res.body[0].personIdentifier).to.equal(contact3.personIdentifier);
        expect(res.body[0].phoneNumber).to.equal(contact3.phoneNumber);
        
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
        expect(res.body.length).to.be.equal(3);
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

  it('should return groups', function(done) {
    agent
      .get('/groups')
      .end(function(err, res) {
        expect(err).to.be.a('null');
        expect(res.status).to.be.equal(200);
        expect(res.body.length).to.be.equal(2);
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
