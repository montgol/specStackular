var mongoose = require('mongoose');

var schema = new mongoose.Schema({
	orderNumber: Number,
	userName: [{type: Schema.Types.ObjectId, ref: 'user'}]
	items: [{type: Schema.Types.ObjectId, ref: 'item'}],
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

module.exports = mongoose.model('Card', schema);