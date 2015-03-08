'use strict';
app.config(function ($stateProvider) {

    // Register our *about* state.
    $stateProvider.state('item', {
        url: '/item/:name',
        controller: 'itemController',
        templateUrl: 'js/item/item.html'
    });

});

app.controller('itemController', function ($scope, GetItemFactory, $state, $stateParams, $cookiestore) {

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

	$scope.addToOrder = function(){
		var order = $cookiestore.get('Order');
		var line = {item: $scope.item, qty: 1};
			if(!order){
				$cookiestore.put('Order', line);
			}
			else{
				order.push(line);
				$cookiestore.put('Order', order);
			}
	}
});