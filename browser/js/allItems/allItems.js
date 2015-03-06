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
    });

});

app.controller('allItemsController', function ($scope, GetItemsFactory, $state, $stateParams, $cookieStore) {

	GetItemsFactory.getItems().then(function(items, err){
		if(err) throw err;
		else{
			$scope.items = items;
		}
	});

	$scope.addToOrder = function(specificItem){
		console.log('got into the function');
		// $cookieStore.remove('Order');
		var order = $cookieStore.get('Order');
		var line = {item: specificItem, qty: 1};
			console.log('added item to order');
			order.push(line);
			$cookieStore.put('Order', order);
		console.log('Total Order: ', $cookieStore.get('Order'));
	}
});