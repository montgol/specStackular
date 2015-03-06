'use strict';
var mongoose = require('mongoose');
// mongoose.connect('mongodb://localhost/specstackular');
// mongoose.connection.on('error', console.error.bind(console, 'database connection error:'));

var schema = new mongoose.Schema({
	orderNumber: Number,
	userName: {type: mongoose.Schema.Types.ObjectId, ref: 'user'},
	items: [{type: mongoose.Schema.Types.ObjectId, ref: 'item'}],
    quantity: Number,
    status: {type: String, enum: ['open','placed','shipped','complete']}
})

schema.methods.getItems = function(cb){
	return this.populate('items').exec(function(err, items){
		if (err) return err;
		else {
			return cb(items);
		}
	})
}

schema.methods.getUser = function(cb){
	return this.populate('userName').exec(function(err, items){
		if (err) return err;
		else {
			return cb(items);
		}
	})
}

module.exports = mongoose.model('Cart', schema);