var mongoose = require('mongoose');
var dbConnection = require('./server/db');

var dataItem = [
    {   name: 'test_glasses', price: 15, availability: true, imgUrl: 'http://regardingsales.com/wp-content/uploads/2013/06/20.jpg', categories: ['mens', 'cheap'] },
    {   name: 'fancy_glasses', price: 70, availability: false, imgUrl: 'http://www.pinktreeparties.co.uk/communities/8/004/006/270/758/images/4527827291.jpg', categories: ['womens', 'expensive']}
    ];
var dataUser = [
    { first_name: 'Harry', last_name:'Potter', email:'harry.potter@yahoo.com'},
    { first_name: 'Princess', last_name: 'Money', email:'p.money@money.com'}
    ];

console.log('welcome to the Seed...');

function addToDb (){

    var Item =  mongoose.model('Item');

	for(var a=0, len = dataItem.length; a<len; a++){
    		console.log(dataItem[a]);
    		Item.create(dataItem[a], function(err, data){
    			if (err) throw err;
    		});
    }
    console.log('Finished adding Items');

    var User = mongoose.model('User');
	for(var a=0, len = dataUser.length; a<len; a++){
		console.log(dataUser[a]);
		User.create(dataUser[a], function(err, data){
			if(err) throw err;
		});
	}

    console.log('Finished adding Users');
    return;
};

    addToDb();
