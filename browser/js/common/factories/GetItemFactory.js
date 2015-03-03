'use strict';
app.factory('GetItemFactory', function($http){
	
	return {
		getItem: function(id){
			//var options = {email: email};
			return $http.get('/api/item:'+id, {params: {}}).then(function(response){
				return response.data;
			})
		}
	}

})