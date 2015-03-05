app.config(function ($stateProvider) {

    // Register our *Review Entry* state.
    $stateProvider.state('review-entry', {
        url: ':item/review-entry',
        controller: function($scope, $state, $stateParams) {
            console.log($stateParams);},
        templateUrl: 'js/review-entry/review-entry.html',
    });

});

