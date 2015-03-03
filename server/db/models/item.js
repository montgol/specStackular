'use strict';
var mongoose = require('mongoose');
// mongoose.connect('mongodb://localhost/specstackular');
// mongoose.connection.on('error', console.error.bind(console, 'database connection error:'));

var item = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    availability: Boolean,
    imgUrl: String,
    categories: [String],
    reviews: [{type: mongoose.Schema.Types.ObjectId, ref: 'Review'}],
    features: [{type: mongoose.Schema.Types.ObjectId, ref: 'Feature'}]
})

item.methods.getReviews = function(cb){  //need to make sure syntax is correct
	this.reviews.populate('Review', function(err, item){
		if (err) return err;
		console.log(item) // for testing purposes only
		return cb(item);
	})
}

var review = new mongoose.Schema({
	userId: {type: Number, required: true, ref: 'item'},
	rating: {type: Number, min: 1, max: 5, required: true},
	text: String,
	verified: Boolean
})

review.virtual.verifyReview = function(){ 

//create a virtual function to see if user actually purchased the product
}

var feature = new mongoose.Schema({
	type: {type: String, required: true },
	imgUrl: String,
	priceModifier: {type: Number, required: true}
})

var Item = mongoose.model('Item', item);
var Review = mongoose.model("Review", review);
var Feature = mongoose.model("Feature", feature);

module.exports = {Item: Item, Review: Review, Feature: Feature};

//db.items.create({name: 'test_glasses', price: 65, availability: true, categories: ['men', 'standard', 'hipster']})
