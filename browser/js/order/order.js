'use strict';
app.config(function ($stateProvider) {

    // Register our *orders* state.
    $stateProvider.state('orders', {
        url: '/order/:name',
        controller: 'orderController',
        templateUrl: 'js/order/order.html'
    });

});

app.controller('orderController', function ($scope, OrderFactory, $state, $stateParams, $cookieStore, AuthService) {

	//provides general functionality with an order
	//views current user order
		//order is shown by line item
		//has ability to edit order, or proceed to checkout
	$scope.activeorders=[];
	$scope.pastorders=[];
	$scope.prof;
	$scope.sum = 0;
	$scope.totalQty = 0; 
	$scope.tempVal;
	$scope.orderId;
	$scope.userId;
	
	function firstUpdate (){
	//check if user is authenticated, populate order from db, set order to cookie
		if(AuthService.isAuthenticated()){
			AuthService.getLoggedInUser().then(function(user){
			$scope.user.Id = user._id;
			$scope.user.name = user.first_name;
				OrderFactory.getOrders(user._id).then(function(items, err){
					if (err) console.log('Error: ', err);
					else if(!items) {
						console.log('No current order in DB'); //not sure what else needs to be declared.
						$scope.activeorders = $cookieStore.get('Order');
						$scope.prof = 'User';
					}
					else {
						$scope.activeorders = items.lineitems;
						$scope.orderId = items.orderId;

						var cookie = $cookieStore.get('Order');
						if(cookie){
							cookie.forEach(function(newItem){
								$scope.activeorders.push(newItem);
							});
						}
					}
				});
			});
		}
		else{
			$scope.activeorders = $cookieStore.get('Order');
			$scope.prof = 'User';
			sum();
			totalQty();
		}
	}

	firstUpdate();

	
	function serverUpdate(){

	}

	function totalQty (){
		var totalQ = 0;
		console.log('got to sum');
		$scope.activeorders.forEach(function(lineItem){
			totalQ= totalQ + lineItem.qty;
		})
		$scope.totalQty = totalQ;
	};

	$scope.removeItem = function(item){
		//remove item from db, remove item from cookie, remove item from scope
		//if authenticated, remove item from order
		var myOrderCookie = $cookieStore.get('Order');
		var location
		myOrderCookie.forEach(function(element, index){
			if(element.item.name === item.name){
				location = index;
			}
		});
		var removedItem = myOrderCookie.splice(location, 1);
		$cookieStore.put('Order', myOrderCookie);
		$scope.activeorders = myOrderCookie;
		sum();
		totalQty();

		if(AuthService.isAuthenticated()){
			OrderFactory.updateOrder({orderId: $scope.orderId, quantity: 0, itemId: Item._id}).then(function(err, data){
				if(err) console.log(err);

			})
		}
	}

	$scope.updateOrder = function(){
		//takes in information about the user, 
		OrderFactory.updateOrder();

	}; 
	$scope.newNumber = function(item, val){
		console.log('item', item, 'val', val);
	}
	//get user information and send Id

	$scope.showCookie = function(){
		console.log($cookieStore.get('Order'));
		$scope.activeorders = $cookieStore.get('Order');
	}

	$scope.deleteCookie = function(){
		$cookieStore.remove('Order');
		console.log($cookieStore.get('Order'));
		
	}
	

	function sum (){
		var total = 0;
		console.log('got to sum');
		$scope.activeorders.forEach(function(lineItem){
			total= total + lineItem.item.price * lineItem.qty;
		})
		$scope.sum = total;
	};
	
});