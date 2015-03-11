'use strict';
var mongoose = require('mongoose');
//var deepPopulate = require('mongoose-deep-populate');
// mongoose.connect('mongodb://localhost/specstackular');
// mongoose.connection.on('error', console.error.bind(console, 'database connection error:'));

var schema = new mongoose.Schema({
	userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
	lineItem: [ {itemId: String, quantity: Number, price: Number }],
    status: {type: String, enum: ['open','placed','shipped','complete']}
})


schema.statics.getUserOrders = function(userId, cb){
	this.findOne({userId: userId}, cb);
}

// schema.methods.setLineItem = function(item, qty, cb){
schema.methods.setLineItem = function(info, cb){	
	var focus = this;
	//req.body  .orderId  .itemId  .quantity  .price
	this.doesItemExist(info.itemId, function(location){ //location in array or falsy -1
		console.log('into setLineItem');
		if(info.quantity > 0){  //if item should be added
			if(location === -1){ //item is new
				console.log('problem adding to the db', focus, 'focus', info, 'info');
				Order.findOne({_id: focus._id}, function( err, data){
					data.update({ $push: {'lineItem': info }}, function(err,data){
					console.log('out the back end');
					return cb(err, data);
					})
				})
			}
			else{ //item exists in order already, needs to be updated
				console.log('landed correctly', 'focus', focus, 'info', info);
				Order.findOne({_id: focus._id}).update({'lineItem.itemId': info.itemId}, {'$set': {lineItem: info}}, function(err, data){
					return cb(err, data);
				})
			}
		}
		else{//qty of zero equates to a delete request
			console.log(location, '-/-/-/-/-/-', focus.lineItem[location]);
			Order.findOne({_id: focus._id}, function(err, doc){
				if(!err){
					doc.lineItem[location].remove();
					doc.save(function(err){
						Order.findOne({_id: focus._id}, function(err, modDoc){
							if(!err){
								return cb(modDoc);
							}
						});
					});
				}
				
			});
		}
	});
	
}

schema.methods.doesItemExist = function(item, cb){
		var location = -1;
		this.lineItem.forEach(function(thing, increment){
			if(thing.itemId === item){
				location = increment;
			}
		});
		return cb(location);
}

schema.methods.getUser = function(cb){
	return this.populate('userName').exec(function(err, items){
			return cb(err, items);
	})
}
var Order = mongoose.model('Order', schema);
module.exports = mongoose.model('Order', schema);