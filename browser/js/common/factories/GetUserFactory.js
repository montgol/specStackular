'use strict';
app.factory('GetUserFactory', function($http){
	
	return {
		getUser: function(email){
			console.log('inside factor with: ', email);
			//var options = {email: email};
			return $http.get('/api/login/' + email).then(function(response){
				return response.data;
			})
		}
	}
})