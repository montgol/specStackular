var things = require('chai-things'),
	spies = require('chai-spies'),
	chai = require('chai'),
	expect = chai.expect;

var Item = require('./server/db/models/item.js').Item,
	Review = require('./server/db/models/item.js').Review
	User = require('./server/db/models/user.js'),
	Cart = require('./server/db/models/cart.js');

chai.use(things);
chai.use(spies);

describe('Item Model', function(){

	beforeEach(function(done){
		Item.remove({}, done);
	});

	describe('validations', function(){

	});

	describe('Functions', function(){

	});
})

describe('Review Model', function(){

	beforeEach(function(done){
		Review.remove({}, done);
	});

	describe('validations', function(){

	});

	describe('Functions', function(){

	});
})



describe('User Model', function(){

	beforeEach(function(done){
		User.remove({}, done);
	});

	describe('validations', function(){

	});

	describe('Functions', function(){

	});
})