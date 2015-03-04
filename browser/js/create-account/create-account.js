app.config(function ($stateProvider) {

    // Register our *Join Now* state.
    $stateProvider.state('create-account', {
        url: '/create-account',
        //controller: 'joinController',
        templateUrl: 'js/create-account/create-account.html'
    });

});