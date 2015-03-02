'use strict';
var router = require('express').Router();
var User = require('../../db/models/user.js');
var Item = require('../../db/models/item.js');
module.exports = router;

router.use('/tutorial', require('./tutorial'));

function isAuthenticated (req, res, next){
	if(req.user) next();
	else{
		var err = new Error('Unknown user');
		err.status =401;
		next(err);
	}
}


router.get('/user', function(req, res, err){
	var email = req.data.email;  //should be structured to include username: username
	User.findOne({username}).exec(function(err, user){
		if (err) return next(err);
		res.send(user);
	})
})

router.get('/itemlist', function(req, res, err){  //should be requested by angular when page loads
	Item.find({}).exec(function(err, users){
		if(err) return next(err);
		res.send(users);
	})
})

router.get('/item:id', function(req, res, err){ //requested by angular when item is selected
	var itemId = req.params.id;
	Item.find({id: item})
})