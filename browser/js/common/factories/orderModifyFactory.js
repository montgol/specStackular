'use strict';
app.factory('orderModifyFactory', function ($http){
	
	return {
		filterOrders: function (status, allOrders) {
			if (status === 'all orders') {
				return allOrders
			}
			var filteredArray = [];
			for (var a=0, len=allOrders.length; a<len; a++) {
				if (allOrders[a].status === status) {
					filteredArray.push(allOrders[a])
				}
			}
			return filteredArray
		},
		modifyOrder: function(data){
			console.log('into the factory', data);
			// return $http.post('/api/item', data);

			return $http.put('/api/admin/order', data).then(function(response){
				return response.data;
			})
		},
		getAllOrders: function(){
			console.log('into the factory');
			// return $http.post('/api/item', data);

			return $http.get('/api/admin/order').then(function(response){
				return response.data;
			})
		},
		changeOrderStatus: function ( ) {
			return $http.put('/api/admin/order').then(function(response){
				return response.data;
			})	
		}
		// getUserOrdersByEmail: function () {
		// 	return $http.post('/api/admin/order').then(function(response){
		// 		return response.data;
		// 	})
		// }
	}

})