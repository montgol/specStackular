'use strict';
app.config(function ($stateProvider) {

    // Register our *about* state.
    $stateProvider.state('item', {
        url: '/item/:item',
        controller: 'itemController',
        templateUrl: 'js/item/item.html'
    });

});

app.controller('itemController', function ($scope, GetItemFactory, $state, $stateParams) {

	//get input from user about item (id from url )
	//check id vs database
	//if not found, redirect to search page
	//if found send tempalateUrl


	GetItemFactory.getItem($stateParams.item).then(function(item, err){
		if(err) $state.go('home');
		else{
			$scope.item = item;
			}
		
	});
});