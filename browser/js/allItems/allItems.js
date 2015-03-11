'use strict';

app.run(function ($cookies, $cookieStore) {

	var init = $cookieStore.get('Order');
	if(!init){
		$cookieStore.put('Order', []);
		console.log('starting cookie: ', $cookieStore.get('Order'));
	}

});

app.config(function ($stateProvider) {



    $stateProvider.state('products', {
        url: '/products',
        controller: 'allItemsController',
        templateUrl: 'js/allitems/allitems.html'
    })

});

app.controller('allItemsController', function ($scope, AuthService, GetItemsFactory, $state, $stateParams, $cookieStore, OrderFactory) {

	GetItemsFactory.getItems().then(function(items, err){
		if(err) throw err;
		else{
			$scope.items = items;
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
				console.log(user);
				OrderFactory.getOrders(user._id).then(function(order){ //get the user's cart
					var resolved = false;
					console.log('inside the add to order function with a return from the server: ', order);
					if(order && order.lineItem){ // see if user has the item in the cart already
						debugger;
						order.lineItem.forEach(function(lineItem){
							if(itemToAdd._id === lineItem.itemId && !resolved){ // if they do update amount
								console.log('itemId', lineItem.itemId, 'quantity', lineItem.quantity+'+1 ');
								var newLine = {itemId: item.itemId, quantity: item.quantity++, orderId: items.orderId, price: itemToAdd.price};
								resolved = true;
							}
						});
						if(!resolved){ //otherwise add item
							var newLine = {itemId: itemToAdd._id, quantity: 1, orderId: order._id, price: itemToAdd.price};
						}
						OrderFactory.updateOrder(newLine).then(function(response){
							console.log('completed order request');
						});
					}
					else if( order ){ //user has an empty cart
						var newLine = {itemId: itemToAdd._id, quantity: 1, orderId: order._id, price: itemToAdd.price};
						OrderFactory.updateOrder(newLine).then(function(response){
							console.log('completed order request');
						});
					}
				});
			}
		});
	};


});

app.controller('categoryController', function ($scope, GetItemsFactory, $state, $stateParams) {

	$scope.getCategory = function (category){
		console.log("men controller", category);
			GetItemFactory.getCategoryItems().then(function(items, err){
					if(err) throw err;
						else{
							$scope.items = items;
					};
			});
	};
});

