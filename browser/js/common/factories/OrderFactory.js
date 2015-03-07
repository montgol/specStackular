'use strict';
app.factory('OrderFactory', function($http){
	
	return {
		createOrder: function(data){// data should be in form {userId: user._id, items: [item: item._id, qty: qty]}
			return $http.post('/api/order', data).then(function(response){
				return response.data;
			})
		},
		updateOrder: function(data){ //expects orderId, itemId, and quantity (case sensative)
			return $http.post('/api/order/lineitem', data).then(function(response){
				return response.data;
			})
		},
		getOrders: function(userId){
			return $http.get('/api/order/'+userId).then(function(response){
				return response.data;
			});
		}

}});