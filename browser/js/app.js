'use strict';
// var app = angular.module('FullstackGeneratedApp', ['ui.router', 'fsaPreBuilt']);
var app = angular.module('specStackular', ['ui.router', 'fsaPreBuilt', 'ngCookies']);
app.controller('MainController', function ($scope, $rootScope) {

    // Given to the <navbar> directive to show the menu.
    $scope.menuItems = [
        { label: 'Men', state: 'men' },
        { label: 'Women', state: 'women' },
        { label: 'Join us', state: 'join' },
        { label: 'Log In', state: 'login'},
        { label: 'Product list', state: 'products' },
        { label: 'My Orders', state: 'orders'}
    ];
    $scope.adminItems= [
        { label: 'Create product', state: 'admin.itemCreate' },
        { label: 'Modify User', state: 'admin.userModify'},
        { label: 'Modify Order', state: 'admin.orderModify'},
        { label: 'Create Product Cat Pg', state: 'admin.productCatCreate'}
    ]





});


app.config(function ($urlRouterProvider, $locationProvider) {
    // This turns off hashbang urls (/#about) and changes it to something normal (/about)
    $locationProvider.html5Mode(true);
    // If we go to a URL that ui-router doesn't have registered, go to the "/" url.
    $urlRouterProvider.otherwise('/');
});
