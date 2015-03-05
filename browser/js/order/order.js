'use strict';
app.config(function ($stateProvider) {

    // Register our *about* state.
    $stateProvider.state('order', {
        url: '/order/:name',
        controller: 'orderController',
        templateUrl: 'js/order/order.html'
    });

});

app.controller('itemController', function ($scope, AddToOrderFactory, $state, $stateParams) {

	//provides general functionality with an order
	//views current user order
		//order is shown by line item
		//has ability to edit order, or proceed to checkout
	$scope.order;

	$scope.updateOrder = function(){
		//takes in information about the user, 
		UpdateOrderFactory.updateOrder()

	} 
	//get user information and send Id
	GetOrderFactory.getOrder().then(function(items, err){
		if (err) console.log('Error: ', err);

		else if(!items) {
			console.log('No current order'); //not sure what else needs to be declared.
		}
		else {
			$scope.order = items;
		}
	})
	//get order information and modify or remove line item
	ModifyOrderFactory.changeOrder().then


	AddToOrderFactory.addItem($stateParams.name).then(function(item, err){
		if(err) $state.go('home');
		else{
			$scope.item = item[0];
			}
		
	});
});