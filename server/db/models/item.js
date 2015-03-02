var mongoose = require('mongoose');

var schema = new mongoose.Schema({
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

})


var option = new mongoose.Schema({
	type: {type: String, required: true }
	imgUrl: String,
	priceModifier: {type: Number, required: true}
})

mongoose.model = ('Item', schema);