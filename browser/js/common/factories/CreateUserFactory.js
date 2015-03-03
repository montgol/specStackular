app.factory('CreateUserFactory', function($http){
	
	return {
		postUser: function(data){
			//var options = {email: email};
			return $http.post('/user', data).then(function(response){
				return response.data;
			})
		}
	}
})