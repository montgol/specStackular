app.factory('GetItemFactory', function($http){
	
	return {
		getId: function(id){
			//var options = {email: email};
			return $http.get('/item:'+id, {params: {}}).then(function(response){
				return response.data;
			})
		}
	}

})