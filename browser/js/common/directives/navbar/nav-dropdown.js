'use strict';
app.directive('navDropdown', function () {
    return {
        restrict: 'E',
        scope: {
            items: '='
        },
        templateUrl: 'js/common/directives/navbar/nav-dropdown.html',
        //controller: 'dropdownController'
    };
});

//app.controller('dropdownController', function ($scope) {
//    $scope.menVisible = true;
//    $scope.womenVisible = true;
//    $scope.toggleVisible = function(){
//        if (!$scope.menVisible) $scope.menVisible = false;
//        else $scope.menVisible = true;
//    }
//});