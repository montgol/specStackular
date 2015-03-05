'use strict';
var mongoose = require('mongoose');
//var deepPopulate = require('mongoose-deep-populate');
// mongoose.connect('mongodb://localhost/specstackular');
// mongoose.connection.on('error', console.error.bind(console, 'database connection error:'));

var schema = new mongoose.Schema({
	userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true},
	lineItem: [{ item: {type: mongoose.Schema.Types.ObjectId, ref: 'item'},
		quantity: Number
	}],
    status: {type: String, enum: ['open','placed','shipped','complete']}
})

schema.methods.setLineItem = function(item, qty, cb){
	if(qty > 0){
		//if item doesn't exist
		var loc = this.doesItemExist(item, cb) //location in array or falsy -1
		if(loc){
			this.update({'$push': {lineItem: {item: item._id, quantity: qty} }}, function(err,data){
				return cb(err, data);
			})
		}
		else{
			this.update({'lineItem.item': item._id}, {'$set': {'lineItem.$.quantity': qty}}, function(err, data){
				return cb(err, data);
			})
		}
	}
	//qty of zero equates to a delete request
	else{
		this.update({ '$splice': { lineItem: lineItemNumber-1 }}, function(err, thing){
			console.log(err, 'err', thing, 'thing');
			return cb(err, thing);
		});
	}
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
		if (err) return err;
		else {
			return cb(items);
		}
	})
}

module.exports = mongoose.model('Order', schema);