'use strict';
app.factory('GetItemFactory', function($http){
	
	return {
		getItem: function(id){
			//var options = {email: email};
			return $http.get('/api/item/'+id).then(function(response){
				return response.data;
			})
		},

		getCategoryItems: function (category) {
			var queryParam = {};

			if (category) {
				queryParam.category[0] = category;
			}
			return $http.get('/products', {
				params: queryParam
			}).then(function(response){
				return response.data;
			});
		}

	}

})