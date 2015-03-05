'use strict';
app.factory('AddToOrderFactory', function($http){
	
	return {
		addItem: function(data){
			console.log('into the factory', data);
			// data should be in form {item: itemId, quantity: quantity, }

			return $http.post('/api/item/addToOrder', data).then(function(response){
				return response.data;
			})
		}
	}

})