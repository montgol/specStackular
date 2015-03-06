'use strict';

app.run(function ($cookies, $cookieStore) {

	var init = $cookieStore.get('Order');
	if(!init){
		$cookieStore.put('Order', []);
		console.log('starting cookie: ', $cookieStore.get('Order'));
	}

});

app.config(function ($stateProvider) {

    // Register our *about* state.
    $stateProvider.state('products', {
        url: '/products',
        controller: 'allItemsController',
        templateUrl: 'js/allitems/allitems.html'
    })

});

app.controller('allItemsController', function ($scope, GetItemsFactory, $state, $stateParams, $cookieStore) {

	GetItemsFactory.getItems().then(function(items, err){
		if(err) throw err;
		else{
			$scope.items = items;
		}
	});

	$scope.addToOrder = function(specificItem){
		// console.log('got into the function'); //part one always add it to the cookie
		var order = $cookieStore.get('Order');
		var resolved = false;
		var line = {item: specificItem, qty: 1};
			order.forEach(function(itemLine){
				if(itemLine.item._id === specificItem._id){
					itemLine.qty++;
					resolved = true;
				}	
			});
			if(!resolved){
				order.push(line);
			}
		// console.log('added item to order');
		$cookieStore.put('Order', order);
		// console.log('Total Order: ', $cookieStore.get('Order'));

		//part 2, check if user has logged in, and send to order db
	}
});