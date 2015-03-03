app.factory('GetUserFactory', function($http){
	
	return {
		getUser: function(email){
			//var options = {email: email};
			return $http.get('/user', {data: email}).then(function(response){
				return response.data;
			})
		}
	}

})