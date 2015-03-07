'use strict';
app.config(function ($stateProvider) {

    
    $stateProvider.state('admin.orderModify', {
        url: '/orderModify',
        templateUrl: 'js/orderModify/orderModify.html',
        controller: 'orderModifyController',
        resolve: {
        	getOrders:  function($http){
        			return $http.get('/api/admin/order')
        				.then(function(response){
        					var userIDArray = []
        					for (var a=0, len=response.data.length; a<len; a++){
        						userIDArray.unshift(response.data[a].userId)
        					}
							return $http.post('api/admin/order', {data: userIDArray})
								.then(function (users) {
									for (var b=users.data.length; b>0; b--) {
										response.data[b].user = users.data[b]

									} console.log(response.data)
									return response.data
								});
					})
                 //   return $http({method: 'GET', url: '/someUrl'})
               		// .then (function (data) {
                 //   return doSomeStuffFirst(data);
     //           },
     //        getUser: function ($http) {
     //        	return $http.get('/api/admin/order/user')
     //    			.then(function(response){
					// 	return response.data;
					// })
            }
            }
        })
    });


// return $http.get('/api/admin/order').then(function(response){
// 				return response.data;
// 			})

app.controller('orderModifyController', 
	function ($scope, orderModifyFactory, $state, $stateParams, $rootScope, getOrders) {

	$scope.item = {
		categories: [] };
	$scope.success;

	$scope.data = getOrders

	$scope.menuItems = [
		{ label: 'all orders'},
        { label: 'open'},
        { label: 'placed'},
        { label: 'shipped'},
        { label: 'complete'}
    ];

	$scope.getAllOrders = function() {
		//$scope.item.categories = $scope.item.categories.split(' ');
		console.log('process started');
		orderModifyFactory.getAllOrders().then(function(item, err){
			if(err) $scope.success= false;
			else{
				console.log(item);
				$scope.item = item
				$scope.success = true;
				
			}
		});
	}
	$scope.changeStatus = function () {

	}
});