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

// app.config(function ($stateProvider) {

//     // Register our *men* state.
//     $stateProvider.state('men', {
//         url: '/products/men',
//         controller: 'allItemsController',
//         templateUrl: 'js/allitems/allitems.html'
//     })

// });

// app.config(function ($stateProvider) {

//     // Register our *women* state.
//     $stateProvider.state('women', {
//         url: '/products/women',
//         // controller: 'categoryController',
//         controller: function ($scope, GetItemsFactory, $state, $stateParams) {
// 			console.log("before", $scope.items, $state.current);
// 			GetItemsFactory.getItems().then(function(items){	
// 				$scope.items = items;
// 				console.log(items);
// 			});
// 		},
//         templateUrl: 'js/allitems/allitems.html',
//     })
// });


app.controller('allItemsController', function ($scope, AuthService, GetItemsFactory, $state, $stateParams, $cookieStore, OrderFactory) {

	GetItemsFactory.getItems().then(function(items, err){
		if(err) throw err;
		else{
			$scope.items = items;
		}
	});


	$scope.addToOrder = function(specificItem){
		console.log('got into the function'); //part one always add it to the cookie
		var order = $cookieStore.get('Order');
		var resolved = false;
		var line = {itemId: specificItem._id, quantity: 1};
		// console.log('Request to add item to order');
			if(order){ //if user has an order on a cookie
				order.forEach(function(itemLine){
					if(itemLine.itemId === specificItem.itemId){
						itemLine.qty++;
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
		$cookieStore.put('Order', order);
		var user = AuthService.getLoggedInUser();
		if(user){
			//OrderFactory.getOrders(user._id)//
		}
		

		//part 2, check if user has logged in, and send to order db
	}
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





