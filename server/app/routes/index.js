'use strict';
var router = require('express').Router();
var User = require('../../db/models/user.js');
var Item = require('../../db/models/item.js').Item;
var Review = require('../../db/models/item.js').Review;
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
    Order
        .find({})
        .populate('userId')
        .populate('lineItem.item')
        .exec(function (err, orders) {
            res.send(orders);
        })
                
})

router.post('/admin/order', function (req, res, next) {
    console.log(req.body)
    User
        .find({
            '_id': { $in: req.body.data }
        })
        .exec(function (err, users) {
            res.send(users);
        })               
})


router.put('/admin/order', function (req, res, next){
    var info = req.body;
    console.log(info);
    Order.findByIdAndUpdate(req.body[0], {status: req.body[1]}, function(err, result){
        console.log(err, 'err', result, 'result');   
        res.send(result)
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

    Item.find({}).exec(function (err, items) {
        if (err) return next(err);
        res.send(items);
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

router.put('/stripeKey/:key/:orderId', function (req, res, next) { //requested by angular when item is selected
    var key = req.params.key;
    var orderId = req.params.orderId
    console.log('+++++++++++++++++', key);
    console.log('%%%%%%%%%%%%%%%', orderId)
    Order.findByIdAndUpdate(orderId, {stripeKey: key}).exec(function(err, data){
        console.log('findById called ++++++++++', data)

        if(err) return next(err);
        res.send(data);
    })
})

router.get('item/:category', function (req, res, next) {
    console.log(req.params);
})

router.post('/reviews', function (req, res, next){
    console.log("POST", req.body);

    var id = req.body._id;
    var review = [];
    var name = req.body.name;
    var category = req.body.category;
    
    review.push(req.body.reviewlist);
    // Item.findByIdAndUpdate(id, {$set: {reviewlist: review}}, function (err, item){
    //     if(err) return next(err);
    //     res.redirect('/');
    // })

    Item.findById(id).update({'$push': {reviewlist: review}}).exec(function(err, reviewData){
            if (err) console.log(err);
            res.send(reviewData);
    })
})


    // Review.create(review, function(err, submittedReview){
    //     if (err) throw next(err);
    //     submittedReview.setReview(userId, itemId, function(err, resp){
    //         if(err) throw next(err);
    //         res.send(resp);
    //     })
    // })


router.get('/order/:userId', function (req, res, next){
    //gets an order by userId
	var user = req.params.userId; //might need ._id
    console.log('in getuser middleware: user', user);

    if(user == undefined){
        res.send(null);
    }
    Order.findOne({userId: user}, function(err, data){ //assumes there is only one order, ok for now, needs to be modified later
        console.log('in order-middleware, data: ', data);
        if (err) return next(err);
        else if( data ) { //if an order already exists
            console.log('lineItem', data.lineItem);
            res.send(data);
        } 
        else { //no order exists
            console.log('No user order in Db');
            res.send(null);
        }
    });
});

router.post('/order', function (req,res,next){
    //used to create an order if none exists
    //should take in userId, and an array of items
    console.log('Creating an Order', req.body.items);
    var userId = req.body.userId;
    var lineItems = req.body.items;

    var newLineItem=[];
    lineItems.forEach(function(line){  //change format, might not be required
        newLineItem.push({quantity: line.quantity, itemId: line.itemId, price: line.price});
    });
    console.log(newLineItem)

    Order.create({ userId: userId, status: 'open', lineItem: newLineItem}, function(err,data){
        console.log(err, data);
        User.findById(userId).update({'$push': {orders: data._id}}).exec(function(err, userData){
            if (err) console.log(err);
            res.send(data);
        })
        
    });
});

router.post('/order/lineitem', function (req, res, next) {
    //used to add/update/remove items from the order db
    //backend can handle all cases
    var orderId = req.body.orderId;
    var itemId = req.body.itemId;
    var quantity = req.body.quantity;
    var price = req.body.price;
    var obj = {itemId: itemId, quantity: quantity, price: price};

    console.log('got into the adjust lineitem with', obj);


    Order.findById(orderId).exec(function(err, myOrder){
        // console.log('myOrder', myOrder, 'err', err);
        if(err) return next(err);
        myOrder.setLineItem(obj, function(err, updatedInfo){  //verify updatedInfo is the full obj and what we want
            if (err) return next(err);
            console.log('post lineItem from server', updatedInfo);
            res.send(updatedInfo);
        });
    });
});

router.use(function(err, req, res, next){
    res.status(err.status).send({ error: err.message });

});

module.exports = router;
