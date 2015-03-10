'use strict';
app.factory('stripeFactory', function($http){
	
	return {
		sendKey: function(id){
			//var options = {email: email};
			return $http.put('/api/stripeKey/'+id).then(function(response){
				return response.data;
			})
		},
	}
})