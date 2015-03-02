var mongoose = require('mongoose');

var item = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    availability: boolean,
    imgUrl: String,
    categories: [String],
    reviews: [{type: Schema.Types.ObjectId, ref: 'Review'}]
})

var review = new mongoose.Schema({
	userId: {type: Number, required: true, ref: 'item'},
	rating: {type: Number, min: 1, max: 5, required: true},
	text: String,
	verified: boolean
})

review.virtual.verifyReview = function(){ 

//create a virtual function to see if user actually purchased the product
}

var option = new mongoose.Schema({
	type: {type: String, required: true }
	imgUrl: String,
	priceModifier: {type: Number, required: true}
})

item.static.getReviews = function(){  //need to make sure syntax is correct
	this.reviews.populate('Review', function(err, reviews){
		if (err) return err;
		console.log(reviews) // for testing purposes only
		else return reviews;
	})
}



mongoose.model = ('Item', item);