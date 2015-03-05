'use strict';
app.config(function ($stateProvider) {

    // Register our *about* state.
    $stateProvider.state('userModify', {
        url: '/modify/user',
        controller: 'userModifyController',
        templateUrl: 'js/admin/admin.html'
    });

    $stateProvider.state('userModify.success', {
        url: '/modify/user/success',
        controller: 'userModifyController',
        templateUrl: 'js/admin/adminSuccess.html'
    });

    $stateProvider.state('userModify.failure', {
        url: '/modify/user/failure',
        controller: 'userModifyController',
        templateUrl: 'js/admin/adminFail.html'
    });

});

app.controller('userModifyController', function ($scope, changePWFactory, $state, $stateParams) {

    
    $scope.submit = {
        password: '',
        email: '',
        makeAdmin: false
    }
    $scope.success;


    $scope.changePW = function() {
        changePWFactory.postPW($scope.submit).then(function(user, err){
            $scope.submit = {}
            if(err) {
                $scope.success= false;
                console.log('changing state')
                $state.go('userModify.failure');
            }
            else{
                console.log($scope.submit);
                $scope.success = true;
                $state.go('tutorial', {});
            }
        });
    }  
});