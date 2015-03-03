'use strict';
app.factory('CreateItemFactory', function($http){
	
	return {
		postItem: function(data){
			//var options = {email: email};
			return $http.post('/item', data).then(function(response){
				return response.data;
			})
		}
	}

})