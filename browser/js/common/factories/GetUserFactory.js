'use strict';
app.factory('GetUserFactory', function($http){
	
	return {
		getUser: function(user){
			console.log('inside factor with: ', email);
			//var options = {email: email};
			return $http.get('/api/login/' + user.email).then(function(response){
				return response.data;
			})
		},
		authUser: function(data){
			return $http.post('/login', data).then(function(response){
				console.log("factory done")
				return response.data;
			})
		}
	}
})

// '/api/login/' + email