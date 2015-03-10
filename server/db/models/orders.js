'use strict';
var mongoose = require('mongoose');
//var deepPopulate = require('mongoose-deep-populate');
// mongoose.connect('mongodb://localhost/specstackular');
// mongoose.connection.on('error', console.error.bind(console, 'database connection error:'));

var schema = new mongoose.Schema({
	userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
	lineItem: [{ item: {type: mongoose.Schema.Types.ObjectId, ref: 'Item'},
		quantity: Number
	}],
    status: {type: String, enum: ['open','placed','shipped','complete']}
})


schema.statics.getUserOrders = function(userId, cb){
	this.find({userId: userId}, cb);
}


schema.methods.setLineItem = function(item, qty, cb){

	this.doesItemExist(item, function(location){ //location in array or falsy -1
		if(qty > 0){  //if item should be added
			if(location === -1){ //item is new
				this.update({'$push': {lineItem: {item: item._id, quantity: qty} }}, function(err,data){
					return cb(err, data);
				})
			}
			else{ //item exists in order already, needs to be updated
				this.update({'lineItem.item': item._id}, {'$set': {'lineItem.$.quantity': qty}}, function(err, data){
					return cb(err, data);
				})
			}
		}
		else{//qty of zero equates to a delete request
			this.update({ '$splice': { lineItem: location - 1 }}, function(err, thing){
				console.log(err, 'err', thing, 'thing');
				return cb(err, thing);
			});
		}
	})
	
}

schema.methods.getLineItems = function(cb){
	return this.populate('lineItem').exec(function(err, items){
		return cb(err, items);
	})
}

schema.methods.doesItemExist = function(item, cb){
	this.populate('lineItem').exec(function(err,items){
		var location = -1;
		items.forEach(function(thing, increment){
			if(thing._id === item._id){
				location = increment;
			}
		})
		return cb(location);
	})
}

schema.methods.changeLineItemPosition = function(cb){
	//takes new state from session, writes over all 
}

schema.methods.getUser = function(cb){
	return this.populate('userName').exec(function(err, items){
			return cb(err, items);
	})
}

module.exports = mongoose.model('Order', schema);