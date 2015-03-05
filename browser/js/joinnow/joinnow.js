app.config(function ($stateProvider) {

    // Register our *Join Now* state.
    $stateProvider.state('join', {
        url: '/join',
        controller: 'joinController',
        templateUrl: 'js/joinnow/joinnow.html'
    });

    $stateProvider

});

app.controller('joinController', function($scope, $window) {
    $scope.loginoauth = function (provider) {
        var location = 'auth/' + provider;
        $window.location.href = location;
    }
})