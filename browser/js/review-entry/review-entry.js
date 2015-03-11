app.config(function ($stateProvider) {

    // Register our *Review Entry* state.
    $stateProvider.state('review-entry', {
        url: '/review-entry',
        controller: function($scope, CreateReview, $state, $stateParams) {
            // $scope.productname = $stateParams.name;
            // $scope.producturl = $stateParams.url;
            console.log("in conroller");

            $scope.newReview = function () {
            	console.log("inside newReview", $scope, item);
            	var info = $scope.productname;
            	CreateReview.submitReview(info).then(function(user, err){
	    					if (err) $scope.success = false;
	    						else{
                    $state.go('products');
              	}
	    				})
	   				};
         },
        templateUrl: 'js/review-entry/review-entry.html'
    })

});


