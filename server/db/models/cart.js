'use strict';
var mongoose = require('mongoose');

var schema = new mongoose.Schema({
	orderNumber: Number, // Not needed, necessarily -- can be tracked by __ID
	userName: [{type: mongoose.Schema.Types.ObjectId, ref: 'user'}], // Doesn't need to be an array
	items: [{type: mongoose.Schema.Types.ObjectId, ref: 'item'}],
	shippingStatus: {type: String, default: 'Processing Order'},
})

schema.methods.getItems = function(){
	return this.populate('items').exec(function(err, items){
		if (err) return err;
		else {
			return items;
		}
	})
}

schema.methods.getUser = function(){
	return this.populate('userName').exec(function(err, items){
		if (err) return err;
		else {
			return items;
		}
	})
}

module.exports = mongoose.model('Cart', schema);