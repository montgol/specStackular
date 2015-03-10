'use strict';
app.factory('GetItemFactory', function($http){
	
	return {
		getItem: function(id){
			//var options = {email: email};
			console.log(id);
			return $http.get('/api/item/'+id).then(function(response){
				return response.data;
			})
		},

		// getCategoryItems: function () {
		// 	console.log("GetItemFactory: getCategoryItems", category);
		// 	return $http.get('/api/item/'+ category).then(function(response){
		// 		return response.data;
		// 	});
		// },

	}
})