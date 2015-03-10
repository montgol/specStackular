'use strict';

app.run(function ($cookies, $cookieStore) {

	var init = $cookieStore.get('Order');
	if(!init){
		$cookieStore.put('Order', []);
		console.log('starting cookie: ', $cookieStore.get('Order'));
	}

});

app.config(function ($stateProvider) {

    // Register our *products* state.
    $stateProvider.state('products', {
        url: '/products',
        controller: 'allItemsController',
        templateUrl: 'js/allitems/allitems.html'
    })

});

app.config(function ($stateProvider) {

    // Register our *men* state.
    $stateProvider.state('men', {
        url: '/products/men',
        controller: 'allItemsController',
        templateUrl: 'js/allitems/allitems.html'
    })

});

app.config(function ($stateProvider) {

    // Register our *women* state.
    $stateProvider.state('women', {
        url: '/products/women',
        // controller: 'categoryController',
        controller: function ($scope, GetItemsFactory, $state, $stateParams) {
			console.log("before", $scope.items, $state.current);
			GetItemsFactory.getItems().then(function(items){	
				$scope.items = items;
				console.log(items);
			});
		},
        templateUrl: 'js/allitems/allitems.html',
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
		var line = {itemId: specificItem._id, quantity: 1};
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


