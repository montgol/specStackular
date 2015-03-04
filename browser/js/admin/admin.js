'use strict';
app.config(function ($stateProvider) {

    // Register our *about* state.
    $stateProvider.state('userModify', {
        url: '/modify/user',
        controller: 'userModifyController',
        templateUrl: 'js/itemCreate/itemCreate.html'
    });

});

app.controller('userModifyController', function ($scope, CreateItemFactory, $state, $stateParams) {

    $scope.item = {
        categories: [] };
    $scope.success;

    $scope.submitItem = function() {
        //$scope.item.categories = $scope.item.categories.split(' ');
        console.log('process started');
        console.log($scope.item);
        CreateItemFactory.postItem($scope.item).then(function(item, err){
            if(err) $scope.success= false;
            else{
                console.log(item);
                $scope.success = true;
            }
        });
    }
});