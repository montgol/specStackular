'use strict';
var mongoose = require('mongoose');
var User = require('./user.js');
// mongoose.connect('mongodb://localhost/specstackular');
// mongoose.connection.on('error', console.error.bind(console, 'database connection error:'));

var item = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number, // This will produce a floating point issue --needs to be fixed
        required: true
    },
    availability: {type: Boolean, default: true},
    imgUrl: String,
    categories: [String],
    reviews: [{type: mongoose.Schema.Types.ObjectId, ref: 'Review'}],
    features: [{type: mongoose.Schema.Types.ObjectId, ref: 'Feature'}]
})


item.methods.getReviews = function(cb){  //need to make sure syntax is correct
    console.log('got to the get');
	this.populate('reviews', function(err, item){
		if (err) return err;
		//console.log(item.reviews) // for testing purposes only
		return cb(err, item.reviews);
	})
}

var review = new mongoose.Schema({
	userId: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    itemId: {type: mongoose.Schema.Types.ObjectId, ref: "Item", required: true},
	rating: {type: Number, min: 1, max: 5, required: true},
	text: String,
	verified: Boolean
})

review.methods.setReview = function(userId, itemId, cb){
    //expects to be sent a review from the server, userId and itemId (can change for any identifier)
    console.log('got to set Review');
    item.findById(itemId).update({$push: {reviews: this._id}}, function(err, itemdata){
        if(err) throw err;
        User.findById(userId).update({$push: {reviews: this._id}}, function(err, userdata){
            return cb(err, 'success');
        });
    });
};

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
