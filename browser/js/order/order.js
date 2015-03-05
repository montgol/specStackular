'use strict';
app.config(function ($stateProvider) {

    // Register our *about* state.
    $stateProvider.state('orders', {
        url: '/order/:name',
        controller: 'orderController',
        templateUrl: 'js/order/order.html'
    });

});

app.controller('orderController', function ($scope, OrderFactory, $state, $stateParams) {

	//provides general functionality with an order
	//views current user order
		//order is shown by line item
		//has ability to edit order, or proceed to checkout
	$scope.activeorders=[];
	$scope.pastorders=[];
	$scope.summary;
	$scope.sum = function(){

	}

	$scope.updateOrder = function(){
		//takes in information about the user, 
		OrderFactory.updateOrder()

	} 
	//get user information and send Id
	OrderFactory.getOrders().then(function(items, err){
		if (err) console.log('Error: ', err);

		else if(!items) {
			console.log('No current order'); //not sure what else needs to be declared.
		}
		else {
			$scope.summary = items.info;
			item.lineItems.forEach(function(thing){
				if(thing.info.status == 'open'){
					$scope.activeorders.push(thing);
				}
				else {
					$scope.pastorders.push(thing);
				}
			});	
		}
	})
	
});