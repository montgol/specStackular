'use strict';
app.config(function ($stateProvider) {

    // Register our *about* state.
    $stateProvider.state('products', {
        url: '/products',
        controller: 'allItemsController',
        templateUrl: 'js/allitems/allitems.html'
    })

});

app.controller('allItemsController', function ($scope, GetItemsFactory, $state, $stateParams) {

	GetItemsFactory.getItems().then(function(items, err){
		if(err) throw err;
		else{
			$scope.items = items;
		}
	});
});