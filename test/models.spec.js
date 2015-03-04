var things = require('chai-things'),
	spies = require('chai-spies'),
	chai = require('chai'),
	mongoose = require('mongoose'),
	expect = chai.expect;

var dbConnection = require('../server/db');

chai.use(things);
chai.use(spies);

describe('Models', function(){

	beforeEach(function(done){
		dbConnection.then(function(){
			console.log('Connetion with database secured');
			done();
		});
	})

	describe('Item Model', function(){

		beforeEach(function(done){

			mongoose.model('Item').remove({}, function(){
				console.log('finished removing all items');
				done();
			});
		});

		describe('validations', function(){

			var item;
			beforeEach(function(){
				var Item = mongoose.model('Item');
				console.log('first before each statement');
				item = new Item();
			});

			it('should fail without a name', function(done){
				item.validate(function(err){
					expect(err.errors).to.have.property('name');
					done();
				});
			});

			it('should fail without a price', function(done){
				item.validate(function(err){
					expect(err.errors).to.have.property('price');
					done();
				});
			});

			it('should accept a name in the wrong case', function(done){
				item.name = 'superthing';
				item.price = 25;
				item.save();

				mongoose.model('Item').find({name: 'SUPERTHING'}, function(err, data){
					console.log(err, data);
					expect(data.length).to.equal(1);
					done();
				})
			})
		});

		describe('Functions', function(){

		});
	});

	describe('Review Model', function(){

		// beforeEach(function(done){
		// 	Review.remove({}, done);
		// });

		describe('validations', function(){

		});

		describe('Functions', function(){

		});
	});

	describe('User Model', function(){

		beforeEach(function(done){
			User.remove({}, done);
		});

		describe('validations', function(){

		});

		describe('Functions', function(){

		});
	})

})









