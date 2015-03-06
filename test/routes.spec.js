var chai = require('chai'),
    mongoose = require('mongoose'),
    expect = chai.expect
    supertest = require('supertest'),
    app = require('../server/app/index.js'),
    agent = supertest.agent(app)
    express = require('express');

var User = require('../server/db/models/user.js');


describe('http requests', function() {

   beforeEach(function (done) {
      User.create({
        first_name: 'Harry',
        last_name: 'Potter',
        email: 'harry.potter@hogwarts.com' 
      }, done);
    });


  describe('GET /user/:email', function() {
      it('should get 200 on an email that does exist', function (done) {
        agent
          .get('/user/harry.potter@hogwarts.com')
          .end(function (err,res) {
            expect(res.statusCode).to.be.equal(200);
          done();
          });
      });

      it('should get 500 on an email that does exist', function (done) {
        agent
          .get('/user/ronald.weasley@hogwarts.com')
          .end(function (err,res) {
            expect(res.statusCode).to.be.equal(500);
          done();
          });
      });

  });

  describe('/user', function () {
    var user = new User;
    it('should create a user', function (done) {
      agent
        .get('/user')
        .send({
                first_name: 'Hermione',
                last_name: 'Granger',
                email: 'hermione.granger@hogwarts.com'

        });
        expect(user.first_name).to.be.a('string');
        done();
    }); 
  });

});



