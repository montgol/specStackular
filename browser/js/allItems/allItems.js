'use strict';
app.config(function ($stateProvider) {

    // Register our *about* state.
    $stateProvider.state('products', {
        url: '/products',
        controller: 'allItemsController',
        templateUrl: 'js/allitems/allitems.html'
    })

});

app.config(function ($stateProvider) {

    // Register our *about* state.
    $stateProvider.state('men', {
        url: '/products/men',
        controller: 'allItemsController',
        templateUrl: 'js/allitems/allitems.html'
    })

});

app.config(function ($stateProvider) {

    // Register our *about* state.
    $stateProvider.state('women', {
        url: '/products/women',
        // controller: 'categoryController',
        controller: function ($scope, GetItemsFactory, $state, $stateParams) {
        							console.log("before", $scope.items, $state.current);
        								GetItemsFactory.getItems().then(function(items){	
												
													$scope.items = items;
													console.log(items);
							
												});
										
											// $scope.categoryMatch = function (item) {
											// 	return $scope.items.category[0] == $state.current.name;
											// };
				},
        templateUrl: 'js/allitems/allitems.html',
        // resolve: {
        // 	theProducts: function(items) {
        // 		return GetItemsFactory.getItems().then(function(items) {
        // 			return $scope.items = items;
        // 		})
        // 	}
        // }
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

app.controller('categoryController', function ($scope, GetItemsFactory, $state, $stateParams) {

	$scope.getCategory = function (category){
		console.log("men controller", category);
			GetItemFactory.getCategoryItems().then(function(items, err){
					if(err) throw err;
						else{
							$scope.items = items;
					};
			});
	};
});






