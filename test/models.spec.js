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
			done();
		});
	})

	describe('Item Model', function(){

		beforeEach(function(done){
			mongoose.model('Item').remove({}, function(){
				done();
			});
		});


		describe('validations', function(){

			var item;
			beforeEach(function(done){
				var Item = mongoose.model('Item');
				console.log('first before each statement');
				item = new Item();
				done();
			});

			afterEach(function(done){
				mongoose.model('Item').remove({}, function(){
				done();
				});
			})

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
					expect(data.length).to.equal(1);
					done();
				})
			})
		});

	});

	describe('Review Model + Item model + User model', function(){

		beforeEach(function(done){
			mongoose.model('Review').remove({}, done);	
		});

		describe('validations', function(){

			var Item, User, Review;
			var item, user, review;

			beforeEach(function(done){
				mongoose.model('Review').remove({});

				Item = mongoose.model('Item');
					item = new Item({name: 'Thing', price:20});
					item.save();
				User = mongoose.model('User');
					user = new User({first_name: 'billy', last_name: 'bob'});
				Review = mongoose.model('Review');	
				done();
			});

			afterEach(function(done){
				mongoose.model('Review').remove({}, function(){
					mongoose.model('User').remove({}, function(){
						mongoose.model('Item').remove({}, function(){
							done();
						})
					})	
				});
			});

			it('Should require a rating', function(done){
				user.save(function(err, person){
					review = new Review({userId: person._id});
					review.validate(function(err){
						expect(err.errors).to.have.property('rating');
						done();
					});
				});
				
			});

			it('Should fail when there is no associated user', function(done){
				review = new Review({rating: 4});
						review.validate(function(err){
							expect(err.errors).to.have.property('userId');
							done();
						});
			});

			it('Should fail when there is no associated item', function(done){
				review = new Review({rating: 4});
						review.validate(function(err){
							expect(err.errors).to.have.property('itemId');
							done();
						});
			});

			it('Should save a review when username, item and rating are entered', function(done){
				user.save(function(err, person){
					if(err) throw err;
					item.save(function(err, product){
						review = new Review({userId: person._id, itemId: product._id, rating: 4});
						review.save(function(err){
							if (err) throw err;
							Review.find({}, function(err, data){
								expect(data.length).to.equal(1);
								done();
							});
						});
					})
					
				});
			})

		});

		describe('Functions', function(){

			var Item, User, Review;
			var item, user, review;

			beforeEach(function(done){

				Item = mongoose.model('Item');
				User = mongoose.model('User');
				Review = mongoose.model('Review');	
					item = new Item({name: 'Thing', price:10});
					item.save(function(err, product){
						user = new User({first_name: 'billy', last_name: 'bob'});
						user.save(function(err, person){
							review = new Review({itemId: product._id, userId: person._id, rating: 5});
							review.save(function(err, note){
								if (err) throw err;
								note.setReview(person._id, product._id, function(){
									done();
								})								
							})
						});
					});
			})

			afterEach(function(done){
				mongoose.model('Review').remove({}, function(){
					mongoose.model('User').remove({}, function(){
						mongoose.model('Item').remove({}, function(){
							done();
						})
					})	
				});
			});

			it('Should be able to set reviews with setReview method', function(done){
				Item.findOne
				({name: 'Thing'}, function(err, product){
					expect(product.reviews.length).to.equal(1);
					done();
				});
			});

			it('Should be able to find reviews by getReviews method', function(done){
				Item.findOne({name: 'Thing'}, function(err, product){
					if(err) throw err;
					console.log('product', product);
					product.getReviews(function(reviews){
						expect(reviews.length).to.equal(1);
						done();
					})
				})

			})

		});
	});

	describe('User Model', function(){
		var User;
		beforeEach(function(done){
			User = mongoose.model('User');
			User.remove({}, done);

		});

		describe('validations', function(){
			it('should not allow a user without a first name', function(done){
				var user = new User({last_name: 'Peters'});
				user.validate(function(err){
						expect(err.errors).to.have.property('first_name');
						done();
				});
			});

			it('should not allow a user without a last name', function(done){
				var user = new User({first_name: 'Pete'});
				user.validate(function(err){
						expect(err.errors).to.have.property('last_name');
						done();
				});
			});
		});

			it('should direct to direct to admin page if admin'), function() {

			};

		describe('Functions', function(){

		});
	});

	describe('Cart Model', function(){
		var Cart;
		beforeEach(function(done){
			Cart = mongoose.model('Cart');
			Cart.remove({}, done);

		});

		describe('validations', function(){
			it('should have a user name', function(done){
				var cart = new Cart({orderNumber: 1});
				user.validate(function(err){
						expect(err.errors).to.have.property('first_name');
						done();
				});
			});
		});
	})
})
