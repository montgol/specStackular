'use strict';
var router = require('express').Router();
var User = require('../../db/models/user.js');
var Item = require('../../db/models/item.js');
var Cart = require('../../db/models/cart.js');
//var path = require('path');
module.exports = router;

// router.get('/', function(req, res, next){
// 	res.sendFile(path.join(rootPath, './server/app/views/index.html'));
// })

router.use('/tutorial', require('./tutorial'));

function isAuthenticated(req, res, next) {
    if (req.user) next();
    else {
        var err = new Error('Unknown user');
        err.status = 401;
        next(err);
    }
}


router.get('/user', function (req, res, next) {
    var email = req.data.email;  //should be structured to include username: username
    User.findOne({email: email}).exec(function (err, user) {
        if (err) return next(err);
        res.send(user);
    })
})

router.post('/user/edit', isAuthenticated, function (req, res, next) { //username sent as a query
    var userinfo = req.body;
})

router.get('/logout', function (req, res) {
    // passport attaches this function to req for us
    req.logout();
    res.redirect('/');
});

router.get('/itemlist', function (req, res, next) {  //should be requested by angular when page loads
    Item.find({}).exec(function (err, users) {
        if (err) return next(err);
        res.send(users);
    })
})

router.get('/item/:id', function (req, res, next) { //requested by angular when item is selected
    var itemId = req.params.id;
    Item.find({id: itemId})
})

router.get('/cart', function(req, res, next){
	var user = req.user.session;
	res.send(user);
})

router.post('/item/addtocart/:productId', function (req, res, err) {
    // Quantity, userid, itemid
    // req.params.productId
    // Check to see if there is a cart for user with userid
    // If not, create one
    // Then check to see if this productid is already in user cart
    // If so, increment quantity
    // If not, add productid & quantity to cart
    var productId = req.params.productId;
    var quantity = req.params.quantity
    res.send(200);
    // User.findOne({email: email}).exec(function (err, user) {
    //     if (err) return next(err);
    //     var cart = this.cart;
    //     if (cart.length !== 0) {
    //         for (var item in cart) {
    //             if (cart[item].id == productId) {
    //                 cart[item].quantity += quantity;
    //             }
    //         }
    //     }
    //     else {
    //         cart.addToCart(productId, quantity);
    //     }
    // })

})