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

	$scope.addToOrder = function(itemToAdd){
		console.log('got into the addToOrder function'); //part one always add it to the cookie
		adjustCookie(itemToAdd);
		AuthService.getLoggedInUser().then(function(user){ //if user is authenticated
			if(AuthService.isAuthenticated()){
				if(user.user){
					user = user.user;
				}
				console.log(user);
				OrderFactory.getOrders(user._id).then(function(items,err){ //get the user's cart
					if(err) console.log(err);
					var resolved = false;
					console.log(items);
					if(items){ // see if user has the item in the cart already
						debugger;
						items.lineitems.forEach(function(item){
							if(itemToAdd._id === item.item._id && !resolved){ // if they do update amount
								console.log('itemId', item.item._id, 'quantity', item.quantity+'+1 ', 'orderId', items.orderId);
								var newLine = {itemId: item.item._id, quantity: item.quantity++, orderId: items.orderId};
								resolved = true;
							}
						});
						if(!resolved){ //otherwise add item
							var newLine = {itemId: item.item._id, quantity: 1, orderId: items._id};
						}
						OrderFactory.updateOrder(newLine).then(function(response){
							console.log('completed order request');
						});
					}
					//if no order exists create one when user goes to order page
				});
			}
		});
	};
});

app.controller('ReviewController', function ($scope, $stateParams, CreateReview){
	$scope.newReview = function (item){
		console.log("in review controller", item, $stateParams);
		CreateReview.submitReview(item).then(function(item, err){
			if (err) $scope.success = false;
			else {
				console.log("review done", item);
			}
		})
		
	}

})