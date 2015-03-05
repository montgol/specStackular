'use strict';
var mongoose = require('mongoose');
//var deepPopulate = require('mongoose-deep-populate');
// mongoose.connect('mongodb://localhost/specstackular');
// mongoose.connection.on('error', console.error.bind(console, 'database connection error:'));

var schema = new mongoose.Schema({
	orderNumber: Number,
	userName: { type: mongoose.Schema.Types.ObjectId, ref: 'user'},
	lineItem: [{ item: {type: mongoose.Schema.Types.ObjectId, ref: 'item'},
		quantity: Number
	}],
    status: {type: String, enum: ['open','placed','shipped','complete']}
})

schema.methods.setLineItem = function(item, qty, cb){
	this.update({$set: {lineItem: {item: item._id, quantity: qty} }}, function(err,data){
		return cb(err, data);
	})
}

schema.methods.getLineItems = function(cb){
	return this.populate('lineItem').exec(function(err, items){
		return cb(err, items);
	})
}

// schema.methods.changeLineItem = function(lineItemNumber, updatedQty, cb){
// 	//check if qty is zero and splice out item
// 	//if qty is non-zero, update qty
// 	if(updatedQty === 0){
// 		this.update({ $splice: { lineItem: lineItemNumber-1 }}, function(err, thing){
// 			console.log(err, 'err', thing, 'thing');
// 			return cb(err, thing);
// 		});
// 	}
// 	else{
// 		this.update({ $set: { lineItem[lineItemNumber-1].quantity: updatedQty }}, function(err, newObj){
// 			return cb(err, newObj);
// 		})
// 	}
// }

schema.methods.changeLineItemPosition = function(cb){
	//takes new state from session, writes over all 
}

schema.methods.getUser = function(cb){
	return this.populate('userName').exec(function(err, items){
		if (err) return err;
		else {
			return cb(items);
		}
	})
}

module.exports = mongoose.model('Order', schema);