'use strict';
app.factory('stripeFactory', function($http){
	
	return {
		sendKey: function(id, orderId){
			console.log('++++++++++++++++++', orderId);
			return $http.put('/api/stripeKey/'+ id +'/'+orderId).then(function(response) {

				return response.data;
			})
		}
	}
})