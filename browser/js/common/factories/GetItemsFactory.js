app.factory('GetItemsFactory', function($http){
	
	return {
		getItems: function(){
			//var options = {email: email};
			return $http.get('/itemlist').then(function(response){
				return response.data;
			})
		}
	}

})