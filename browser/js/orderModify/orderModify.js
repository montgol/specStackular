'use strict';
app.config(function ($stateProvider) {

    
    $stateProvider.state('admin.orderModify', {
        url: '/orderModify',
        templateUrl: 'js/orderModify/orderModify.html',
        controller: 'orderModifyController',
        resolve: {
        	getOrders:  function($http){
        			// var orderObject = {}
        			return $http.get('/api/admin/order')
        				.then(function(response){
        					return response.data
        					})
        			}
        		}
   	})
});

app.controller('orderModifyController', 
	function ($scope, orderModifyFactory, $state, $stateParams, $rootScope, getOrders) {

	$scope.item = {
		categories: [] };
	$scope.success;

	$scope.allOrders = getOrders

	$scope.orders;

	$scope.menuItems = [
		{ label: 'all orders'},
        { label: 'open'},
        { label: 'placed'},
        { label: 'shipped'},
        { label: 'complete'}
    ];

	$scope.filterOrders = function(status) {
		$scope.orders = orderModifyFactory.filterOrders(status, $scope.allOrders)

		$scope.filtered = false;
	}
});