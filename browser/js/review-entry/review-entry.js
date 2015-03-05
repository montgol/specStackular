app.config(function ($stateProvider) {

    // Register our *Review Entry* state.
    $stateProvider.state('review-entry', {
        url: ':item/review-entry',
        controller: 'reviewEntryController',
        templateUrl: 'js/review-entry/review-entry.html'
    });

});

app.controller('reviewEntryController', function($scope, $state, $stateParams) {
    console.log($stateParams.item.name);
});