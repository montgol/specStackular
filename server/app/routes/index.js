'use strict';
var router = require('express').Router();
var User = require('../../db/models/user.js');
var Item = require('../../db/models/item.js').Item;
var Cart = require('../../db/models/cart.js');

router.use(passport.initialize());
router.use(passport.session());
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

router.post('/item', function(req, res, next){
    console.log('into the router');
    var info = req.body;
    console.log(info);
    Item.create(info, function(err, result){
        console.log(err, 'err', result, 'result');
        if (err) return next(err);
        else res.send(result);
    });

})

router.post('/user/edit', isAuthenticated, function (req, res, next) { //username sent as a query
    isAuthenticated(req, res, next); //checks if req.user exists and goes to next life if yes.
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

router.get('/item/:name', function (req, res, next) { //requested by angular when item is selected
    var itemname = req.params.name;
    console.log(itemname);
    Item.find({name: itemname}).exec(function(err, data){
        if(err) return next(err);
        res.send(data);
    })
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



module.exports = router;
