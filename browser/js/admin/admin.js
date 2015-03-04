'use strict';
app.config(function ($stateProvider) {

    // Register our *about* state.
    $stateProvider.state('userModify', {
        url: '/modify/user',
        controller: 'userModifyController',
        templateUrl: 'js/admin/admin.html'
    });

});

app.controller('userModifyController', function ($scope, changePWFactory, $state, $stateParams) {

    
    $scope.submit = {
        password: '',
        email: ''
    }
    $scope.success;


    $scope.changePW = function() {
        changePWFactory.postPW($scope.submit).then(function(item, err){
            if(err) $scope.success= false;
            else{
                console.log(item);
                $scope.success = true;
            }
        });
    }
    //submit function for radio button that gives admin priveliges.  
});