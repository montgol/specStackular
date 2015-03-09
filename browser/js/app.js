'use strict';
// var app = angular.module('FullstackGeneratedApp', ['ui.router', 'fsaPreBuilt']);
var app = angular.module('specStackular', ['ui.router', 'fsaPreBuilt']);
app.controller('MainController', function ($scope) {

    // Given to the <navbar> directive to show the menu.
    $scope.menuItems = [
        { label: 'Men', state: 'men' },
        { label: 'Women', state: 'women' },
        { label: 'Join us', state: 'join' },
        { label: 'Log In', state: 'login'}

    ];

    // Dropdown controls
    $scope.menVisible = false;
    $scope.womenVisible = true;

    $scope.hello = "well hello";

    $scope.toggleMenVisible = function(){
        console.log("clicked");
        if ($scope.menVisible === false) {
            $scope.menVisible = true;
            console.log("Wahoo")
        }

        else $scope.menVisible = false;

    }

});


app.config(function ($urlRouterProvider, $locationProvider) {
    // This turns off hashbang urls (/#about) and changes it to something normal (/about)
    $locationProvider.html5Mode(true);
    // If we go to a URL that ui-router doesn't have registered, go to the "/" url.
    $urlRouterProvider.otherwise('/');
});