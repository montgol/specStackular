app.config(function ($stateProvider) {

    // Register our *Join Now* state.
    $stateProvider.state('join', {
        url: '/join',
        //controller: 'joinController',
        templateUrl: 'js/joinnow/joinnow.html'
    });

    $stateProvider

});