'use strict';
app.factory('changePWFactory', function($http){
	
	return {
		postPW: function(data){
			console.log('into the factory', data);
			// return $http.post('/api/item', data);

			return $http.post('/api/changePW', data).then(function(response){
				return response.data;
			})
		}
	}

})