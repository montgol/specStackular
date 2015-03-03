'use strict';
app.factory('CreateUserFactory', function($http){
	
	return {
		postUser: function(data){
			//var options = {email: email};
			return $http.post('/api/user', data).then(function(response){
				return response.data;
			})
		}
	}
})