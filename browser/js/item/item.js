'use strict';

app.run(function ($cookies, $cookieStore) {

	var init = $cookieStore.get('Order');
	if(!init){
		$cookieStore.put('Order', []);
		console.log('starting cookie: ', $cookieStore.get('Order'));
	}

});

app.config(function ($stateProvider) {

    // Register our *item* state.
    $stateProvider.state('item', {
        url: '/item/:name',
        controller: 'itemController',
        templateUrl: 'js/item/item.html'
    });

});

app.controller('itemController', function ($scope, GetItemFactory, $state, $stateParams, $cookieStore, AuthService, OrderFactory ) {

	//get input from user about item (id from url )
	//check id vs database
	//if not found, redirect to search page
	//if found send tempalateUrl

	GetItemFactory.getItem($stateParams.name).then(function(item, err){
		if(err) $state.go('home');
		else{
			$scope.item = item[0];
			}
	});

	function adjustCookie (specificItem){
		var order = $cookieStore.get('Order');
		var resolved = false;
		var line = {itemId: specificItem._id, quantity: 1, price: specificItem.price};
			if(order){ //if user has an order on a cookie
				order.forEach(function(itemLine){
					if(itemLine.itemId === specificItem._id){
						itemLine.quantity++;
						resolved = true;
					}	
				});
				if(!resolved){
					order.push(line);
				}
			}
			else{
				order.push(line);
			}

		console.log('Cookie', order);
		$cookieStore.put('Order', order);
	}

	$scope.addToOrder = function(itemToAdd){ // requires ._id  .quantity  .price
		console.log('got into the addToOrder function'); //part one always add it to the cookie
		adjustCookie(itemToAdd);
		AuthService.getLoggedInUser().then(function(user){ //if user is authenticated
			if(AuthService.isAuthenticated()){
				if(user.user){
					user = user.user;
				}
				// console.log(user);
				OrderFactory.getOrders(user._id).then(function(order){ //get the user's cart
					var resolved = false;
					var newLine;
					console.log('inside the add to order function with a return from the server: ', order);
					if(order && order.lineItem){ // see if user has the item in the cart already
						// debugger;
						order.lineItem.forEach(function(lineItem){
							if(itemToAdd._id === lineItem.itemId && !resolved){ // if they do update amount
								lineItem.quantity++;
								console.log('itemId', lineItem.itemId, 'quantity', lineItem.quantity);
								// debugger;
								newLine = {itemId: lineItem.itemId, quantity: lineItem.quantity, orderId: order._id, price: lineItem.price};
								resolved = true;
							}
						});
						if(!resolved){ //otherwise add item
							newLine = {itemId: itemToAdd._id, quantity: 1, orderId: order._id, price: itemToAdd.price};
						}
						// debugger;
						OrderFactory.updateOrder(newLine).then(function(response){
							console.log('completed order request');
						});
					}
					else if( order ){ //user has an empty cart
						newLine = {itemId: itemToAdd._id, quantity: 1, orderId: order._id, price: itemToAdd.price};
						OrderFactory.updateOrder(newLine).then(function(response){
							console.log('completed order request');
						});
					}
				});
			}
		});
	};
});

app.controller('ReviewController', function ($scope, $stateParams, CreateReview){
	$scope.newReview = function (item){
		console.log("in review controller", item, $stateParams);
		item.reviewlist.push(item.reviewCurrent);
		CreateReview.submitReview(item).then(function(item, err){
			if (err) $scope.success = false;
			else {
				console.log("review done", item);
			}
		})
		
	}

})