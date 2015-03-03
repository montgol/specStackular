'use strict';
var mongoose = require('mongoose');

var item = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number, // This will produce a floating point issue --needs to be fixed
        required: true
    },
    availability: Boolean,
    imgUrl: String,
    categories: [String],
    reviews: [{type: mongoose.Schema.Types.ObjectId, ref: 'Review'}],
    features: [{type: mongoose.Schema.Types.ObjectId, ref: 'Feature'}]
})

// Make this a static method
item.static.getReviews = function(){  //need to make sure syntax is correct
    // Callback s/b called "item"
	this.reviews.populate('Review', function(err, reviews){
		if (err) return err;
		console.log(reviews) // for testing purposes only
		return reviews; // Omri suggested we may have an async issue -- return a callback?
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
