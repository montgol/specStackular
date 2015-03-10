'use strict';
app.factory('OrderFactory', function($http){
	
	return {
		createOrder: function(data){// data should be in form {userId: user._id, items: [item: item._id, quantity: qty]}
			console.log('sending a request for a new order from factory');
			return $http.post('/api/order', data).then(function(response){
			//console.log('response from createOrder factory request', response);
				return response.data;
			})
		},
		updateOrder: function(data){ //expects orderId, itemId, and quantity (case sensative)
			return $http.post('/api/order/lineitem', data).then(function(response){
				return response.data;
			})
		},
		getOrders: function(userId){
			console.log('localhost:1337/api/order/'+userId);
			return $http.get('/api/order/'+userId).then(function(response){
				//console.log('response from getOrders factory request', response);
				return response.data;
			});
		}

}});