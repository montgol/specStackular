'use strict';
var router = require('express').Router();
var User = require('../../db/models/user.js');
var Item = require('../../db/models/item.js').Item;
var Review = require('../../db/models/item.js').Review;
// var Cart = require('../../db/models/cart.js');
var Order = require('../../db/models/orders.js');


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
    User.find({}).exec(function (err, users) {
        if (err) return next(err);
        res.send(users);
    })
})


router.get('/login/:email', function (req, res, next) { //requested by angular when item is selected
    var info = req.params.email;
    console.log('into the user email router with: ', info);
    User.find({email: info}).exec(function(err, data){
        if(err) return next(err);
        res.send(data);
    })
})

router.post('/join', function (req, res, next) {
    console.log('into the join router');
    var info = req.body;
    console.log(info);
    User.create(info, function(err, result){
        console.log(err, 'err', result, 'result');
        if (err) return next(err);
        else res.send(result);
    });
})

router.post('/admin/itemCreate', function(req, res, next){
    console.log('into the router');
    var info = req.body;
    console.log(info);
    Item.create(info, function(err, result){
        console.log(err, 'err', result, 'result');
        if (err) return next(err);
        else res.send(result);
    });
})

router.post('/admin/userModify', function(req, res, next){
    console.log('into the router');
    var info = req.body;
    console.log(info);
    User.findOne({email: info.email}, function(err, result){
        console.log(err, 'err', result, 'result');
        if (result) {
            if (info.password) {
                result.password = info.password;
            }
            if (info.makeAdmin) {
                result.admin = info.makeAdmin
            }
            if (result) {
                result.save(function(err, saved) {
                    console.log(saved)
                    if (err) return next(err);
                    else res.send(saved);
                })
            }
        }      
    });
})

//Admin orderModify Routes

router.get('/admin/order', function (req, res, next) {
    Order.find({}).exec(function (err, orders) {
        if (err) return next(err);
        res.send(orders);
    })
})

router.put('/admin/order', function (req, res, next){
    console.log('into the router');
    var info = req.body;
    console.log(info);
    Order.findOne({email: info.email}, function(err, result){
        console.log(err, 'err', result, 'result');
        if (result) {
            if (info.password) {
                result.password = info.password;
            }
            if (info.makeAdmin) {
                result.admin = info.makeAdmin
            }
            if (result) {
                result.save(function(err, saved) {
                    console.log(saved)
                    if (err) return next(err);
                    else res.send(saved);
                })
            }
        }      
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
    var itemName = req.params.name;
    console.log(itemName);
    Item.find({name: itemName}).exec(function(err, data){
        if(err) return next(err);
        res.send(data);
    })
})

router.post('/reviews', function (req, res, next){
    var review = req.body.review;
    var userId = req.body.userId;
    var itemId = req.body.itemId;

    Review.create(review, function(err, submittedReview){
        if (err) throw next(err);
        submittedReview.setReview(userId, itemId, function(err, resp){
            if(err) throw next(err);
            res.send(resp);
        })
    })
})

router.get('/order', function (req, res, next){
	var user = req.user.session; //might need ._id
    console.log(user);

    if(!isAuthenticated){ //set info on the session

    }
    else{
        Order.find({userId: user}, function(err, data){
            if (err) throw next(err);
            data.getLineItems(function(err, items){
                var obj = {info: data, lineitems: items};
                res.send(obj);
            });
        });
    }
})
// make error handler

router.post('/order', function (req,res,next){
    var userId = req.user.session._id;
    var item = req.body.itemId;
    var qty = req.body.qty;

    Order.create({userId: userId}, function(err, page){
        if(err) throw next(err);
        page.setLineItem(item, qty, function(err, update){
            if(err) throw next(err);
            res.send(update);
        })
    })
})


router.post('/order/lineitem', function (req, res, err) {
    
    var orderId = req.body.orderId;
    var itemId = req.body.itemId;
    var quantity = req.body.quantity;
    Order.findById(orderId).exec(function(err, myOrder){
        if(err) throw next(err);
        myOrder.setLineItem(itemId, quantity, function(err, updatedInfo){
            if (err) throw next(err);
            res.send(updatedInfo);
        });
    
    });
});

router.use(function (err, req, res, next) {
    res.status(err.status).send({ error: err.message });
});

module.exports = router;
