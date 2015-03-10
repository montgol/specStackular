'use strict';
// var app = angular.module('FullstackGeneratedApp', ['ui.router', 'fsaPreBuilt']);

var app = angular.module('specStackular', ['ui.router', 'fsaPreBuilt', 'ngCookies']);
app.controller('MainController', function ($scope, $rootScope) {

    // Given to the <navbar> directive to show the menu.
    $scope.menuItems = [
        { label: 'Men', state: 'products' },
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

'use strict';
app.config(function ($stateProvider) {

    // Register our *about* state.
    $stateProvider.state('about', {
        url: '/about',
        controller: 'AboutController',
        templateUrl: 'js/about/about.html'
    });

});

app.controller('AboutController', function ($scope) {

    // Images of beautiful Fullstack people.
    $scope.images = [
        'https://pbs.twimg.com/media/B7gBXulCAAAXQcE.jpg:large',
        'https://fbcdn-sphotos-c-a.akamaihd.net/hphotos-ak-xap1/t31.0-8/10862451_10205622990359241_8027168843312841137_o.jpg',
        'https://pbs.twimg.com/media/B-LKUshIgAEy9SK.jpg',
        'https://pbs.twimg.com/media/B79-X7oCMAAkw7y.jpg',
        'https://pbs.twimg.com/media/B-Uj9COIIAIFAh0.jpg:large',
        'https://pbs.twimg.com/media/B6yIyFiCEAAql12.jpg:large'
    ];

});
'use strict';
app.config(function ($stateProvider) {

    
    $stateProvider.state('admin', {
        url: '/admin',
        templateUrl: 'js/admin/admin.html'
    });

});


'use strict';
app.controller('AdminController', function ($scope) {

    // Given to the <navbar> directive to show the menu.
    $scope.menuItems = [
        { label: 'Home', state: 'home' },
        { label: 'Create Item', state: 'itemCreate' },
        { label: 'Modify User', state: 'userModify' }
    ];

});

app.directive('adminNavbar', function () {
    return {
        restrict: 'E',
        scope: {
          items: '='
        },
        templateUrl: 'js/common/directives/navbar/navbar.html'
    };
});
'use strict';

app.run(function ($cookies, $cookieStore) {

	var init = $cookieStore.get('Order');
	if(!init){
		$cookieStore.put('Order', []);
		console.log('starting cookie: ', $cookieStore.get('Order'));
	}

});

app.config(function ($stateProvider) {



    $stateProvider.state('products', {
        url: '/products',
        controller: 'allItemsController',
        templateUrl: 'js/allitems/allitems.html'
    })

});

// app.config(function ($stateProvider) {

//     // Register our *men* state.
//     $stateProvider.state('men', {
//         url: '/products/men',
//         controller: 'allItemsController',
//         templateUrl: 'js/allitems/allitems.html'
//     })

// });

// app.config(function ($stateProvider) {

//     // Register our *women* state.
//     $stateProvider.state('women', {
//         url: '/products/women',
//         // controller: 'categoryController',
//         controller: function ($scope, GetItemsFactory, $state, $stateParams) {
// 			console.log("before", $scope.items, $state.current);
// 			GetItemsFactory.getItems().then(function(items){	
// 				$scope.items = items;
// 				console.log(items);
// 			});
// 		},
//         templateUrl: 'js/allitems/allitems.html',
//     })
// });


app.controller('allItemsController', function ($scope, AuthService, GetItemsFactory, $state, $stateParams, $cookieStore, OrderFactory) {

	GetItemsFactory.getItems().then(function(items, err){
		if(err) throw err;
		else{
			$scope.items = items;
		}
	});


	$scope.addToOrder = function(specificItem){
		console.log('got into the addToOrder function'); //part one always add it to the cookie
		var order = $cookieStore.get('Order');
		var resolved = false;
		var line = {itemId: specificItem._id, quantity: 1};
		 console.log('order', order);
			if(order){ //if user has an order on a cookie
 
				order.forEach(function(itemLine){
					if(itemLine.itemId === specificItem._id){
						itemLine.quantity++;
						resolved = true;
					}	
				});
				if(!resolved){
					order.push(line);
				}
			}
			else{
				order.push(line);
			}


		$cookieStore.put('Order', order);

		// var user = AuthService.getLoggedInUser();
		// if(user){
		// 	//OrderFactory.getOrders(user._id)//
		// }
	}
});



app.controller('categoryController', function ($scope, GetItemsFactory, $state, $stateParams) {

	$scope.getCategory = function (category){
		console.log("men controller", category);
			GetItemFactory.getCategoryItems().then(function(items, err){
					if(err) throw err;
						else{
							$scope.items = items;
					};
			});
	};
});



(function () {

    'use strict';

    // Hope you didn't forget Angular! Duh-doy.
    if (!window.angular) throw new Error('I can\'t find Angular!');

    var app = angular.module('fsaPreBuilt', []);

    app.factory('Socket', function ($location) {

        if (!window.io) throw new Error('socket.io not found!');

        var socket;

        if ($location.$$port) {
            socket = io('http://localhost:1337');
        } else {
            socket = io('/');
        }

        return socket;

    });

    app.constant('AUTH_EVENTS', {
        loginSuccess: 'auth-login-success',
        loginFailed: 'auth-login-failed',
        logoutSuccess: 'auth-logout-success',
        sessionTimeout: 'auth-session-timeout',
        notAuthenticated: 'auth-not-authenticated',
        notAuthorized: 'auth-not-authorized'
    });

    app.config(function ($httpProvider) {
        $httpProvider.interceptors.push([
            '$injector',
            function ($injector) {
                return $injector.get('AuthInterceptor');
            }
        ]);
    });

    app.factory('AuthInterceptor', function ($rootScope, $q, AUTH_EVENTS) {
        var statusDict = {
            401: AUTH_EVENTS.notAuthenticated,
            403: AUTH_EVENTS.notAuthorized,
            419: AUTH_EVENTS.sessionTimeout,
            440: AUTH_EVENTS.sessionTimeout
        };
        return {
            responseError: function (response) {
                $rootScope.$broadcast(statusDict[response.status], response);
                return $q.reject(response);
            }
        };
    });

    app.service('AuthService', function ($http, Session, $rootScope, AUTH_EVENTS, $q) {

        var onSuccessfulLogin = function (response) {
            var data = response.data;
            Session.create(data.id, data.user);
            $rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
            return data.user;
        };

        this.getLoggedInUser = function () {

            if (this.isAuthenticated()) {
                return $q.when({ user: Session.user });
            }

            return $http.get('/session').then(onSuccessfulLogin).catch(function () {
                return null;
            });

        };

        this.login = function (credentials) {
            console.log(credentials);
            return $http.post('/login', credentials).then(onSuccessfulLogin);
        };

        this.logout = function () {
            return $http.get('/logout').then(function () {
                Session.destroy();
                $rootScope.$broadcast(AUTH_EVENTS.logoutSuccess);
            });
        };

        this.isAuthenticated = function () {
            return !!Session.user;
        };

    });

    app.service('Session', function ($rootScope, AUTH_EVENTS) {

        $rootScope.$on(AUTH_EVENTS.notAuthenticated, this.destroy);
        $rootScope.$on(AUTH_EVENTS.sessionTimeout, this.destroy);

        this.create = function (sessionId, user) {
            this.id = sessionId;
            this.user = user;
        };

        this.destroy = function () {
            this.id = null;
            this.user = null;
        };

    });

})();
'use strict';
app.config(function ($stateProvider) {

    $stateProvider.state('home', {
        url: '/',
        controller: 'HomeCtrl',
        templateUrl: 'js/home/home.html'
    });

});

app.controller('HomeCtrl', function ($scope) {
});
app.controller('productreviewscontroller', function($scope){
    $scope.rate1 = 0;

    $scope.rate2 = 6;

    $scope.reviewslist = [
        {
            rating: 5,
            text: "These are quite simply the best glasses, nay the best ANYTHING I've ever owned! " +
            "When I put them on, an energy beam shoots out of my eyeballs that makes everything I look at " +
            "burst into flames!! My girlfriend doesn't appreciate it, though."
        },
        {
            rating: 1,
            text: "These glasses are the worst! Who made these? When I opened the package they sprung out and sucked " +
            "onto my face like the monster in ALIEN! I had to beat myself in the head with a shovel to get them off! " +
            "Who ARE you people? What is wrong with you? Have you no dignity? Don't you understand what eyeglasses are " +
            "FOR?"
        },
        {
            rating: 4,
            text: "The glasses are just OK — to spice things up I chopped up some scallions and added some heavy cream, a pinch of tartar, " +
            "some anchovy paste, basil and a half pint of maple syrup. The glass in the glasses still came out crunchy though. " +
            "I'm thinking of running them through a mixmulcher next time before throwing everything in the oven."
        }
    ]
})
app

    .constant('ratingConfig', {
        max: 5,
    })

    .directive('reviewstar', ['ratingConfig', function(ratingConfig) {
        return {
            restrict: 'EA',
            replace: true,
            scope: {
                value: '='
            },
            controller: "productreviewscontroller",
            template: '<div id="showme" ng-mouseleave="reset()"><i id="showme" ng-repeat="number in range" ' +
                'ng-mouseenter="enter(number)" ng-click="assign(number)" ' +
                'ng-class="{\'glyphicon glyphicon-star icon-gold\': number <= val, ' +
                '\'glyphicon glyphicon-star icon-gray\': number > val}"></i></div>',
            link: function(scope, element, attrs, index) {
                var maxRange = angular.isDefined(attrs.max) ? scope.$eval(attrs.max) : ratingConfig.max;
                scope.range = [];
                for(var i = 1; i <= maxRange; i++ ) {
                    scope.range.push(i);
                };

                scope.val = scope.value;

                //console.log(scope);


            }
        };
    }]);

app.controller('productstar', function($scope) {

    $scope.rate1 = 0;

    $scope.rate2 = 6;

    $scope.val = $scope.rating;

});
'use strict';

app.run(function ($cookies, $cookieStore) {

	var init = $cookieStore.get('Order');
	if(!init){
		$cookieStore.put('Order', []);
		console.log('starting cookie: ', $cookieStore.get('Order'));
	}

});

app.config(function ($stateProvider) {

    // Register our *item* state.
    $stateProvider.state('item', {
        url: '/item/:name',
        controller: 'itemController',
        templateUrl: 'js/item/item.html'
    });

});

app.controller('itemController', function ($scope, GetItemFactory, $state, $stateParams, $cookieStore, AuthService, OrderFactory ) {

	//get input from user about item (id from url )
	//check id vs database
	//if not found, redirect to search page
	//if found send tempalateUrl

	GetItemFactory.getItem($stateParams.name).then(function(item, err){
		if(err) $state.go('home');
		else{
			$scope.item = item[0];
			}
	});

	$scope.addToOrder = function(){
		
		AuthService.isAuthenticated().then(function(answer){
			var order = $cookies.get('Order');
			var line = {item: $scope.item, quantity: 1};
			if(!order){
				$cookies.put('Order', line);
			}
			else{
				order.push(line);
				$cookies.put('Order', order);
			}

			if(answer){
				OrderFactory.addItem()
			}
		})
	}
});
'use strict';
app.config(function ($stateProvider) {

    // Register our *itemCreate* state.
    $stateProvider.state('admin.itemCreate', {
        url: '/itemCreate',
        controller: 'itemCreateController',
        templateUrl: 'js/itemCreate/itemCreate.html',
        resolve: {
        	getItems:  function($http){
        		return $http.get('/api/itemlist').then(function (response){
					return response.data;
        			})
        		}
        	}
    });

});

app.controller('itemCreateController', function ($scope, CreateItemFactory, getItems, $state, $stateParams) {

	$scope.item;
	$scope.success;

	$scope.menuItems = [
		{ label: 'all items'},
        { label: 'mens'},
        { label: 'womens'},
        { label: 'kids'},
        { label: 'pets'}
    ];

	$scope.allItems = getItems

	$scope.items = $scope.allItems

	$scope.filterItems = function (category) {
		if (category = 'all items') {
			return $scope.items = $scope.allItems
		}
	}

	console.log($scope.items[0].available)

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
app.config(function ($stateProvider) {

    // Register our *Join Now* state.
    $stateProvider.state('join', {
        url: '/join',
        controller: 'joinController',

        templateUrl: 'js/joinnow/joinnow.html' 

    });

});



app.controller('joinController', function($scope, $window, CreateUserFactory, AuthService) {

    $scope.loginoauth = function (provider) {
        var location = 'auth/' + provider;
        $window.location.href = location;
    }

    $scope.success;


    $scope.submitUser = function() {
    	console.log("user submit process started");
    	console.log($scope.user);
	    CreateUserFactory.postUser($scope.user).then(function(user, err){
	    	if (err) $scope.success=false;
	    	else{
                AuthService.login(user).then(function(conclusion){
                    console.log(user);
                    $scope.success = true;
                });
	    	}
	    });
	  }

      function validatePassword (email){
        regex = /^([\w-\.]+@(?!gmail.com)(?!yahoo.com)(?!hotmail.com)([\w-]+\.)+[\w-]{2,4})?$/;
        return regex.test(email);
      }

});


app.config(function ($stateProvider) {

    // Register our *Join Now* state.
    $stateProvider.state('login', {
        url: '/login',
        controller: 'loginController',
        templateUrl: 'js/login/login.html' 
    });

});


app.controller('loginController', function ($scope, $window, AuthService, $state, Session, $rootScope) {
    $scope.loginoauth = function (provider) {
        var location = 'auth/' + provider;
        $window.location.href = location;
    }
    $scope.success;
    $scope.submitUser = function() {
        var info = $scope.user;
        console.log("user login process started with: ", info);
        AuthService.login(info).then(function(info){
            console.log("controller", info);
                if (info.admin) {
                    $state.go('admin')
                } else {
                    $state.go('products')
                }
        });
    // this is just testing sessions started
    $scope.isLoggedIn = AuthService.isAuthenticated();
    // end test



        // GetUserFactory.authUser(info).then(function(user, err){
        //     if(err) $scope.success = false;
        //     else {
        //         $rootScope.success = false;
        //         console.log($rootScope.currentUser)
        //         if (user[0].admin) {
        //             $state.go('admin')
        //         } else {
        //             $state.go('home')
        //         }
        //     }
        // })      

    };
});

'use strict';
app.config(function ($stateProvider) {

    // Register our *orders* state.
    $stateProvider.state('orders', {
        url: '/order/:name',
        controller: 'orderController',
        templateUrl: 'js/order/order.html'
    });

});

app.controller('orderController', function ($scope, GetItemsFactory, OrderFactory, $state, $stateParams, $cookieStore, AuthService) {

	//provides general functionality with an order
	//views current user order
		//order is shown by line item
		//has ability to edit order, or proceed to checkout
	$scope.activeorders=[]; //expects item {itemId: itemId, price: num, imgUrl:String, }, qty: num
	$scope.pastorders=[];
	$scope.user;
	$scope.sum = 0;
	$scope.totalQty = 0; 
	$scope.tempVal;
	$scope.orderId;
	$scope.userId;
	$scope.auth;

	function firstUpdate (){
	//check if user is authenticated, populate order from db, set order to cookie
		if( AuthService.isAuthenticated() ){
			AuthService.getLoggedInUser().then(function(user){
			$scope.userId = user._id;
			$scope.user = user.first_name;
			$scope.auth = true;
				OrderFactory.getOrders($scope.userId).then(function(items, err){
					console.log('items', items);
					if (err) console.log('Error: ', err);
					else if(!items) { //no items in dB, get cookies, set order
						$scope.activeorders = $cookieStore.get('Order');
						OrderFactory.createOrder({userId: $scope.userId, items: $scope.activeorders}, function(response){
							$scope.activeorders = response.lineitems;
							sum();
							totalQty();
						});
					}
					else { //items in db, make sure cookies are added to db
						$scope.activeorders = items.lineitems.lineItem;
						$scope.orderId = items.orderId;
						sum();
						totalQty();
					}
				});
			});
		}
		else {
			var idAndQty = $cookieStore.get('Order');
			var productList=[];
			GetItemsFactory.getItems().then(function(items, err){ //approach will not scale well but is quicker now
				if(err) console.log(err);
				idAndQty.forEach(function(itemPair){
					for(var a=0, len=items.length; a<7; a++){
						if(itemPair.itemId === items[a]._id){
							productList.push({item: items[a], quantity: itemPair.quantity });
						}
					}
				});
				console.log('prodList', productList);
				$scope.activeorders = productList;
				$scope.user = 'User';
				$scope.auth = false;
				sum();
				totalQty();
			})
		}
	};

	firstUpdate();

	function totalQty (){
		var totalQ = 0;
		console.log('got to sum');
		$scope.activeorders.forEach(function(lineItem){
			totalQ= totalQ + lineItem.quantity;
		})
		$scope.totalQty = totalQ;
	};

	$scope.removeItem = function(item){
		//remove item from db, remove item from cookie, remove item from scope
		//if authenticated, remove item from order
		var myOrderCookie = $cookieStore.get('Order');
		console.log(myOrderCookie, item);
		var location = getLocInCookie(myOrderCookie, item._id);

		var removedItem = myOrderCookie.splice(location, 1);
		$cookieStore.put('Order', myOrderCookie);

		$scope.activeorders.splice(location,1);
		sum();
		totalQty();

		if(AuthService.isAuthenticated()){
			OrderFactory.updateOrder({orderId: $scope.orderId, quantity: 0, itemId: Item._id}).then(function(err, data){
				if(err) console.log(err);

			});
			$scope.auth = true;
		}
	}

	function getLocInCookie (cookies, id){
		var loc;
		cookies.forEach(function(element, index){
			if(element.itemId === id){
				console.log(element.itemId, " is the correct key");
				loc = index;
			}
		});
		return loc;
	}

	$scope.updateOrder = function(item, val){
		//takes in information about the user, 
		if(val == 0){
			$scope.removeItem(item.item);
		}
		else{
			if($scope.userId){
				OrderFactory.updateOrder({orderId: $scope});
			}
			var orderCookie = $cookieStore.get('Order');
			var index = getLocInCookie(orderCookie, item.item._id);
			orderCookie[index].quantity = Number(val);
			$cookieStore.put('Order', orderCookie);

			$scope.activeorders[index].quantity = Number(val);
			sum();
			totalQty();
		}
		
	}; 
	$scope.newNumber = function(item, val){
		console.log('item', item, 'val', val);
	}
	//get user information and send Id

	$scope.showCookie = function(){
		console.log($cookieStore.get('Order'));
		$scope.activeorders = $cookieStore.get('Order');
	}

	$scope.deleteCookie = function(){
		$cookieStore.remove('Order');
		console.log($cookieStore.get('Order'));
	}
	$scope.showOrderFromDb = function(){
		//console.log(AuthService.isAuthenticated());
		if($scope.userId){
			OrderFactory.getOrders($scope.userId).then(function(result, err){
				console.log('results', result,'Error', err);
			})
		}
		else {
			console.log('No user exists');
		}
		
	}

	function sum (){
		var total = 0;
		console.log('got to sum');
		$scope.activeorders.forEach(function(lineItem){
			console.log(lineItem);
			total= total + lineItem.item.price * lineItem.quantity;
		})
		$scope.sum = total;
	};
	
});
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

    $scope.changeStatusMenuItems = [
        { label: 'open'},
        { label: 'placed'},
        { label: 'shipped'},
        { label: 'complete'}
    ];

	$scope.filterOrders = function(status) {
		$scope.orders = orderModifyFactory.filterOrders(status, $scope.allOrders)

		$scope.filtered = false;
	}

    $scope.changeStatus = function (orderId, status, index) {
        var data = [orderId, status]
        $scope.orders[index].status = status
        orderModifyFactory.modifyOrder(data)
    }
});
'use strict';
app.config(function ($stateProvider) {

    $stateProvider.state('admin.productCatCreate', {
        url: '/productCatCreate',
        templateUrl: 'js/productCatCreate/productCatCreate.html'
    });

});
app.config(function ($stateProvider) {

    // Register our *Review Entry* state.
    $stateProvider.state('review-entry', {
        url: ':name/:url/review-entry',
        controller: function($scope, CreateReview, $state, $stateParams) {
            $scope.productname = $stateParams.name;
            $scope.producturl = $stateParams.url;
            console.log("in conroller", $scope);

            $scope.newReview = function () {
            	console.log("inside newReview", $scope.productname);
            	var info = $scope.productname;
            	CreateReview.submitReview(info).then(function(user, err){
	    					if (err) $scope.success = false;
	    						else{
                    $state.go('products');
              	}
	    				})
	   				};
         },
        templateUrl: 'js/review-entry/review-entry.html'
    })

});



app

    .constant('ratingConfig', {
        max: 5,
    })

    .directive('rating', ['ratingConfig', function(ratingConfig) {
        return {
            restrict: 'EA',
            replace: true,
            scope: {
                value: '=',
            },
            template: '<span ng-mouseleave="reset()"><i ng-repeat="number in range" ng-mouseenter="enter(number)" ng-click="assign(number)" ng-class="{\'glyphicon glyphicon-star icon-gold\': number <= val, \'glyphicon glyphicon-star icon-gray\': number > val}"></i></span>',
            link: function(scope, element, attrs) {
                var maxRange = angular.isDefined(attrs.max) ? scope.$eval(attrs.max) : ratingConfig.max;

                scope.range = [];
                for(var i = 1; i <= maxRange; i++ ) {
                    scope.range.push(i);
                }

                scope.$watch('value', function(value) {
                    scope.val = value;
                });

                scope.assign = function(value) {
                    scope.value = value;
                }

                scope.enter = function(value) {
                    scope.val = value;
                }

                scope.reset = function() {
                    scope.val = angular.copy(scope.value);
                }
                scope.reset();

            }
        };
    }]);

app.controller('StarCtrl', function($scope) {

    $scope.rate1 = 0;

    $scope.rate2 = 6;

});
'use strict';
app.config(function ($stateProvider) {

    // Register our *about* state.
    $stateProvider.state('stripe', {
        url: '/stripe',
        controller: 'StripeController',
        templateUrl: 'js/testStripe/stripe.html'
    });

});

app.controller('StripeController', function ($scope) {

});
'use strict';
app.config(function ($stateProvider) {

    $stateProvider.state('tutorial', {
        url: '/tutorial',
        templateUrl: 'js/tutorial/tutorial.html',
        controller: 'TutorialCtrl',
        resolve: {
            tutorialInfo: function (TutorialFactory) {
                return TutorialFactory.getTutorialVideos();
            }
        }
    });

});

app.factory('TutorialFactory', function ($http) {

    return {
        getTutorialVideos: function () {
            return $http.get('/api/tutorial/videos').then(function (response) {
                return response.data;
            });
        }
    };

});

app.controller('TutorialCtrl', function ($scope, tutorialInfo) {

    $scope.sections = tutorialInfo.sections;
    $scope.videos = _.groupBy(tutorialInfo.videos, 'section');

    $scope.currentSection = { section: null };

    $scope.colors = [
        'rgba(34, 107, 255, 0.10)',
        'rgba(238, 255, 68, 0.11)',
        'rgba(234, 51, 255, 0.11)',
        'rgba(255, 193, 73, 0.11)',
        'rgba(22, 255, 1, 0.11)'
    ];

    $scope.getVideosBySection = function (section, videos) {
        return videos.filter(function (video) {
            return video.section === section;
        });
    };

});
'use strict';
app.config(function ($stateProvider) {
	$stateProvider.state('admin.userModify', {
        url: '/userModify',
        controller: 'userModifyController',
        templateUrl: 'js/userModify/userModify.html'
    });
})

app.controller('userModifyController', function ($scope, userModifyFactory, $state, $stateParams, AuthService) {

    
    $scope.submit = {
        password: '',
        email: '',
        makeAdmin: false
    }
    $scope.success;


    $scope.changePW = function() {
        userModifyFactory.postPW($scope.submit).then(function(user, err){
            $scope.submit = {}
            if(err) {
                $scope.success= false;
                console.log('changing state')
            }
            else{
                console.log($scope.submit);
                $scope.success = true;
            }
        });
    }  
});
'use strict';
app.factory('CreateItemFactory', function($http){
	
	return {
		postItem: function(data){
			console.log('into the factory', data);
			// return $http.post('/api/item', data);

			return $http.post('/api/admin/itemCreate', data).then(function(response){
				return response.data;
			})
		}
	}

})
'use strict';
app.factory('CreateReview', function($http){
	
	return {
		submitReview: function(data){
			console.log('into review factory', data);
			return $http.post('/api/reviews/'+ data).then(function(response){
				return response.data;
			})
		}
	}
})
'use strict';
app.factory('CreateUserFactory', function($http){
	
	return {
		postUser: function(data){
			console.log('into user factory', data);
			return $http.post('api/join', data).then(function(response){
				return response.data;
			})
		}
	}
})

// '/api/login'
'use strict';
app.factory('GetItemFactory', function($http){
	
	return {
		getItem: function(id){
			//var options = {email: email};
			console.log(id);
			return $http.get('/api/item/'+id).then(function(response){
				return response.data;
			})
		},

		// getCategoryItems: function () {
		// 	console.log("GetItemFactory: getCategoryItems", category);
		// 	return $http.get('/api/item/'+ category).then(function(response){
		// 		return response.data;
		// 	});
		// },

	}
})
'use strict';
app.factory('GetItemsFactory', function($http){

    return {
        getItems: function(){
            return $http.get('/api/itemlist').then(function(response){
                return response.data;
            })
        }

    }
})
'use strict';
app.factory('GetUserFactory', function($http){
	
	return {
		getUser: function(user){
			console.log('inside factor with: ', email);
			//var options = {email: email};
			return $http.get('/api/login/' + user.email).then(function(response){
				return response.data;
			})
		},
		authUser: function(data){
			return $http.post('/login', data).then(function(response){
				console.log("factory done")
				return response.data;
			})
		}
	}
})

// '/api/login/' + email
'use strict';
app.factory('OrderFactory', function($http){
	
	return {
		createOrder: function(data){// data should be in form {userId: user._id, items: [item: item._id, qty: qty]}
			console.log('sending a request for a new order from factory');
			return $http.post('/api/order', data).then(function(response){
			//console.log('response from createOrder factory request', response);
				return response.data;
			})
		},
		updateOrder: function(data){ //expects orderId, itemId, and quantity (case sensative)
			return $http.post('/api/order/lineitem', data).then(function(response){
				return response.data;
			})
		},
		getOrders: function(userId){
			return $http.get('/api/order/'+userId).then(function(response){
				//console.log('response from getOrders factory request', response);
				return response.data;
			});
		}

}});
'use strict';
app.factory('RandomGreetings', function () {

    var getRandomFromArray = function (arr) {
        return arr[Math.floor(Math.random() * arr.length)];
    };

    var greetings = [
        'Hello, world!',
        'At long last, I live!',
        'Hello, simple human.',
        'What a beautiful day!',
        'I\'m like any other project, except that I am yours. :)',
        'This empty string is for Lindsay Levine.'
    ];

    return {
        greetings: greetings,
        getRandomGreeting: function () {
            return getRandomFromArray(greetings);
        }
    };

});
'use strict';

app.factory('adminNavbarFactory', function (navbarMenu) {
		var navbarMenuItems = [
        { label: 'Home', state: 'home' },
        { label: 'Create Item', state: 'itemCreate' },
        { label: 'Modify User', state: 'userModify' }
    ];

	return {

	}
})
'use strict'
app.factory('adminPostUser', function ($http) {

	return {
		postInfo: function (inputs) {
			return $http.post('admin', inputs)
		}
	}
}) 
'use strict';
app.factory('orderModifyFactory', function ($http){
	
	return {
		filterOrders: function (status, allOrders) {
			if (status === 'all orders') {
				return allOrders
			}
			var filteredArray = [];
			for (var a=0, len=allOrders.length; a<len; a++) {
				if (allOrders[a].status === status) {
					filteredArray.push(allOrders[a])
				}
			}
			return filteredArray
		},
		modifyOrder: function(data){
			return $http.put('/api/admin/order', data).then(function(response){
				return response.data;
			})
		},
		getAllOrders: function(){
			console.log('into the factory');
			// return $http.post('/api/item', data);

			return $http.get('/api/admin/order').then(function(response){
				return response.data;
			})
		},
		changeOrderStatus: function ( ) {
			return $http.put('/api/admin/order').then(function(response){
				return response.data;
			})	
		}
		// getUserOrdersByEmail: function () {
		// 	return $http.post('/api/admin/order').then(function(response){
		// 		return response.data;
		// 	})
		// }
	}

})
'use strict';
app.factory('userModifyFactory', function($http){
	
	return {
		postPW: function(data){
			console.log('into the factory', data);
			// return $http.post('/api/item', data);

			return $http.post('/api/admin/userModify', data).then(function(response){
				return response.data;
			})
		}
	}

})
'use strict';

app.directive('tutorialSection', function () {
    return {
        restrict: 'E',
        scope: {
            name: '@',
            videos: '=',
            background: '@'
        },
        templateUrl: 'js/tutorial/tutorial-section/tutorial-section.html',
        link: function (scope, element) {
            element.css({ background: scope.background });
        }
    };
});
'use strict';
app.directive('tutorialSectionMenu', function () {
    return {
        restrict: 'E',
        require: 'ngModel',
        templateUrl: 'js/tutorial/tutorial-section-menu/tutorial-section-menu.html',
        scope: {
            sections: '='
        },
        link: function (scope, element, attrs, ngModelCtrl) {

            scope.currentSection = scope.sections[0];
            ngModelCtrl.$setViewValue(scope.currentSection);

            scope.setSection = function (section) {
                scope.currentSection = section;
                ngModelCtrl.$setViewValue(section);
            };

        }
    };
});
'use strict';
app.directive('tutorialVideo', function ($sce) {

    var formYoutubeURL = function (id) {
        return 'https://www.youtube.com/embed/' + id;
    };

    return {
        restrict: 'E',
        templateUrl: 'js/tutorial/tutorial-video/tutorial-video.html',
        scope: {
            video: '='
        },
        link: function (scope) {
            scope.trustedYoutubeURL = $sce.trustAsResourceUrl(formYoutubeURL(scope.video.youtubeID));
        }
    };

});
'use strict';
app.directive('navDropdown', function () {
    return {
        restrict: 'E',
        //scope: {
        //    items: '='
        //},
        templateUrl: 'js/common/directives/navbar/nav-dropdown.html'
        //controller: 'dropdownController'
    };
});

app.directive('navDropdownWomen', function () {
    return {
        restrict: 'E',
        //scope: {
        //    items: '='
        //},
        templateUrl: 'js/common/directives/navbar/nav-dropdown-women.html'
        //controller: 'dropdownController'
    };
});

app.controller('dropdownController', function ($scope, GetItemsFactory, $state, $stateParams, $window) {

    GetItemsFactory.getItems().then(function(items, err){
        if(err) throw err;
        else{
            var allItems = items;
            //console.log(allItems);
            var dropDownSorter = function (gender) {
                var sortedArray = [];
                var selectedNames = [];
                for (var obj in allItems) {
                    if (selectedNames.indexOf(allItems[obj].name) === -1 && allItems[obj].gender == gender) {
                        ////console.log(allItems[obj].name);
                        selectedNames.push(allItems[obj].name);
                        sortedArray.push(allItems[obj]);
                    }
                }
                return sortedArray;
            }
            $scope.menProducts1 = dropDownSorter('men').slice(0,3);
            $scope.menProducts2 = dropDownSorter('men').slice(3,6);

            $scope.womenProducts1 = dropDownSorter('women').slice(0,3);
            $scope.womenProducts2 = dropDownSorter('women').slice(3,6);
            //console.log($scope.menProducts1, $scope.menProducts2);
            //console.log($scope.womenProducts);

            // Dropdown controls
            $scope.menVisible = false;
            $scope.womenVisible = false;

            $scope.toggleMenVisible = function(){
                $scope.menVisible = !$scope.menVisible;
                $scope.womenVisible = false;
            }

            $scope.toggleWomenVisible = function(){
               $scope.womenVisible = !$scope.womenVisible;
                $scope.menVisible = false;
            }



        }
    });

});
'use strict';
app.directive('navbar', function ($document) {
    return {
        restrict: 'E',

        //scope: {
        //  items: '='
        //},
        templateUrl: 'js/common/directives/navbar/navbar.html',
        //link: function(scope, element, attr){
        //    console.log(scope);
        //    console.log(element);
        //    //scope.menVisible = false;
        //    //
        //    //scope.toggleSelect = function(){
        //    //    scope.menVisible = !scope.menVisible;
        //    //}
        //    //
        //    $document.bind('click', function(event){
        //
        //        var isClickedElementChildOfPopup = element
        //                .find(event.target)
        //                .length > 0;
        //        console.log('is clicked', scope.menVisible)
        //        if (isClickedElementChildOfPopup)
        //            return;
        //
        //        scope.menVisible = false;
        //        scope.$apply();
        //    });
        //}


    };
});

'use strict';
app.directive('randoGreeting', function (RandomGreetings) {

    return {
        restrict: 'E',
        templateUrl: 'js/common/directives/rando-greeting/rando-greeting.html',
        link: function (scope) {
            scope.greeting = RandomGreetings.getRandomGreeting();
        }
    };

});
'use strict';
app.directive('specstackularLogo', function () {
    return {
        restrict: 'E',
        templateUrl: 'js/common/directives/specstackular-logo/specstackular-logo.html'
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyIsImFib3V0L2Fib3V0LmpzIiwiYWRtaW4vYWRtaW4uanMiLCJhZG1pbi9pbmRleC5qcyIsImFsbEl0ZW1zL2FsbEl0ZW1zLmpzIiwiY2hlY2tvdXQvY2hlY2tvdXQuanMiLCJmc2EvZnNhLXByZS1idWlsdC5qcyIsImhvbWUvaG9tZS5qcyIsImhvbWUvcHJvZHVjdHJldmlld3Njb250cm9sbGVyLmpzIiwiaG9tZS9yZXZpZXdzdGFyLmpzIiwiaXRlbS9pdGVtLmpzIiwiaXRlbUNyZWF0ZS9pdGVtQ3JlYXRlLmpzIiwiam9pbm5vdy9qb2lubm93LmpzIiwibG9naW4vbG9naW4uanMiLCJvcmRlci9vcmRlci5qcyIsIm9yZGVyTW9kaWZ5L29yZGVyTW9kaWZ5LmpzIiwicHJvZHVjdENhdENyZWF0ZS9wcm9kdWN0Q2F0Q3JlYXRlLmpzIiwicmV2aWV3LWVudHJ5L3Jldmlldy1lbnRyeS5qcyIsInJldmlldy1lbnRyeS9zdGFycy5qcyIsInRlc3RTdHJpcGUvc3RyaXBlLmpzIiwidHV0b3JpYWwvdHV0b3JpYWwuanMiLCJ1c2VyTW9kaWZ5L3VzZXJNb2RpZnkuanMiLCJjb21tb24vZmFjdG9yaWVzL0NyZWF0ZUl0ZW1GYWN0b3J5LmpzIiwiY29tbW9uL2ZhY3Rvcmllcy9DcmVhdGVSZXZpZXcuanMiLCJjb21tb24vZmFjdG9yaWVzL0NyZWF0ZVVzZXJGYWN0b3J5LmpzIiwiY29tbW9uL2ZhY3Rvcmllcy9HZXRJdGVtRmFjdG9yeS5qcyIsImNvbW1vbi9mYWN0b3JpZXMvR2V0SXRlbXNGYWN0b3J5LmpzIiwiY29tbW9uL2ZhY3Rvcmllcy9HZXRVc2VyRmFjdG9yeS5qcyIsImNvbW1vbi9mYWN0b3JpZXMvT3JkZXJGYWN0b3J5LmpzIiwiY29tbW9uL2ZhY3Rvcmllcy9SYW5kb21HcmVldGluZ3MuanMiLCJjb21tb24vZmFjdG9yaWVzL1NvY2tldC5qcyIsImNvbW1vbi9mYWN0b3JpZXMvYWRtaW5OYXZiYXJGYWN0b3J5LmpzIiwiY29tbW9uL2ZhY3Rvcmllcy9hZG1pblBvc3RVc2VyLmpzIiwiY29tbW9uL2ZhY3Rvcmllcy9vcmRlck1vZGlmeUZhY3RvcnkuanMiLCJjb21tb24vZmFjdG9yaWVzL3VzZXJNb2RpZnlGYWN0b3J5LmpzIiwidHV0b3JpYWwvdHV0b3JpYWwtc2VjdGlvbi90dXRvcmlhbC1zZWN0aW9uLmpzIiwidHV0b3JpYWwvdHV0b3JpYWwtc2VjdGlvbi1tZW51L3R1dG9yaWFsLXNlY3Rpb24tbWVudS5qcyIsInR1dG9yaWFsL3R1dG9yaWFsLXZpZGVvL3R1dG9yaWFsLXZpZGVvLmpzIiwiY29tbW9uL2RpcmVjdGl2ZXMvbmF2YmFyL25hdi1kcm9wZG93bi5qcyIsImNvbW1vbi9kaXJlY3RpdmVzL25hdmJhci9uYXZiYXIuanMiLCJjb21tb24vZGlyZWN0aXZlcy9yYW5kby1ncmVldGluZy9yYW5kby1ncmVldGluZy5qcyIsImNvbW1vbi9kaXJlY3RpdmVzL3NwZWNzdGFja3VsYXItbG9nby9zcGVjc3RhY2t1bGFyLWxvZ28uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbkNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDeEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3BCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM5R0E7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2xIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzFCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdkRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDekRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM5Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ25MQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3pEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNSQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzNCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDakRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNqREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNqQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDZEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDWEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3BCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNYQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNwQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3ZCQTtBQUNBO0FDREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3pDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNkQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDckJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDckVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ25DQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNYQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJtYWluLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnO1xuLy8gdmFyIGFwcCA9IGFuZ3VsYXIubW9kdWxlKCdGdWxsc3RhY2tHZW5lcmF0ZWRBcHAnLCBbJ3VpLnJvdXRlcicsICdmc2FQcmVCdWlsdCddKTtcblxudmFyIGFwcCA9IGFuZ3VsYXIubW9kdWxlKCdzcGVjU3RhY2t1bGFyJywgWyd1aS5yb3V0ZXInLCAnZnNhUHJlQnVpbHQnLCAnbmdDb29raWVzJ10pO1xuYXBwLmNvbnRyb2xsZXIoJ01haW5Db250cm9sbGVyJywgZnVuY3Rpb24gKCRzY29wZSwgJHJvb3RTY29wZSkge1xuXG4gICAgLy8gR2l2ZW4gdG8gdGhlIDxuYXZiYXI+IGRpcmVjdGl2ZSB0byBzaG93IHRoZSBtZW51LlxuICAgICRzY29wZS5tZW51SXRlbXMgPSBbXG4gICAgICAgIHsgbGFiZWw6ICdNZW4nLCBzdGF0ZTogJ3Byb2R1Y3RzJyB9LFxuICAgICAgICB7IGxhYmVsOiAnV29tZW4nLCBzdGF0ZTogJ3dvbWVuJyB9LFxuICAgICAgICB7IGxhYmVsOiAnSm9pbiB1cycsIHN0YXRlOiAnam9pbicgfSxcbiAgICAgICAgeyBsYWJlbDogJ0xvZyBJbicsIHN0YXRlOiAnbG9naW4nfSxcbiAgICAgICAgeyBsYWJlbDogJ1Byb2R1Y3QgbGlzdCcsIHN0YXRlOiAncHJvZHVjdHMnIH0sXG4gICAgICAgIHsgbGFiZWw6ICdNeSBPcmRlcnMnLCBzdGF0ZTogJ29yZGVycyd9XG4gICAgXTtcbiAgICAkc2NvcGUuYWRtaW5JdGVtcz0gW1xuICAgICAgICB7IGxhYmVsOiAnQ3JlYXRlIHByb2R1Y3QnLCBzdGF0ZTogJ2FkbWluLml0ZW1DcmVhdGUnIH0sXG4gICAgICAgIHsgbGFiZWw6ICdNb2RpZnkgVXNlcicsIHN0YXRlOiAnYWRtaW4udXNlck1vZGlmeSd9LFxuICAgICAgICB7IGxhYmVsOiAnTW9kaWZ5IE9yZGVyJywgc3RhdGU6ICdhZG1pbi5vcmRlck1vZGlmeSd9LFxuICAgICAgICB7IGxhYmVsOiAnQ3JlYXRlIFByb2R1Y3QgQ2F0IFBnJywgc3RhdGU6ICdhZG1pbi5wcm9kdWN0Q2F0Q3JlYXRlJ31cbiAgICBdXG5cblxuXG5cblxufSk7XG5cblxuYXBwLmNvbmZpZyhmdW5jdGlvbiAoJHVybFJvdXRlclByb3ZpZGVyLCAkbG9jYXRpb25Qcm92aWRlcikge1xuICAgIC8vIFRoaXMgdHVybnMgb2ZmIGhhc2hiYW5nIHVybHMgKC8jYWJvdXQpIGFuZCBjaGFuZ2VzIGl0IHRvIHNvbWV0aGluZyBub3JtYWwgKC9hYm91dClcbiAgICAkbG9jYXRpb25Qcm92aWRlci5odG1sNU1vZGUodHJ1ZSk7XG4gICAgLy8gSWYgd2UgZ28gdG8gYSBVUkwgdGhhdCB1aS1yb3V0ZXIgZG9lc24ndCBoYXZlIHJlZ2lzdGVyZWQsIGdvIHRvIHRoZSBcIi9cIiB1cmwuXG4gICAgJHVybFJvdXRlclByb3ZpZGVyLm90aGVyd2lzZSgnLycpO1xufSk7XG4iLCIndXNlIHN0cmljdCc7XG5hcHAuY29uZmlnKGZ1bmN0aW9uICgkc3RhdGVQcm92aWRlcikge1xuXG4gICAgLy8gUmVnaXN0ZXIgb3VyICphYm91dCogc3RhdGUuXG4gICAgJHN0YXRlUHJvdmlkZXIuc3RhdGUoJ2Fib3V0Jywge1xuICAgICAgICB1cmw6ICcvYWJvdXQnLFxuICAgICAgICBjb250cm9sbGVyOiAnQWJvdXRDb250cm9sbGVyJyxcbiAgICAgICAgdGVtcGxhdGVVcmw6ICdqcy9hYm91dC9hYm91dC5odG1sJ1xuICAgIH0pO1xuXG59KTtcblxuYXBwLmNvbnRyb2xsZXIoJ0Fib3V0Q29udHJvbGxlcicsIGZ1bmN0aW9uICgkc2NvcGUpIHtcblxuICAgIC8vIEltYWdlcyBvZiBiZWF1dGlmdWwgRnVsbHN0YWNrIHBlb3BsZS5cbiAgICAkc2NvcGUuaW1hZ2VzID0gW1xuICAgICAgICAnaHR0cHM6Ly9wYnMudHdpbWcuY29tL21lZGlhL0I3Z0JYdWxDQUFBWFFjRS5qcGc6bGFyZ2UnLFxuICAgICAgICAnaHR0cHM6Ly9mYmNkbi1zcGhvdG9zLWMtYS5ha2FtYWloZC5uZXQvaHBob3Rvcy1hay14YXAxL3QzMS4wLTgvMTA4NjI0NTFfMTAyMDU2MjI5OTAzNTkyNDFfODAyNzE2ODg0MzMxMjg0MTEzN19vLmpwZycsXG4gICAgICAgICdodHRwczovL3Bicy50d2ltZy5jb20vbWVkaWEvQi1MS1VzaElnQUV5OVNLLmpwZycsXG4gICAgICAgICdodHRwczovL3Bicy50d2ltZy5jb20vbWVkaWEvQjc5LVg3b0NNQUFrdzd5LmpwZycsXG4gICAgICAgICdodHRwczovL3Bicy50d2ltZy5jb20vbWVkaWEvQi1VajlDT0lJQUlGQWgwLmpwZzpsYXJnZScsXG4gICAgICAgICdodHRwczovL3Bicy50d2ltZy5jb20vbWVkaWEvQjZ5SXlGaUNFQUFxbDEyLmpwZzpsYXJnZSdcbiAgICBdO1xuXG59KTsiLCIndXNlIHN0cmljdCc7XG5hcHAuY29uZmlnKGZ1bmN0aW9uICgkc3RhdGVQcm92aWRlcikge1xuXG4gICAgXG4gICAgJHN0YXRlUHJvdmlkZXIuc3RhdGUoJ2FkbWluJywge1xuICAgICAgICB1cmw6ICcvYWRtaW4nLFxuICAgICAgICB0ZW1wbGF0ZVVybDogJ2pzL2FkbWluL2FkbWluLmh0bWwnXG4gICAgfSk7XG5cbn0pO1xuXG4iLCIndXNlIHN0cmljdCc7XG5hcHAuY29udHJvbGxlcignQWRtaW5Db250cm9sbGVyJywgZnVuY3Rpb24gKCRzY29wZSkge1xuXG4gICAgLy8gR2l2ZW4gdG8gdGhlIDxuYXZiYXI+IGRpcmVjdGl2ZSB0byBzaG93IHRoZSBtZW51LlxuICAgICRzY29wZS5tZW51SXRlbXMgPSBbXG4gICAgICAgIHsgbGFiZWw6ICdIb21lJywgc3RhdGU6ICdob21lJyB9LFxuICAgICAgICB7IGxhYmVsOiAnQ3JlYXRlIEl0ZW0nLCBzdGF0ZTogJ2l0ZW1DcmVhdGUnIH0sXG4gICAgICAgIHsgbGFiZWw6ICdNb2RpZnkgVXNlcicsIHN0YXRlOiAndXNlck1vZGlmeScgfVxuICAgIF07XG5cbn0pO1xuXG5hcHAuZGlyZWN0aXZlKCdhZG1pbk5hdmJhcicsIGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgICByZXN0cmljdDogJ0UnLFxuICAgICAgICBzY29wZToge1xuICAgICAgICAgIGl0ZW1zOiAnPSdcbiAgICAgICAgfSxcbiAgICAgICAgdGVtcGxhdGVVcmw6ICdqcy9jb21tb24vZGlyZWN0aXZlcy9uYXZiYXIvbmF2YmFyLmh0bWwnXG4gICAgfTtcbn0pOyIsIid1c2Ugc3RyaWN0JztcblxuYXBwLnJ1bihmdW5jdGlvbiAoJGNvb2tpZXMsICRjb29raWVTdG9yZSkge1xuXG5cdHZhciBpbml0ID0gJGNvb2tpZVN0b3JlLmdldCgnT3JkZXInKTtcblx0aWYoIWluaXQpe1xuXHRcdCRjb29raWVTdG9yZS5wdXQoJ09yZGVyJywgW10pO1xuXHRcdGNvbnNvbGUubG9nKCdzdGFydGluZyBjb29raWU6ICcsICRjb29raWVTdG9yZS5nZXQoJ09yZGVyJykpO1xuXHR9XG5cbn0pO1xuXG5hcHAuY29uZmlnKGZ1bmN0aW9uICgkc3RhdGVQcm92aWRlcikge1xuXG5cblxuICAgICRzdGF0ZVByb3ZpZGVyLnN0YXRlKCdwcm9kdWN0cycsIHtcbiAgICAgICAgdXJsOiAnL3Byb2R1Y3RzJyxcbiAgICAgICAgY29udHJvbGxlcjogJ2FsbEl0ZW1zQ29udHJvbGxlcicsXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnanMvYWxsaXRlbXMvYWxsaXRlbXMuaHRtbCdcbiAgICB9KVxuXG59KTtcblxuLy8gYXBwLmNvbmZpZyhmdW5jdGlvbiAoJHN0YXRlUHJvdmlkZXIpIHtcblxuLy8gICAgIC8vIFJlZ2lzdGVyIG91ciAqbWVuKiBzdGF0ZS5cbi8vICAgICAkc3RhdGVQcm92aWRlci5zdGF0ZSgnbWVuJywge1xuLy8gICAgICAgICB1cmw6ICcvcHJvZHVjdHMvbWVuJyxcbi8vICAgICAgICAgY29udHJvbGxlcjogJ2FsbEl0ZW1zQ29udHJvbGxlcicsXG4vLyAgICAgICAgIHRlbXBsYXRlVXJsOiAnanMvYWxsaXRlbXMvYWxsaXRlbXMuaHRtbCdcbi8vICAgICB9KVxuXG4vLyB9KTtcblxuLy8gYXBwLmNvbmZpZyhmdW5jdGlvbiAoJHN0YXRlUHJvdmlkZXIpIHtcblxuLy8gICAgIC8vIFJlZ2lzdGVyIG91ciAqd29tZW4qIHN0YXRlLlxuLy8gICAgICRzdGF0ZVByb3ZpZGVyLnN0YXRlKCd3b21lbicsIHtcbi8vICAgICAgICAgdXJsOiAnL3Byb2R1Y3RzL3dvbWVuJyxcbi8vICAgICAgICAgLy8gY29udHJvbGxlcjogJ2NhdGVnb3J5Q29udHJvbGxlcicsXG4vLyAgICAgICAgIGNvbnRyb2xsZXI6IGZ1bmN0aW9uICgkc2NvcGUsIEdldEl0ZW1zRmFjdG9yeSwgJHN0YXRlLCAkc3RhdGVQYXJhbXMpIHtcbi8vIFx0XHRcdGNvbnNvbGUubG9nKFwiYmVmb3JlXCIsICRzY29wZS5pdGVtcywgJHN0YXRlLmN1cnJlbnQpO1xuLy8gXHRcdFx0R2V0SXRlbXNGYWN0b3J5LmdldEl0ZW1zKCkudGhlbihmdW5jdGlvbihpdGVtcyl7XHRcbi8vIFx0XHRcdFx0JHNjb3BlLml0ZW1zID0gaXRlbXM7XG4vLyBcdFx0XHRcdGNvbnNvbGUubG9nKGl0ZW1zKTtcbi8vIFx0XHRcdH0pO1xuLy8gXHRcdH0sXG4vLyAgICAgICAgIHRlbXBsYXRlVXJsOiAnanMvYWxsaXRlbXMvYWxsaXRlbXMuaHRtbCcsXG4vLyAgICAgfSlcbi8vIH0pO1xuXG5cbmFwcC5jb250cm9sbGVyKCdhbGxJdGVtc0NvbnRyb2xsZXInLCBmdW5jdGlvbiAoJHNjb3BlLCBBdXRoU2VydmljZSwgR2V0SXRlbXNGYWN0b3J5LCAkc3RhdGUsICRzdGF0ZVBhcmFtcywgJGNvb2tpZVN0b3JlLCBPcmRlckZhY3RvcnkpIHtcblxuXHRHZXRJdGVtc0ZhY3RvcnkuZ2V0SXRlbXMoKS50aGVuKGZ1bmN0aW9uKGl0ZW1zLCBlcnIpe1xuXHRcdGlmKGVycikgdGhyb3cgZXJyO1xuXHRcdGVsc2V7XG5cdFx0XHQkc2NvcGUuaXRlbXMgPSBpdGVtcztcblx0XHR9XG5cdH0pO1xuXG5cblx0JHNjb3BlLmFkZFRvT3JkZXIgPSBmdW5jdGlvbihzcGVjaWZpY0l0ZW0pe1xuXHRcdGNvbnNvbGUubG9nKCdnb3QgaW50byB0aGUgYWRkVG9PcmRlciBmdW5jdGlvbicpOyAvL3BhcnQgb25lIGFsd2F5cyBhZGQgaXQgdG8gdGhlIGNvb2tpZVxuXHRcdHZhciBvcmRlciA9ICRjb29raWVTdG9yZS5nZXQoJ09yZGVyJyk7XG5cdFx0dmFyIHJlc29sdmVkID0gZmFsc2U7XG5cdFx0dmFyIGxpbmUgPSB7aXRlbUlkOiBzcGVjaWZpY0l0ZW0uX2lkLCBxdWFudGl0eTogMX07XG5cdFx0IGNvbnNvbGUubG9nKCdvcmRlcicsIG9yZGVyKTtcblx0XHRcdGlmKG9yZGVyKXsgLy9pZiB1c2VyIGhhcyBhbiBvcmRlciBvbiBhIGNvb2tpZVxuIFxuXHRcdFx0XHRvcmRlci5mb3JFYWNoKGZ1bmN0aW9uKGl0ZW1MaW5lKXtcblx0XHRcdFx0XHRpZihpdGVtTGluZS5pdGVtSWQgPT09IHNwZWNpZmljSXRlbS5faWQpe1xuXHRcdFx0XHRcdFx0aXRlbUxpbmUucXVhbnRpdHkrKztcblx0XHRcdFx0XHRcdHJlc29sdmVkID0gdHJ1ZTtcblx0XHRcdFx0XHR9XHRcblx0XHRcdFx0fSk7XG5cdFx0XHRcdGlmKCFyZXNvbHZlZCl7XG5cdFx0XHRcdFx0b3JkZXIucHVzaChsaW5lKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0ZWxzZXtcblx0XHRcdFx0b3JkZXIucHVzaChsaW5lKTtcblx0XHRcdH1cblxuXG5cdFx0JGNvb2tpZVN0b3JlLnB1dCgnT3JkZXInLCBvcmRlcik7XG5cblx0XHQvLyB2YXIgdXNlciA9IEF1dGhTZXJ2aWNlLmdldExvZ2dlZEluVXNlcigpO1xuXHRcdC8vIGlmKHVzZXIpe1xuXHRcdC8vIFx0Ly9PcmRlckZhY3RvcnkuZ2V0T3JkZXJzKHVzZXIuX2lkKS8vXG5cdFx0Ly8gfVxuXHR9XG59KTtcblxuXG5cbmFwcC5jb250cm9sbGVyKCdjYXRlZ29yeUNvbnRyb2xsZXInLCBmdW5jdGlvbiAoJHNjb3BlLCBHZXRJdGVtc0ZhY3RvcnksICRzdGF0ZSwgJHN0YXRlUGFyYW1zKSB7XG5cblx0JHNjb3BlLmdldENhdGVnb3J5ID0gZnVuY3Rpb24gKGNhdGVnb3J5KXtcblx0XHRjb25zb2xlLmxvZyhcIm1lbiBjb250cm9sbGVyXCIsIGNhdGVnb3J5KTtcblx0XHRcdEdldEl0ZW1GYWN0b3J5LmdldENhdGVnb3J5SXRlbXMoKS50aGVuKGZ1bmN0aW9uKGl0ZW1zLCBlcnIpe1xuXHRcdFx0XHRcdGlmKGVycikgdGhyb3cgZXJyO1xuXHRcdFx0XHRcdFx0ZWxzZXtcblx0XHRcdFx0XHRcdFx0JHNjb3BlLml0ZW1zID0gaXRlbXM7XG5cdFx0XHRcdFx0fTtcblx0XHRcdH0pO1xuXHR9O1xufSk7XG5cbiIsIiIsIihmdW5jdGlvbiAoKSB7XG5cbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICAvLyBIb3BlIHlvdSBkaWRuJ3QgZm9yZ2V0IEFuZ3VsYXIhIER1aC1kb3kuXG4gICAgaWYgKCF3aW5kb3cuYW5ndWxhcikgdGhyb3cgbmV3IEVycm9yKCdJIGNhblxcJ3QgZmluZCBBbmd1bGFyIScpO1xuXG4gICAgdmFyIGFwcCA9IGFuZ3VsYXIubW9kdWxlKCdmc2FQcmVCdWlsdCcsIFtdKTtcblxuICAgIGFwcC5mYWN0b3J5KCdTb2NrZXQnLCBmdW5jdGlvbiAoJGxvY2F0aW9uKSB7XG5cbiAgICAgICAgaWYgKCF3aW5kb3cuaW8pIHRocm93IG5ldyBFcnJvcignc29ja2V0LmlvIG5vdCBmb3VuZCEnKTtcblxuICAgICAgICB2YXIgc29ja2V0O1xuXG4gICAgICAgIGlmICgkbG9jYXRpb24uJCRwb3J0KSB7XG4gICAgICAgICAgICBzb2NrZXQgPSBpbygnaHR0cDovL2xvY2FsaG9zdDoxMzM3Jyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBzb2NrZXQgPSBpbygnLycpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHNvY2tldDtcblxuICAgIH0pO1xuXG4gICAgYXBwLmNvbnN0YW50KCdBVVRIX0VWRU5UUycsIHtcbiAgICAgICAgbG9naW5TdWNjZXNzOiAnYXV0aC1sb2dpbi1zdWNjZXNzJyxcbiAgICAgICAgbG9naW5GYWlsZWQ6ICdhdXRoLWxvZ2luLWZhaWxlZCcsXG4gICAgICAgIGxvZ291dFN1Y2Nlc3M6ICdhdXRoLWxvZ291dC1zdWNjZXNzJyxcbiAgICAgICAgc2Vzc2lvblRpbWVvdXQ6ICdhdXRoLXNlc3Npb24tdGltZW91dCcsXG4gICAgICAgIG5vdEF1dGhlbnRpY2F0ZWQ6ICdhdXRoLW5vdC1hdXRoZW50aWNhdGVkJyxcbiAgICAgICAgbm90QXV0aG9yaXplZDogJ2F1dGgtbm90LWF1dGhvcml6ZWQnXG4gICAgfSk7XG5cbiAgICBhcHAuY29uZmlnKGZ1bmN0aW9uICgkaHR0cFByb3ZpZGVyKSB7XG4gICAgICAgICRodHRwUHJvdmlkZXIuaW50ZXJjZXB0b3JzLnB1c2goW1xuICAgICAgICAgICAgJyRpbmplY3RvcicsXG4gICAgICAgICAgICBmdW5jdGlvbiAoJGluamVjdG9yKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuICRpbmplY3Rvci5nZXQoJ0F1dGhJbnRlcmNlcHRvcicpO1xuICAgICAgICAgICAgfVxuICAgICAgICBdKTtcbiAgICB9KTtcblxuICAgIGFwcC5mYWN0b3J5KCdBdXRoSW50ZXJjZXB0b3InLCBmdW5jdGlvbiAoJHJvb3RTY29wZSwgJHEsIEFVVEhfRVZFTlRTKSB7XG4gICAgICAgIHZhciBzdGF0dXNEaWN0ID0ge1xuICAgICAgICAgICAgNDAxOiBBVVRIX0VWRU5UUy5ub3RBdXRoZW50aWNhdGVkLFxuICAgICAgICAgICAgNDAzOiBBVVRIX0VWRU5UUy5ub3RBdXRob3JpemVkLFxuICAgICAgICAgICAgNDE5OiBBVVRIX0VWRU5UUy5zZXNzaW9uVGltZW91dCxcbiAgICAgICAgICAgIDQ0MDogQVVUSF9FVkVOVFMuc2Vzc2lvblRpbWVvdXRcbiAgICAgICAgfTtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHJlc3BvbnNlRXJyb3I6IGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICAgICAgICAgICAgICAgICRyb290U2NvcGUuJGJyb2FkY2FzdChzdGF0dXNEaWN0W3Jlc3BvbnNlLnN0YXR1c10sIHJlc3BvbnNlKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gJHEucmVqZWN0KHJlc3BvbnNlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICB9KTtcblxuICAgIGFwcC5zZXJ2aWNlKCdBdXRoU2VydmljZScsIGZ1bmN0aW9uICgkaHR0cCwgU2Vzc2lvbiwgJHJvb3RTY29wZSwgQVVUSF9FVkVOVFMsICRxKSB7XG5cbiAgICAgICAgdmFyIG9uU3VjY2Vzc2Z1bExvZ2luID0gZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICB2YXIgZGF0YSA9IHJlc3BvbnNlLmRhdGE7XG4gICAgICAgICAgICBTZXNzaW9uLmNyZWF0ZShkYXRhLmlkLCBkYXRhLnVzZXIpO1xuICAgICAgICAgICAgJHJvb3RTY29wZS4kYnJvYWRjYXN0KEFVVEhfRVZFTlRTLmxvZ2luU3VjY2Vzcyk7XG4gICAgICAgICAgICByZXR1cm4gZGF0YS51c2VyO1xuICAgICAgICB9O1xuXG4gICAgICAgIHRoaXMuZ2V0TG9nZ2VkSW5Vc2VyID0gZnVuY3Rpb24gKCkge1xuXG4gICAgICAgICAgICBpZiAodGhpcy5pc0F1dGhlbnRpY2F0ZWQoKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiAkcS53aGVuKHsgdXNlcjogU2Vzc2lvbi51c2VyIH0pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KCcvc2Vzc2lvbicpLnRoZW4ob25TdWNjZXNzZnVsTG9naW4pLmNhdGNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgIH07XG5cbiAgICAgICAgdGhpcy5sb2dpbiA9IGZ1bmN0aW9uIChjcmVkZW50aWFscykge1xuICAgICAgICAgICAgY29uc29sZS5sb2coY3JlZGVudGlhbHMpO1xuICAgICAgICAgICAgcmV0dXJuICRodHRwLnBvc3QoJy9sb2dpbicsIGNyZWRlbnRpYWxzKS50aGVuKG9uU3VjY2Vzc2Z1bExvZ2luKTtcbiAgICAgICAgfTtcblxuICAgICAgICB0aGlzLmxvZ291dCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiAkaHR0cC5nZXQoJy9sb2dvdXQnKS50aGVuKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBTZXNzaW9uLmRlc3Ryb3koKTtcbiAgICAgICAgICAgICAgICAkcm9vdFNjb3BlLiRicm9hZGNhc3QoQVVUSF9FVkVOVFMubG9nb3V0U3VjY2Vzcyk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcblxuICAgICAgICB0aGlzLmlzQXV0aGVudGljYXRlZCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiAhIVNlc3Npb24udXNlcjtcbiAgICAgICAgfTtcblxuICAgIH0pO1xuXG4gICAgYXBwLnNlcnZpY2UoJ1Nlc3Npb24nLCBmdW5jdGlvbiAoJHJvb3RTY29wZSwgQVVUSF9FVkVOVFMpIHtcblxuICAgICAgICAkcm9vdFNjb3BlLiRvbihBVVRIX0VWRU5UUy5ub3RBdXRoZW50aWNhdGVkLCB0aGlzLmRlc3Ryb3kpO1xuICAgICAgICAkcm9vdFNjb3BlLiRvbihBVVRIX0VWRU5UUy5zZXNzaW9uVGltZW91dCwgdGhpcy5kZXN0cm95KTtcblxuICAgICAgICB0aGlzLmNyZWF0ZSA9IGZ1bmN0aW9uIChzZXNzaW9uSWQsIHVzZXIpIHtcbiAgICAgICAgICAgIHRoaXMuaWQgPSBzZXNzaW9uSWQ7XG4gICAgICAgICAgICB0aGlzLnVzZXIgPSB1c2VyO1xuICAgICAgICB9O1xuXG4gICAgICAgIHRoaXMuZGVzdHJveSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHRoaXMuaWQgPSBudWxsO1xuICAgICAgICAgICAgdGhpcy51c2VyID0gbnVsbDtcbiAgICAgICAgfTtcblxuICAgIH0pO1xuXG59KSgpOyIsIid1c2Ugc3RyaWN0JztcbmFwcC5jb25maWcoZnVuY3Rpb24gKCRzdGF0ZVByb3ZpZGVyKSB7XG5cbiAgICAkc3RhdGVQcm92aWRlci5zdGF0ZSgnaG9tZScsIHtcbiAgICAgICAgdXJsOiAnLycsXG4gICAgICAgIGNvbnRyb2xsZXI6ICdIb21lQ3RybCcsXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnanMvaG9tZS9ob21lLmh0bWwnXG4gICAgfSk7XG5cbn0pO1xuXG5hcHAuY29udHJvbGxlcignSG9tZUN0cmwnLCBmdW5jdGlvbiAoJHNjb3BlKSB7XG59KTsiLCJhcHAuY29udHJvbGxlcigncHJvZHVjdHJldmlld3Njb250cm9sbGVyJywgZnVuY3Rpb24oJHNjb3BlKXtcbiAgICAkc2NvcGUucmF0ZTEgPSAwO1xuXG4gICAgJHNjb3BlLnJhdGUyID0gNjtcblxuICAgICRzY29wZS5yZXZpZXdzbGlzdCA9IFtcbiAgICAgICAge1xuICAgICAgICAgICAgcmF0aW5nOiA1LFxuICAgICAgICAgICAgdGV4dDogXCJUaGVzZSBhcmUgcXVpdGUgc2ltcGx5IHRoZSBiZXN0IGdsYXNzZXMsIG5heSB0aGUgYmVzdCBBTllUSElORyBJJ3ZlIGV2ZXIgb3duZWQhIFwiICtcbiAgICAgICAgICAgIFwiV2hlbiBJIHB1dCB0aGVtIG9uLCBhbiBlbmVyZ3kgYmVhbSBzaG9vdHMgb3V0IG9mIG15IGV5ZWJhbGxzIHRoYXQgbWFrZXMgZXZlcnl0aGluZyBJIGxvb2sgYXQgXCIgK1xuICAgICAgICAgICAgXCJidXJzdCBpbnRvIGZsYW1lcyEhIE15IGdpcmxmcmllbmQgZG9lc24ndCBhcHByZWNpYXRlIGl0LCB0aG91Z2guXCJcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgcmF0aW5nOiAxLFxuICAgICAgICAgICAgdGV4dDogXCJUaGVzZSBnbGFzc2VzIGFyZSB0aGUgd29yc3QhIFdobyBtYWRlIHRoZXNlPyBXaGVuIEkgb3BlbmVkIHRoZSBwYWNrYWdlIHRoZXkgc3BydW5nIG91dCBhbmQgc3Vja2VkIFwiICtcbiAgICAgICAgICAgIFwib250byBteSBmYWNlIGxpa2UgdGhlIG1vbnN0ZXIgaW4gQUxJRU4hIEkgaGFkIHRvIGJlYXQgbXlzZWxmIGluIHRoZSBoZWFkIHdpdGggYSBzaG92ZWwgdG8gZ2V0IHRoZW0gb2ZmISBcIiArXG4gICAgICAgICAgICBcIldobyBBUkUgeW91IHBlb3BsZT8gV2hhdCBpcyB3cm9uZyB3aXRoIHlvdT8gSGF2ZSB5b3Ugbm8gZGlnbml0eT8gRG9uJ3QgeW91IHVuZGVyc3RhbmQgd2hhdCBleWVnbGFzc2VzIGFyZSBcIiArXG4gICAgICAgICAgICBcIkZPUj9cIlxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICByYXRpbmc6IDQsXG4gICAgICAgICAgICB0ZXh0OiBcIlRoZSBnbGFzc2VzIGFyZSBqdXN0IE9LIOKAlCB0byBzcGljZSB0aGluZ3MgdXAgSSBjaG9wcGVkIHVwIHNvbWUgc2NhbGxpb25zIGFuZCBhZGRlZCBzb21lIGhlYXZ5IGNyZWFtLCBhIHBpbmNoIG9mIHRhcnRhciwgXCIgK1xuICAgICAgICAgICAgXCJzb21lIGFuY2hvdnkgcGFzdGUsIGJhc2lsIGFuZCBhIGhhbGYgcGludCBvZiBtYXBsZSBzeXJ1cC4gVGhlIGdsYXNzIGluIHRoZSBnbGFzc2VzIHN0aWxsIGNhbWUgb3V0IGNydW5jaHkgdGhvdWdoLiBcIiArXG4gICAgICAgICAgICBcIkknbSB0aGlua2luZyBvZiBydW5uaW5nIHRoZW0gdGhyb3VnaCBhIG1peG11bGNoZXIgbmV4dCB0aW1lIGJlZm9yZSB0aHJvd2luZyBldmVyeXRoaW5nIGluIHRoZSBvdmVuLlwiXG4gICAgICAgIH1cbiAgICBdXG59KSIsImFwcFxuXG4gICAgLmNvbnN0YW50KCdyYXRpbmdDb25maWcnLCB7XG4gICAgICAgIG1heDogNSxcbiAgICB9KVxuXG4gICAgLmRpcmVjdGl2ZSgncmV2aWV3c3RhcicsIFsncmF0aW5nQ29uZmlnJywgZnVuY3Rpb24ocmF0aW5nQ29uZmlnKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICByZXN0cmljdDogJ0VBJyxcbiAgICAgICAgICAgIHJlcGxhY2U6IHRydWUsXG4gICAgICAgICAgICBzY29wZToge1xuICAgICAgICAgICAgICAgIHZhbHVlOiAnPSdcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBjb250cm9sbGVyOiBcInByb2R1Y3RyZXZpZXdzY29udHJvbGxlclwiLFxuICAgICAgICAgICAgdGVtcGxhdGU6ICc8ZGl2IGlkPVwic2hvd21lXCIgbmctbW91c2VsZWF2ZT1cInJlc2V0KClcIj48aSBpZD1cInNob3dtZVwiIG5nLXJlcGVhdD1cIm51bWJlciBpbiByYW5nZVwiICcgK1xuICAgICAgICAgICAgICAgICduZy1tb3VzZWVudGVyPVwiZW50ZXIobnVtYmVyKVwiIG5nLWNsaWNrPVwiYXNzaWduKG51bWJlcilcIiAnICtcbiAgICAgICAgICAgICAgICAnbmctY2xhc3M9XCJ7XFwnZ2x5cGhpY29uIGdseXBoaWNvbi1zdGFyIGljb24tZ29sZFxcJzogbnVtYmVyIDw9IHZhbCwgJyArXG4gICAgICAgICAgICAgICAgJ1xcJ2dseXBoaWNvbiBnbHlwaGljb24tc3RhciBpY29uLWdyYXlcXCc6IG51bWJlciA+IHZhbH1cIj48L2k+PC9kaXY+JyxcbiAgICAgICAgICAgIGxpbms6IGZ1bmN0aW9uKHNjb3BlLCBlbGVtZW50LCBhdHRycywgaW5kZXgpIHtcbiAgICAgICAgICAgICAgICB2YXIgbWF4UmFuZ2UgPSBhbmd1bGFyLmlzRGVmaW5lZChhdHRycy5tYXgpID8gc2NvcGUuJGV2YWwoYXR0cnMubWF4KSA6IHJhdGluZ0NvbmZpZy5tYXg7XG4gICAgICAgICAgICAgICAgc2NvcGUucmFuZ2UgPSBbXTtcbiAgICAgICAgICAgICAgICBmb3IodmFyIGkgPSAxOyBpIDw9IG1heFJhbmdlOyBpKysgKSB7XG4gICAgICAgICAgICAgICAgICAgIHNjb3BlLnJhbmdlLnB1c2goaSk7XG4gICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgICAgIHNjb3BlLnZhbCA9IHNjb3BlLnZhbHVlO1xuXG4gICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhzY29wZSk7XG5cblxuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgIH1dKTtcblxuYXBwLmNvbnRyb2xsZXIoJ3Byb2R1Y3RzdGFyJywgZnVuY3Rpb24oJHNjb3BlKSB7XG5cbiAgICAkc2NvcGUucmF0ZTEgPSAwO1xuXG4gICAgJHNjb3BlLnJhdGUyID0gNjtcblxuICAgICRzY29wZS52YWwgPSAkc2NvcGUucmF0aW5nO1xuXG59KTsiLCIndXNlIHN0cmljdCc7XG5cbmFwcC5ydW4oZnVuY3Rpb24gKCRjb29raWVzLCAkY29va2llU3RvcmUpIHtcblxuXHR2YXIgaW5pdCA9ICRjb29raWVTdG9yZS5nZXQoJ09yZGVyJyk7XG5cdGlmKCFpbml0KXtcblx0XHQkY29va2llU3RvcmUucHV0KCdPcmRlcicsIFtdKTtcblx0XHRjb25zb2xlLmxvZygnc3RhcnRpbmcgY29va2llOiAnLCAkY29va2llU3RvcmUuZ2V0KCdPcmRlcicpKTtcblx0fVxuXG59KTtcblxuYXBwLmNvbmZpZyhmdW5jdGlvbiAoJHN0YXRlUHJvdmlkZXIpIHtcblxuICAgIC8vIFJlZ2lzdGVyIG91ciAqaXRlbSogc3RhdGUuXG4gICAgJHN0YXRlUHJvdmlkZXIuc3RhdGUoJ2l0ZW0nLCB7XG4gICAgICAgIHVybDogJy9pdGVtLzpuYW1lJyxcbiAgICAgICAgY29udHJvbGxlcjogJ2l0ZW1Db250cm9sbGVyJyxcbiAgICAgICAgdGVtcGxhdGVVcmw6ICdqcy9pdGVtL2l0ZW0uaHRtbCdcbiAgICB9KTtcblxufSk7XG5cbmFwcC5jb250cm9sbGVyKCdpdGVtQ29udHJvbGxlcicsIGZ1bmN0aW9uICgkc2NvcGUsIEdldEl0ZW1GYWN0b3J5LCAkc3RhdGUsICRzdGF0ZVBhcmFtcywgJGNvb2tpZVN0b3JlLCBBdXRoU2VydmljZSwgT3JkZXJGYWN0b3J5ICkge1xuXG5cdC8vZ2V0IGlucHV0IGZyb20gdXNlciBhYm91dCBpdGVtIChpZCBmcm9tIHVybCApXG5cdC8vY2hlY2sgaWQgdnMgZGF0YWJhc2Vcblx0Ly9pZiBub3QgZm91bmQsIHJlZGlyZWN0IHRvIHNlYXJjaCBwYWdlXG5cdC8vaWYgZm91bmQgc2VuZCB0ZW1wYWxhdGVVcmxcblxuXHRHZXRJdGVtRmFjdG9yeS5nZXRJdGVtKCRzdGF0ZVBhcmFtcy5uYW1lKS50aGVuKGZ1bmN0aW9uKGl0ZW0sIGVycil7XG5cdFx0aWYoZXJyKSAkc3RhdGUuZ28oJ2hvbWUnKTtcblx0XHRlbHNle1xuXHRcdFx0JHNjb3BlLml0ZW0gPSBpdGVtWzBdO1xuXHRcdFx0fVxuXHR9KTtcblxuXHQkc2NvcGUuYWRkVG9PcmRlciA9IGZ1bmN0aW9uKCl7XG5cdFx0XG5cdFx0QXV0aFNlcnZpY2UuaXNBdXRoZW50aWNhdGVkKCkudGhlbihmdW5jdGlvbihhbnN3ZXIpe1xuXHRcdFx0dmFyIG9yZGVyID0gJGNvb2tpZXMuZ2V0KCdPcmRlcicpO1xuXHRcdFx0dmFyIGxpbmUgPSB7aXRlbTogJHNjb3BlLml0ZW0sIHF1YW50aXR5OiAxfTtcblx0XHRcdGlmKCFvcmRlcil7XG5cdFx0XHRcdCRjb29raWVzLnB1dCgnT3JkZXInLCBsaW5lKTtcblx0XHRcdH1cblx0XHRcdGVsc2V7XG5cdFx0XHRcdG9yZGVyLnB1c2gobGluZSk7XG5cdFx0XHRcdCRjb29raWVzLnB1dCgnT3JkZXInLCBvcmRlcik7XG5cdFx0XHR9XG5cblx0XHRcdGlmKGFuc3dlcil7XG5cdFx0XHRcdE9yZGVyRmFjdG9yeS5hZGRJdGVtKClcblx0XHRcdH1cblx0XHR9KVxuXHR9XG59KTsiLCIndXNlIHN0cmljdCc7XG5hcHAuY29uZmlnKGZ1bmN0aW9uICgkc3RhdGVQcm92aWRlcikge1xuXG4gICAgLy8gUmVnaXN0ZXIgb3VyICppdGVtQ3JlYXRlKiBzdGF0ZS5cbiAgICAkc3RhdGVQcm92aWRlci5zdGF0ZSgnYWRtaW4uaXRlbUNyZWF0ZScsIHtcbiAgICAgICAgdXJsOiAnL2l0ZW1DcmVhdGUnLFxuICAgICAgICBjb250cm9sbGVyOiAnaXRlbUNyZWF0ZUNvbnRyb2xsZXInLFxuICAgICAgICB0ZW1wbGF0ZVVybDogJ2pzL2l0ZW1DcmVhdGUvaXRlbUNyZWF0ZS5odG1sJyxcbiAgICAgICAgcmVzb2x2ZToge1xuICAgICAgICBcdGdldEl0ZW1zOiAgZnVuY3Rpb24oJGh0dHApe1xuICAgICAgICBcdFx0cmV0dXJuICRodHRwLmdldCgnL2FwaS9pdGVtbGlzdCcpLnRoZW4oZnVuY3Rpb24gKHJlc3BvbnNlKXtcblx0XHRcdFx0XHRyZXR1cm4gcmVzcG9uc2UuZGF0YTtcbiAgICAgICAgXHRcdFx0fSlcbiAgICAgICAgXHRcdH1cbiAgICAgICAgXHR9XG4gICAgfSk7XG5cbn0pO1xuXG5hcHAuY29udHJvbGxlcignaXRlbUNyZWF0ZUNvbnRyb2xsZXInLCBmdW5jdGlvbiAoJHNjb3BlLCBDcmVhdGVJdGVtRmFjdG9yeSwgZ2V0SXRlbXMsICRzdGF0ZSwgJHN0YXRlUGFyYW1zKSB7XG5cblx0JHNjb3BlLml0ZW07XG5cdCRzY29wZS5zdWNjZXNzO1xuXG5cdCRzY29wZS5tZW51SXRlbXMgPSBbXG5cdFx0eyBsYWJlbDogJ2FsbCBpdGVtcyd9LFxuICAgICAgICB7IGxhYmVsOiAnbWVucyd9LFxuICAgICAgICB7IGxhYmVsOiAnd29tZW5zJ30sXG4gICAgICAgIHsgbGFiZWw6ICdraWRzJ30sXG4gICAgICAgIHsgbGFiZWw6ICdwZXRzJ31cbiAgICBdO1xuXG5cdCRzY29wZS5hbGxJdGVtcyA9IGdldEl0ZW1zXG5cblx0JHNjb3BlLml0ZW1zID0gJHNjb3BlLmFsbEl0ZW1zXG5cblx0JHNjb3BlLmZpbHRlckl0ZW1zID0gZnVuY3Rpb24gKGNhdGVnb3J5KSB7XG5cdFx0aWYgKGNhdGVnb3J5ID0gJ2FsbCBpdGVtcycpIHtcblx0XHRcdHJldHVybiAkc2NvcGUuaXRlbXMgPSAkc2NvcGUuYWxsSXRlbXNcblx0XHR9XG5cdH1cblxuXHRjb25zb2xlLmxvZygkc2NvcGUuaXRlbXNbMF0uYXZhaWxhYmxlKVxuXG5cdCRzY29wZS5zdWJtaXRJdGVtID0gZnVuY3Rpb24oKSB7XG5cdFx0Ly8kc2NvcGUuaXRlbS5jYXRlZ29yaWVzID0gJHNjb3BlLml0ZW0uY2F0ZWdvcmllcy5zcGxpdCgnICcpO1xuXHRcdGNvbnNvbGUubG9nKCdwcm9jZXNzIHN0YXJ0ZWQnKTtcblx0XHRjb25zb2xlLmxvZygkc2NvcGUuaXRlbSk7XG5cdFx0Q3JlYXRlSXRlbUZhY3RvcnkucG9zdEl0ZW0oJHNjb3BlLml0ZW0pLnRoZW4oZnVuY3Rpb24oaXRlbSwgZXJyKXtcblx0XHRcdGlmKGVycikgJHNjb3BlLnN1Y2Nlc3M9IGZhbHNlO1xuXHRcdFx0ZWxzZXtcblx0XHRcdFx0Y29uc29sZS5sb2coaXRlbSk7XG5cdFx0XHRcdCRzY29wZS5zdWNjZXNzID0gdHJ1ZTtcblx0XHRcdFx0XG5cdFx0XHR9XG5cdFx0fSk7XG5cdH1cbn0pOyIsImFwcC5jb25maWcoZnVuY3Rpb24gKCRzdGF0ZVByb3ZpZGVyKSB7XG5cbiAgICAvLyBSZWdpc3RlciBvdXIgKkpvaW4gTm93KiBzdGF0ZS5cbiAgICAkc3RhdGVQcm92aWRlci5zdGF0ZSgnam9pbicsIHtcbiAgICAgICAgdXJsOiAnL2pvaW4nLFxuICAgICAgICBjb250cm9sbGVyOiAnam9pbkNvbnRyb2xsZXInLFxuXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnanMvam9pbm5vdy9qb2lubm93Lmh0bWwnIFxuXG4gICAgfSk7XG5cbn0pO1xuXG5cblxuYXBwLmNvbnRyb2xsZXIoJ2pvaW5Db250cm9sbGVyJywgZnVuY3Rpb24oJHNjb3BlLCAkd2luZG93LCBDcmVhdGVVc2VyRmFjdG9yeSwgQXV0aFNlcnZpY2UpIHtcblxuICAgICRzY29wZS5sb2dpbm9hdXRoID0gZnVuY3Rpb24gKHByb3ZpZGVyKSB7XG4gICAgICAgIHZhciBsb2NhdGlvbiA9ICdhdXRoLycgKyBwcm92aWRlcjtcbiAgICAgICAgJHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gbG9jYXRpb247XG4gICAgfVxuXG4gICAgJHNjb3BlLnN1Y2Nlc3M7XG5cblxuICAgICRzY29wZS5zdWJtaXRVc2VyID0gZnVuY3Rpb24oKSB7XG4gICAgXHRjb25zb2xlLmxvZyhcInVzZXIgc3VibWl0IHByb2Nlc3Mgc3RhcnRlZFwiKTtcbiAgICBcdGNvbnNvbGUubG9nKCRzY29wZS51c2VyKTtcblx0ICAgIENyZWF0ZVVzZXJGYWN0b3J5LnBvc3RVc2VyKCRzY29wZS51c2VyKS50aGVuKGZ1bmN0aW9uKHVzZXIsIGVycil7XG5cdCAgICBcdGlmIChlcnIpICRzY29wZS5zdWNjZXNzPWZhbHNlO1xuXHQgICAgXHRlbHNle1xuICAgICAgICAgICAgICAgIEF1dGhTZXJ2aWNlLmxvZ2luKHVzZXIpLnRoZW4oZnVuY3Rpb24oY29uY2x1c2lvbil7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHVzZXIpO1xuICAgICAgICAgICAgICAgICAgICAkc2NvcGUuc3VjY2VzcyA9IHRydWU7XG4gICAgICAgICAgICAgICAgfSk7XG5cdCAgICBcdH1cblx0ICAgIH0pO1xuXHQgIH1cblxuICAgICAgZnVuY3Rpb24gdmFsaWRhdGVQYXNzd29yZCAoZW1haWwpe1xuICAgICAgICByZWdleCA9IC9eKFtcXHctXFwuXStAKD8hZ21haWwuY29tKSg/IXlhaG9vLmNvbSkoPyFob3RtYWlsLmNvbSkoW1xcdy1dK1xcLikrW1xcdy1dezIsNH0pPyQvO1xuICAgICAgICByZXR1cm4gcmVnZXgudGVzdChlbWFpbCk7XG4gICAgICB9XG5cbn0pO1xuXG4iLCJhcHAuY29uZmlnKGZ1bmN0aW9uICgkc3RhdGVQcm92aWRlcikge1xuXG4gICAgLy8gUmVnaXN0ZXIgb3VyICpKb2luIE5vdyogc3RhdGUuXG4gICAgJHN0YXRlUHJvdmlkZXIuc3RhdGUoJ2xvZ2luJywge1xuICAgICAgICB1cmw6ICcvbG9naW4nLFxuICAgICAgICBjb250cm9sbGVyOiAnbG9naW5Db250cm9sbGVyJyxcbiAgICAgICAgdGVtcGxhdGVVcmw6ICdqcy9sb2dpbi9sb2dpbi5odG1sJyBcbiAgICB9KTtcblxufSk7XG5cblxuYXBwLmNvbnRyb2xsZXIoJ2xvZ2luQ29udHJvbGxlcicsIGZ1bmN0aW9uICgkc2NvcGUsICR3aW5kb3csIEF1dGhTZXJ2aWNlLCAkc3RhdGUsIFNlc3Npb24sICRyb290U2NvcGUpIHtcbiAgICAkc2NvcGUubG9naW5vYXV0aCA9IGZ1bmN0aW9uIChwcm92aWRlcikge1xuICAgICAgICB2YXIgbG9jYXRpb24gPSAnYXV0aC8nICsgcHJvdmlkZXI7XG4gICAgICAgICR3aW5kb3cubG9jYXRpb24uaHJlZiA9IGxvY2F0aW9uO1xuICAgIH1cbiAgICAkc2NvcGUuc3VjY2VzcztcbiAgICAkc2NvcGUuc3VibWl0VXNlciA9IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgaW5mbyA9ICRzY29wZS51c2VyO1xuICAgICAgICBjb25zb2xlLmxvZyhcInVzZXIgbG9naW4gcHJvY2VzcyBzdGFydGVkIHdpdGg6IFwiLCBpbmZvKTtcbiAgICAgICAgQXV0aFNlcnZpY2UubG9naW4oaW5mbykudGhlbihmdW5jdGlvbihpbmZvKXtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiY29udHJvbGxlclwiLCBpbmZvKTtcbiAgICAgICAgICAgICAgICBpZiAoaW5mby5hZG1pbikge1xuICAgICAgICAgICAgICAgICAgICAkc3RhdGUuZ28oJ2FkbWluJylcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAkc3RhdGUuZ28oJ3Byb2R1Y3RzJylcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIC8vIHRoaXMgaXMganVzdCB0ZXN0aW5nIHNlc3Npb25zIHN0YXJ0ZWRcbiAgICAkc2NvcGUuaXNMb2dnZWRJbiA9IEF1dGhTZXJ2aWNlLmlzQXV0aGVudGljYXRlZCgpO1xuICAgIC8vIGVuZCB0ZXN0XG5cblxuXG4gICAgICAgIC8vIEdldFVzZXJGYWN0b3J5LmF1dGhVc2VyKGluZm8pLnRoZW4oZnVuY3Rpb24odXNlciwgZXJyKXtcbiAgICAgICAgLy8gICAgIGlmKGVycikgJHNjb3BlLnN1Y2Nlc3MgPSBmYWxzZTtcbiAgICAgICAgLy8gICAgIGVsc2Uge1xuICAgICAgICAvLyAgICAgICAgICRyb290U2NvcGUuc3VjY2VzcyA9IGZhbHNlO1xuICAgICAgICAvLyAgICAgICAgIGNvbnNvbGUubG9nKCRyb290U2NvcGUuY3VycmVudFVzZXIpXG4gICAgICAgIC8vICAgICAgICAgaWYgKHVzZXJbMF0uYWRtaW4pIHtcbiAgICAgICAgLy8gICAgICAgICAgICAgJHN0YXRlLmdvKCdhZG1pbicpXG4gICAgICAgIC8vICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gICAgICAgICAgICAgJHN0YXRlLmdvKCdob21lJylcbiAgICAgICAgLy8gICAgICAgICB9XG4gICAgICAgIC8vICAgICB9XG4gICAgICAgIC8vIH0pICAgICAgXG5cbiAgICB9O1xufSk7XG4iLCIndXNlIHN0cmljdCc7XG5hcHAuY29uZmlnKGZ1bmN0aW9uICgkc3RhdGVQcm92aWRlcikge1xuXG4gICAgLy8gUmVnaXN0ZXIgb3VyICpvcmRlcnMqIHN0YXRlLlxuICAgICRzdGF0ZVByb3ZpZGVyLnN0YXRlKCdvcmRlcnMnLCB7XG4gICAgICAgIHVybDogJy9vcmRlci86bmFtZScsXG4gICAgICAgIGNvbnRyb2xsZXI6ICdvcmRlckNvbnRyb2xsZXInLFxuICAgICAgICB0ZW1wbGF0ZVVybDogJ2pzL29yZGVyL29yZGVyLmh0bWwnXG4gICAgfSk7XG5cbn0pO1xuXG5hcHAuY29udHJvbGxlcignb3JkZXJDb250cm9sbGVyJywgZnVuY3Rpb24gKCRzY29wZSwgR2V0SXRlbXNGYWN0b3J5LCBPcmRlckZhY3RvcnksICRzdGF0ZSwgJHN0YXRlUGFyYW1zLCAkY29va2llU3RvcmUsIEF1dGhTZXJ2aWNlKSB7XG5cblx0Ly9wcm92aWRlcyBnZW5lcmFsIGZ1bmN0aW9uYWxpdHkgd2l0aCBhbiBvcmRlclxuXHQvL3ZpZXdzIGN1cnJlbnQgdXNlciBvcmRlclxuXHRcdC8vb3JkZXIgaXMgc2hvd24gYnkgbGluZSBpdGVtXG5cdFx0Ly9oYXMgYWJpbGl0eSB0byBlZGl0IG9yZGVyLCBvciBwcm9jZWVkIHRvIGNoZWNrb3V0XG5cdCRzY29wZS5hY3RpdmVvcmRlcnM9W107IC8vZXhwZWN0cyBpdGVtIHtpdGVtSWQ6IGl0ZW1JZCwgcHJpY2U6IG51bSwgaW1nVXJsOlN0cmluZywgfSwgcXR5OiBudW1cblx0JHNjb3BlLnBhc3RvcmRlcnM9W107XG5cdCRzY29wZS51c2VyO1xuXHQkc2NvcGUuc3VtID0gMDtcblx0JHNjb3BlLnRvdGFsUXR5ID0gMDsgXG5cdCRzY29wZS50ZW1wVmFsO1xuXHQkc2NvcGUub3JkZXJJZDtcblx0JHNjb3BlLnVzZXJJZDtcblx0JHNjb3BlLmF1dGg7XG5cblx0ZnVuY3Rpb24gZmlyc3RVcGRhdGUgKCl7XG5cdC8vY2hlY2sgaWYgdXNlciBpcyBhdXRoZW50aWNhdGVkLCBwb3B1bGF0ZSBvcmRlciBmcm9tIGRiLCBzZXQgb3JkZXIgdG8gY29va2llXG5cdFx0aWYoIEF1dGhTZXJ2aWNlLmlzQXV0aGVudGljYXRlZCgpICl7XG5cdFx0XHRBdXRoU2VydmljZS5nZXRMb2dnZWRJblVzZXIoKS50aGVuKGZ1bmN0aW9uKHVzZXIpe1xuXHRcdFx0JHNjb3BlLnVzZXJJZCA9IHVzZXIuX2lkO1xuXHRcdFx0JHNjb3BlLnVzZXIgPSB1c2VyLmZpcnN0X25hbWU7XG5cdFx0XHQkc2NvcGUuYXV0aCA9IHRydWU7XG5cdFx0XHRcdE9yZGVyRmFjdG9yeS5nZXRPcmRlcnMoJHNjb3BlLnVzZXJJZCkudGhlbihmdW5jdGlvbihpdGVtcywgZXJyKXtcblx0XHRcdFx0XHRjb25zb2xlLmxvZygnaXRlbXMnLCBpdGVtcyk7XG5cdFx0XHRcdFx0aWYgKGVycikgY29uc29sZS5sb2coJ0Vycm9yOiAnLCBlcnIpO1xuXHRcdFx0XHRcdGVsc2UgaWYoIWl0ZW1zKSB7IC8vbm8gaXRlbXMgaW4gZEIsIGdldCBjb29raWVzLCBzZXQgb3JkZXJcblx0XHRcdFx0XHRcdCRzY29wZS5hY3RpdmVvcmRlcnMgPSAkY29va2llU3RvcmUuZ2V0KCdPcmRlcicpO1xuXHRcdFx0XHRcdFx0T3JkZXJGYWN0b3J5LmNyZWF0ZU9yZGVyKHt1c2VySWQ6ICRzY29wZS51c2VySWQsIGl0ZW1zOiAkc2NvcGUuYWN0aXZlb3JkZXJzfSwgZnVuY3Rpb24ocmVzcG9uc2Upe1xuXHRcdFx0XHRcdFx0XHQkc2NvcGUuYWN0aXZlb3JkZXJzID0gcmVzcG9uc2UubGluZWl0ZW1zO1xuXHRcdFx0XHRcdFx0XHRzdW0oKTtcblx0XHRcdFx0XHRcdFx0dG90YWxRdHkoKTtcblx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRlbHNlIHsgLy9pdGVtcyBpbiBkYiwgbWFrZSBzdXJlIGNvb2tpZXMgYXJlIGFkZGVkIHRvIGRiXG5cdFx0XHRcdFx0XHQkc2NvcGUuYWN0aXZlb3JkZXJzID0gaXRlbXMubGluZWl0ZW1zLmxpbmVJdGVtO1xuXHRcdFx0XHRcdFx0JHNjb3BlLm9yZGVySWQgPSBpdGVtcy5vcmRlcklkO1xuXHRcdFx0XHRcdFx0c3VtKCk7XG5cdFx0XHRcdFx0XHR0b3RhbFF0eSgpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSk7XG5cdFx0XHR9KTtcblx0XHR9XG5cdFx0ZWxzZSB7XG5cdFx0XHR2YXIgaWRBbmRRdHkgPSAkY29va2llU3RvcmUuZ2V0KCdPcmRlcicpO1xuXHRcdFx0dmFyIHByb2R1Y3RMaXN0PVtdO1xuXHRcdFx0R2V0SXRlbXNGYWN0b3J5LmdldEl0ZW1zKCkudGhlbihmdW5jdGlvbihpdGVtcywgZXJyKXsgLy9hcHByb2FjaCB3aWxsIG5vdCBzY2FsZSB3ZWxsIGJ1dCBpcyBxdWlja2VyIG5vd1xuXHRcdFx0XHRpZihlcnIpIGNvbnNvbGUubG9nKGVycik7XG5cdFx0XHRcdGlkQW5kUXR5LmZvckVhY2goZnVuY3Rpb24oaXRlbVBhaXIpe1xuXHRcdFx0XHRcdGZvcih2YXIgYT0wLCBsZW49aXRlbXMubGVuZ3RoOyBhPDc7IGErKyl7XG5cdFx0XHRcdFx0XHRpZihpdGVtUGFpci5pdGVtSWQgPT09IGl0ZW1zW2FdLl9pZCl7XG5cdFx0XHRcdFx0XHRcdHByb2R1Y3RMaXN0LnB1c2goe2l0ZW06IGl0ZW1zW2FdLCBxdWFudGl0eTogaXRlbVBhaXIucXVhbnRpdHkgfSk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9KTtcblx0XHRcdFx0Y29uc29sZS5sb2coJ3Byb2RMaXN0JywgcHJvZHVjdExpc3QpO1xuXHRcdFx0XHQkc2NvcGUuYWN0aXZlb3JkZXJzID0gcHJvZHVjdExpc3Q7XG5cdFx0XHRcdCRzY29wZS51c2VyID0gJ1VzZXInO1xuXHRcdFx0XHQkc2NvcGUuYXV0aCA9IGZhbHNlO1xuXHRcdFx0XHRzdW0oKTtcblx0XHRcdFx0dG90YWxRdHkoKTtcblx0XHRcdH0pXG5cdFx0fVxuXHR9O1xuXG5cdGZpcnN0VXBkYXRlKCk7XG5cblx0ZnVuY3Rpb24gdG90YWxRdHkgKCl7XG5cdFx0dmFyIHRvdGFsUSA9IDA7XG5cdFx0Y29uc29sZS5sb2coJ2dvdCB0byBzdW0nKTtcblx0XHQkc2NvcGUuYWN0aXZlb3JkZXJzLmZvckVhY2goZnVuY3Rpb24obGluZUl0ZW0pe1xuXHRcdFx0dG90YWxRPSB0b3RhbFEgKyBsaW5lSXRlbS5xdWFudGl0eTtcblx0XHR9KVxuXHRcdCRzY29wZS50b3RhbFF0eSA9IHRvdGFsUTtcblx0fTtcblxuXHQkc2NvcGUucmVtb3ZlSXRlbSA9IGZ1bmN0aW9uKGl0ZW0pe1xuXHRcdC8vcmVtb3ZlIGl0ZW0gZnJvbSBkYiwgcmVtb3ZlIGl0ZW0gZnJvbSBjb29raWUsIHJlbW92ZSBpdGVtIGZyb20gc2NvcGVcblx0XHQvL2lmIGF1dGhlbnRpY2F0ZWQsIHJlbW92ZSBpdGVtIGZyb20gb3JkZXJcblx0XHR2YXIgbXlPcmRlckNvb2tpZSA9ICRjb29raWVTdG9yZS5nZXQoJ09yZGVyJyk7XG5cdFx0Y29uc29sZS5sb2cobXlPcmRlckNvb2tpZSwgaXRlbSk7XG5cdFx0dmFyIGxvY2F0aW9uID0gZ2V0TG9jSW5Db29raWUobXlPcmRlckNvb2tpZSwgaXRlbS5faWQpO1xuXG5cdFx0dmFyIHJlbW92ZWRJdGVtID0gbXlPcmRlckNvb2tpZS5zcGxpY2UobG9jYXRpb24sIDEpO1xuXHRcdCRjb29raWVTdG9yZS5wdXQoJ09yZGVyJywgbXlPcmRlckNvb2tpZSk7XG5cblx0XHQkc2NvcGUuYWN0aXZlb3JkZXJzLnNwbGljZShsb2NhdGlvbiwxKTtcblx0XHRzdW0oKTtcblx0XHR0b3RhbFF0eSgpO1xuXG5cdFx0aWYoQXV0aFNlcnZpY2UuaXNBdXRoZW50aWNhdGVkKCkpe1xuXHRcdFx0T3JkZXJGYWN0b3J5LnVwZGF0ZU9yZGVyKHtvcmRlcklkOiAkc2NvcGUub3JkZXJJZCwgcXVhbnRpdHk6IDAsIGl0ZW1JZDogSXRlbS5faWR9KS50aGVuKGZ1bmN0aW9uKGVyciwgZGF0YSl7XG5cdFx0XHRcdGlmKGVycikgY29uc29sZS5sb2coZXJyKTtcblxuXHRcdFx0fSk7XG5cdFx0XHQkc2NvcGUuYXV0aCA9IHRydWU7XG5cdFx0fVxuXHR9XG5cblx0ZnVuY3Rpb24gZ2V0TG9jSW5Db29raWUgKGNvb2tpZXMsIGlkKXtcblx0XHR2YXIgbG9jO1xuXHRcdGNvb2tpZXMuZm9yRWFjaChmdW5jdGlvbihlbGVtZW50LCBpbmRleCl7XG5cdFx0XHRpZihlbGVtZW50Lml0ZW1JZCA9PT0gaWQpe1xuXHRcdFx0XHRjb25zb2xlLmxvZyhlbGVtZW50Lml0ZW1JZCwgXCIgaXMgdGhlIGNvcnJlY3Qga2V5XCIpO1xuXHRcdFx0XHRsb2MgPSBpbmRleDtcblx0XHRcdH1cblx0XHR9KTtcblx0XHRyZXR1cm4gbG9jO1xuXHR9XG5cblx0JHNjb3BlLnVwZGF0ZU9yZGVyID0gZnVuY3Rpb24oaXRlbSwgdmFsKXtcblx0XHQvL3Rha2VzIGluIGluZm9ybWF0aW9uIGFib3V0IHRoZSB1c2VyLCBcblx0XHRpZih2YWwgPT0gMCl7XG5cdFx0XHQkc2NvcGUucmVtb3ZlSXRlbShpdGVtLml0ZW0pO1xuXHRcdH1cblx0XHRlbHNle1xuXHRcdFx0aWYoJHNjb3BlLnVzZXJJZCl7XG5cdFx0XHRcdE9yZGVyRmFjdG9yeS51cGRhdGVPcmRlcih7b3JkZXJJZDogJHNjb3BlfSk7XG5cdFx0XHR9XG5cdFx0XHR2YXIgb3JkZXJDb29raWUgPSAkY29va2llU3RvcmUuZ2V0KCdPcmRlcicpO1xuXHRcdFx0dmFyIGluZGV4ID0gZ2V0TG9jSW5Db29raWUob3JkZXJDb29raWUsIGl0ZW0uaXRlbS5faWQpO1xuXHRcdFx0b3JkZXJDb29raWVbaW5kZXhdLnF1YW50aXR5ID0gTnVtYmVyKHZhbCk7XG5cdFx0XHQkY29va2llU3RvcmUucHV0KCdPcmRlcicsIG9yZGVyQ29va2llKTtcblxuXHRcdFx0JHNjb3BlLmFjdGl2ZW9yZGVyc1tpbmRleF0ucXVhbnRpdHkgPSBOdW1iZXIodmFsKTtcblx0XHRcdHN1bSgpO1xuXHRcdFx0dG90YWxRdHkoKTtcblx0XHR9XG5cdFx0XG5cdH07IFxuXHQkc2NvcGUubmV3TnVtYmVyID0gZnVuY3Rpb24oaXRlbSwgdmFsKXtcblx0XHRjb25zb2xlLmxvZygnaXRlbScsIGl0ZW0sICd2YWwnLCB2YWwpO1xuXHR9XG5cdC8vZ2V0IHVzZXIgaW5mb3JtYXRpb24gYW5kIHNlbmQgSWRcblxuXHQkc2NvcGUuc2hvd0Nvb2tpZSA9IGZ1bmN0aW9uKCl7XG5cdFx0Y29uc29sZS5sb2coJGNvb2tpZVN0b3JlLmdldCgnT3JkZXInKSk7XG5cdFx0JHNjb3BlLmFjdGl2ZW9yZGVycyA9ICRjb29raWVTdG9yZS5nZXQoJ09yZGVyJyk7XG5cdH1cblxuXHQkc2NvcGUuZGVsZXRlQ29va2llID0gZnVuY3Rpb24oKXtcblx0XHQkY29va2llU3RvcmUucmVtb3ZlKCdPcmRlcicpO1xuXHRcdGNvbnNvbGUubG9nKCRjb29raWVTdG9yZS5nZXQoJ09yZGVyJykpO1xuXHR9XG5cdCRzY29wZS5zaG93T3JkZXJGcm9tRGIgPSBmdW5jdGlvbigpe1xuXHRcdC8vY29uc29sZS5sb2coQXV0aFNlcnZpY2UuaXNBdXRoZW50aWNhdGVkKCkpO1xuXHRcdGlmKCRzY29wZS51c2VySWQpe1xuXHRcdFx0T3JkZXJGYWN0b3J5LmdldE9yZGVycygkc2NvcGUudXNlcklkKS50aGVuKGZ1bmN0aW9uKHJlc3VsdCwgZXJyKXtcblx0XHRcdFx0Y29uc29sZS5sb2coJ3Jlc3VsdHMnLCByZXN1bHQsJ0Vycm9yJywgZXJyKTtcblx0XHRcdH0pXG5cdFx0fVxuXHRcdGVsc2Uge1xuXHRcdFx0Y29uc29sZS5sb2coJ05vIHVzZXIgZXhpc3RzJyk7XG5cdFx0fVxuXHRcdFxuXHR9XG5cblx0ZnVuY3Rpb24gc3VtICgpe1xuXHRcdHZhciB0b3RhbCA9IDA7XG5cdFx0Y29uc29sZS5sb2coJ2dvdCB0byBzdW0nKTtcblx0XHQkc2NvcGUuYWN0aXZlb3JkZXJzLmZvckVhY2goZnVuY3Rpb24obGluZUl0ZW0pe1xuXHRcdFx0Y29uc29sZS5sb2cobGluZUl0ZW0pO1xuXHRcdFx0dG90YWw9IHRvdGFsICsgbGluZUl0ZW0uaXRlbS5wcmljZSAqIGxpbmVJdGVtLnF1YW50aXR5O1xuXHRcdH0pXG5cdFx0JHNjb3BlLnN1bSA9IHRvdGFsO1xuXHR9O1xuXHRcbn0pOyIsIid1c2Ugc3RyaWN0JztcbmFwcC5jb25maWcoZnVuY3Rpb24gKCRzdGF0ZVByb3ZpZGVyKSB7XG5cbiAgICBcbiAgICAkc3RhdGVQcm92aWRlci5zdGF0ZSgnYWRtaW4ub3JkZXJNb2RpZnknLCB7XG4gICAgICAgIHVybDogJy9vcmRlck1vZGlmeScsXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnanMvb3JkZXJNb2RpZnkvb3JkZXJNb2RpZnkuaHRtbCcsXG4gICAgICAgIGNvbnRyb2xsZXI6ICdvcmRlck1vZGlmeUNvbnRyb2xsZXInLFxuICAgICAgICByZXNvbHZlOiB7XG4gICAgICAgIFx0Z2V0T3JkZXJzOiAgZnVuY3Rpb24oJGh0dHApe1xuICAgICAgICBcdFx0XHQvLyB2YXIgb3JkZXJPYmplY3QgPSB7fVxuICAgICAgICBcdFx0XHRyZXR1cm4gJGh0dHAuZ2V0KCcvYXBpL2FkbWluL29yZGVyJylcbiAgICAgICAgXHRcdFx0XHQudGhlbihmdW5jdGlvbihyZXNwb25zZSl7XG4gICAgICAgIFx0XHRcdFx0XHRyZXR1cm4gcmVzcG9uc2UuZGF0YVxuICAgICAgICBcdFx0XHRcdFx0fSlcbiAgICAgICAgXHRcdFx0fVxuICAgICAgICBcdFx0fVxuICAgXHR9KVxufSk7XG5cbmFwcC5jb250cm9sbGVyKCdvcmRlck1vZGlmeUNvbnRyb2xsZXInLCBcblx0ZnVuY3Rpb24gKCRzY29wZSwgb3JkZXJNb2RpZnlGYWN0b3J5LCAkc3RhdGUsICRzdGF0ZVBhcmFtcywgJHJvb3RTY29wZSwgZ2V0T3JkZXJzKSB7XG5cblx0JHNjb3BlLml0ZW0gPSB7XG5cdFx0Y2F0ZWdvcmllczogW10gfTtcblx0JHNjb3BlLnN1Y2Nlc3M7XG5cblx0JHNjb3BlLmFsbE9yZGVycyA9IGdldE9yZGVyc1xuXG5cdCRzY29wZS5vcmRlcnM7XG5cblx0JHNjb3BlLm1lbnVJdGVtcyA9IFtcblx0XHR7IGxhYmVsOiAnYWxsIG9yZGVycyd9LFxuICAgICAgICB7IGxhYmVsOiAnb3Blbid9LFxuICAgICAgICB7IGxhYmVsOiAncGxhY2VkJ30sXG4gICAgICAgIHsgbGFiZWw6ICdzaGlwcGVkJ30sXG4gICAgICAgIHsgbGFiZWw6ICdjb21wbGV0ZSd9XG4gICAgXTtcblxuICAgICRzY29wZS5jaGFuZ2VTdGF0dXNNZW51SXRlbXMgPSBbXG4gICAgICAgIHsgbGFiZWw6ICdvcGVuJ30sXG4gICAgICAgIHsgbGFiZWw6ICdwbGFjZWQnfSxcbiAgICAgICAgeyBsYWJlbDogJ3NoaXBwZWQnfSxcbiAgICAgICAgeyBsYWJlbDogJ2NvbXBsZXRlJ31cbiAgICBdO1xuXG5cdCRzY29wZS5maWx0ZXJPcmRlcnMgPSBmdW5jdGlvbihzdGF0dXMpIHtcblx0XHQkc2NvcGUub3JkZXJzID0gb3JkZXJNb2RpZnlGYWN0b3J5LmZpbHRlck9yZGVycyhzdGF0dXMsICRzY29wZS5hbGxPcmRlcnMpXG5cblx0XHQkc2NvcGUuZmlsdGVyZWQgPSBmYWxzZTtcblx0fVxuXG4gICAgJHNjb3BlLmNoYW5nZVN0YXR1cyA9IGZ1bmN0aW9uIChvcmRlcklkLCBzdGF0dXMsIGluZGV4KSB7XG4gICAgICAgIHZhciBkYXRhID0gW29yZGVySWQsIHN0YXR1c11cbiAgICAgICAgJHNjb3BlLm9yZGVyc1tpbmRleF0uc3RhdHVzID0gc3RhdHVzXG4gICAgICAgIG9yZGVyTW9kaWZ5RmFjdG9yeS5tb2RpZnlPcmRlcihkYXRhKVxuICAgIH1cbn0pOyIsIid1c2Ugc3RyaWN0JztcbmFwcC5jb25maWcoZnVuY3Rpb24gKCRzdGF0ZVByb3ZpZGVyKSB7XG5cbiAgICAkc3RhdGVQcm92aWRlci5zdGF0ZSgnYWRtaW4ucHJvZHVjdENhdENyZWF0ZScsIHtcbiAgICAgICAgdXJsOiAnL3Byb2R1Y3RDYXRDcmVhdGUnLFxuICAgICAgICB0ZW1wbGF0ZVVybDogJ2pzL3Byb2R1Y3RDYXRDcmVhdGUvcHJvZHVjdENhdENyZWF0ZS5odG1sJ1xuICAgIH0pO1xuXG59KTsiLCJhcHAuY29uZmlnKGZ1bmN0aW9uICgkc3RhdGVQcm92aWRlcikge1xuXG4gICAgLy8gUmVnaXN0ZXIgb3VyICpSZXZpZXcgRW50cnkqIHN0YXRlLlxuICAgICRzdGF0ZVByb3ZpZGVyLnN0YXRlKCdyZXZpZXctZW50cnknLCB7XG4gICAgICAgIHVybDogJzpuYW1lLzp1cmwvcmV2aWV3LWVudHJ5JyxcbiAgICAgICAgY29udHJvbGxlcjogZnVuY3Rpb24oJHNjb3BlLCBDcmVhdGVSZXZpZXcsICRzdGF0ZSwgJHN0YXRlUGFyYW1zKSB7XG4gICAgICAgICAgICAkc2NvcGUucHJvZHVjdG5hbWUgPSAkc3RhdGVQYXJhbXMubmFtZTtcbiAgICAgICAgICAgICRzY29wZS5wcm9kdWN0dXJsID0gJHN0YXRlUGFyYW1zLnVybDtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiaW4gY29ucm9sbGVyXCIsICRzY29wZSk7XG5cbiAgICAgICAgICAgICRzY29wZS5uZXdSZXZpZXcgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBcdGNvbnNvbGUubG9nKFwiaW5zaWRlIG5ld1Jldmlld1wiLCAkc2NvcGUucHJvZHVjdG5hbWUpO1xuICAgICAgICAgICAgXHR2YXIgaW5mbyA9ICRzY29wZS5wcm9kdWN0bmFtZTtcbiAgICAgICAgICAgIFx0Q3JlYXRlUmV2aWV3LnN1Ym1pdFJldmlldyhpbmZvKS50aGVuKGZ1bmN0aW9uKHVzZXIsIGVycil7XG5cdCAgICBcdFx0XHRcdFx0aWYgKGVycikgJHNjb3BlLnN1Y2Nlc3MgPSBmYWxzZTtcblx0ICAgIFx0XHRcdFx0XHRcdGVsc2V7XG4gICAgICAgICAgICAgICAgICAgICRzdGF0ZS5nbygncHJvZHVjdHMnKTtcbiAgICAgICAgICAgICAgXHR9XG5cdCAgICBcdFx0XHRcdH0pXG5cdCAgIFx0XHRcdFx0fTtcbiAgICAgICAgIH0sXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnanMvcmV2aWV3LWVudHJ5L3Jldmlldy1lbnRyeS5odG1sJ1xuICAgIH0pXG5cbn0pO1xuXG5cbiIsImFwcFxuXG4gICAgLmNvbnN0YW50KCdyYXRpbmdDb25maWcnLCB7XG4gICAgICAgIG1heDogNSxcbiAgICB9KVxuXG4gICAgLmRpcmVjdGl2ZSgncmF0aW5nJywgWydyYXRpbmdDb25maWcnLCBmdW5jdGlvbihyYXRpbmdDb25maWcpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHJlc3RyaWN0OiAnRUEnLFxuICAgICAgICAgICAgcmVwbGFjZTogdHJ1ZSxcbiAgICAgICAgICAgIHNjb3BlOiB7XG4gICAgICAgICAgICAgICAgdmFsdWU6ICc9JyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB0ZW1wbGF0ZTogJzxzcGFuIG5nLW1vdXNlbGVhdmU9XCJyZXNldCgpXCI+PGkgbmctcmVwZWF0PVwibnVtYmVyIGluIHJhbmdlXCIgbmctbW91c2VlbnRlcj1cImVudGVyKG51bWJlcilcIiBuZy1jbGljaz1cImFzc2lnbihudW1iZXIpXCIgbmctY2xhc3M9XCJ7XFwnZ2x5cGhpY29uIGdseXBoaWNvbi1zdGFyIGljb24tZ29sZFxcJzogbnVtYmVyIDw9IHZhbCwgXFwnZ2x5cGhpY29uIGdseXBoaWNvbi1zdGFyIGljb24tZ3JheVxcJzogbnVtYmVyID4gdmFsfVwiPjwvaT48L3NwYW4+JyxcbiAgICAgICAgICAgIGxpbms6IGZ1bmN0aW9uKHNjb3BlLCBlbGVtZW50LCBhdHRycykge1xuICAgICAgICAgICAgICAgIHZhciBtYXhSYW5nZSA9IGFuZ3VsYXIuaXNEZWZpbmVkKGF0dHJzLm1heCkgPyBzY29wZS4kZXZhbChhdHRycy5tYXgpIDogcmF0aW5nQ29uZmlnLm1heDtcblxuICAgICAgICAgICAgICAgIHNjb3BlLnJhbmdlID0gW107XG4gICAgICAgICAgICAgICAgZm9yKHZhciBpID0gMTsgaSA8PSBtYXhSYW5nZTsgaSsrICkge1xuICAgICAgICAgICAgICAgICAgICBzY29wZS5yYW5nZS5wdXNoKGkpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHNjb3BlLiR3YXRjaCgndmFsdWUnLCBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICBzY29wZS52YWwgPSB2YWx1ZTtcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIHNjb3BlLmFzc2lnbiA9IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgIHNjb3BlLnZhbHVlID0gdmFsdWU7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgc2NvcGUuZW50ZXIgPSBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICBzY29wZS52YWwgPSB2YWx1ZTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBzY29wZS5yZXNldCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICBzY29wZS52YWwgPSBhbmd1bGFyLmNvcHkoc2NvcGUudmFsdWUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBzY29wZS5yZXNldCgpO1xuXG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgfV0pO1xuXG5hcHAuY29udHJvbGxlcignU3RhckN0cmwnLCBmdW5jdGlvbigkc2NvcGUpIHtcblxuICAgICRzY29wZS5yYXRlMSA9IDA7XG5cbiAgICAkc2NvcGUucmF0ZTIgPSA2O1xuXG59KTsiLCIndXNlIHN0cmljdCc7XG5hcHAuY29uZmlnKGZ1bmN0aW9uICgkc3RhdGVQcm92aWRlcikge1xuXG4gICAgLy8gUmVnaXN0ZXIgb3VyICphYm91dCogc3RhdGUuXG4gICAgJHN0YXRlUHJvdmlkZXIuc3RhdGUoJ3N0cmlwZScsIHtcbiAgICAgICAgdXJsOiAnL3N0cmlwZScsXG4gICAgICAgIGNvbnRyb2xsZXI6ICdTdHJpcGVDb250cm9sbGVyJyxcbiAgICAgICAgdGVtcGxhdGVVcmw6ICdqcy90ZXN0U3RyaXBlL3N0cmlwZS5odG1sJ1xuICAgIH0pO1xuXG59KTtcblxuYXBwLmNvbnRyb2xsZXIoJ1N0cmlwZUNvbnRyb2xsZXInLCBmdW5jdGlvbiAoJHNjb3BlKSB7XG5cbn0pOyIsIid1c2Ugc3RyaWN0JztcbmFwcC5jb25maWcoZnVuY3Rpb24gKCRzdGF0ZVByb3ZpZGVyKSB7XG5cbiAgICAkc3RhdGVQcm92aWRlci5zdGF0ZSgndHV0b3JpYWwnLCB7XG4gICAgICAgIHVybDogJy90dXRvcmlhbCcsXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnanMvdHV0b3JpYWwvdHV0b3JpYWwuaHRtbCcsXG4gICAgICAgIGNvbnRyb2xsZXI6ICdUdXRvcmlhbEN0cmwnLFxuICAgICAgICByZXNvbHZlOiB7XG4gICAgICAgICAgICB0dXRvcmlhbEluZm86IGZ1bmN0aW9uIChUdXRvcmlhbEZhY3RvcnkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gVHV0b3JpYWxGYWN0b3J5LmdldFR1dG9yaWFsVmlkZW9zKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9KTtcblxufSk7XG5cbmFwcC5mYWN0b3J5KCdUdXRvcmlhbEZhY3RvcnknLCBmdW5jdGlvbiAoJGh0dHApIHtcblxuICAgIHJldHVybiB7XG4gICAgICAgIGdldFR1dG9yaWFsVmlkZW9zOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KCcvYXBpL3R1dG9yaWFsL3ZpZGVvcycpLnRoZW4oZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlLmRhdGE7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH07XG5cbn0pO1xuXG5hcHAuY29udHJvbGxlcignVHV0b3JpYWxDdHJsJywgZnVuY3Rpb24gKCRzY29wZSwgdHV0b3JpYWxJbmZvKSB7XG5cbiAgICAkc2NvcGUuc2VjdGlvbnMgPSB0dXRvcmlhbEluZm8uc2VjdGlvbnM7XG4gICAgJHNjb3BlLnZpZGVvcyA9IF8uZ3JvdXBCeSh0dXRvcmlhbEluZm8udmlkZW9zLCAnc2VjdGlvbicpO1xuXG4gICAgJHNjb3BlLmN1cnJlbnRTZWN0aW9uID0geyBzZWN0aW9uOiBudWxsIH07XG5cbiAgICAkc2NvcGUuY29sb3JzID0gW1xuICAgICAgICAncmdiYSgzNCwgMTA3LCAyNTUsIDAuMTApJyxcbiAgICAgICAgJ3JnYmEoMjM4LCAyNTUsIDY4LCAwLjExKScsXG4gICAgICAgICdyZ2JhKDIzNCwgNTEsIDI1NSwgMC4xMSknLFxuICAgICAgICAncmdiYSgyNTUsIDE5MywgNzMsIDAuMTEpJyxcbiAgICAgICAgJ3JnYmEoMjIsIDI1NSwgMSwgMC4xMSknXG4gICAgXTtcblxuICAgICRzY29wZS5nZXRWaWRlb3NCeVNlY3Rpb24gPSBmdW5jdGlvbiAoc2VjdGlvbiwgdmlkZW9zKSB7XG4gICAgICAgIHJldHVybiB2aWRlb3MuZmlsdGVyKGZ1bmN0aW9uICh2aWRlbykge1xuICAgICAgICAgICAgcmV0dXJuIHZpZGVvLnNlY3Rpb24gPT09IHNlY3Rpb247XG4gICAgICAgIH0pO1xuICAgIH07XG5cbn0pOyIsIid1c2Ugc3RyaWN0JztcbmFwcC5jb25maWcoZnVuY3Rpb24gKCRzdGF0ZVByb3ZpZGVyKSB7XG5cdCRzdGF0ZVByb3ZpZGVyLnN0YXRlKCdhZG1pbi51c2VyTW9kaWZ5Jywge1xuICAgICAgICB1cmw6ICcvdXNlck1vZGlmeScsXG4gICAgICAgIGNvbnRyb2xsZXI6ICd1c2VyTW9kaWZ5Q29udHJvbGxlcicsXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnanMvdXNlck1vZGlmeS91c2VyTW9kaWZ5Lmh0bWwnXG4gICAgfSk7XG59KVxuXG5hcHAuY29udHJvbGxlcigndXNlck1vZGlmeUNvbnRyb2xsZXInLCBmdW5jdGlvbiAoJHNjb3BlLCB1c2VyTW9kaWZ5RmFjdG9yeSwgJHN0YXRlLCAkc3RhdGVQYXJhbXMsIEF1dGhTZXJ2aWNlKSB7XG5cbiAgICBcbiAgICAkc2NvcGUuc3VibWl0ID0ge1xuICAgICAgICBwYXNzd29yZDogJycsXG4gICAgICAgIGVtYWlsOiAnJyxcbiAgICAgICAgbWFrZUFkbWluOiBmYWxzZVxuICAgIH1cbiAgICAkc2NvcGUuc3VjY2VzcztcblxuXG4gICAgJHNjb3BlLmNoYW5nZVBXID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHVzZXJNb2RpZnlGYWN0b3J5LnBvc3RQVygkc2NvcGUuc3VibWl0KS50aGVuKGZ1bmN0aW9uKHVzZXIsIGVycil7XG4gICAgICAgICAgICAkc2NvcGUuc3VibWl0ID0ge31cbiAgICAgICAgICAgIGlmKGVycikge1xuICAgICAgICAgICAgICAgICRzY29wZS5zdWNjZXNzPSBmYWxzZTtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnY2hhbmdpbmcgc3RhdGUnKVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZXtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygkc2NvcGUuc3VibWl0KTtcbiAgICAgICAgICAgICAgICAkc2NvcGUuc3VjY2VzcyA9IHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH0gIFxufSk7IiwiJ3VzZSBzdHJpY3QnO1xuYXBwLmZhY3RvcnkoJ0NyZWF0ZUl0ZW1GYWN0b3J5JywgZnVuY3Rpb24oJGh0dHApe1xuXHRcblx0cmV0dXJuIHtcblx0XHRwb3N0SXRlbTogZnVuY3Rpb24oZGF0YSl7XG5cdFx0XHRjb25zb2xlLmxvZygnaW50byB0aGUgZmFjdG9yeScsIGRhdGEpO1xuXHRcdFx0Ly8gcmV0dXJuICRodHRwLnBvc3QoJy9hcGkvaXRlbScsIGRhdGEpO1xuXG5cdFx0XHRyZXR1cm4gJGh0dHAucG9zdCgnL2FwaS9hZG1pbi9pdGVtQ3JlYXRlJywgZGF0YSkudGhlbihmdW5jdGlvbihyZXNwb25zZSl7XG5cdFx0XHRcdHJldHVybiByZXNwb25zZS5kYXRhO1xuXHRcdFx0fSlcblx0XHR9XG5cdH1cblxufSkiLCIndXNlIHN0cmljdCc7XG5hcHAuZmFjdG9yeSgnQ3JlYXRlUmV2aWV3JywgZnVuY3Rpb24oJGh0dHApe1xuXHRcblx0cmV0dXJuIHtcblx0XHRzdWJtaXRSZXZpZXc6IGZ1bmN0aW9uKGRhdGEpe1xuXHRcdFx0Y29uc29sZS5sb2coJ2ludG8gcmV2aWV3IGZhY3RvcnknLCBkYXRhKTtcblx0XHRcdHJldHVybiAkaHR0cC5wb3N0KCcvYXBpL3Jldmlld3MvJysgZGF0YSkudGhlbihmdW5jdGlvbihyZXNwb25zZSl7XG5cdFx0XHRcdHJldHVybiByZXNwb25zZS5kYXRhO1xuXHRcdFx0fSlcblx0XHR9XG5cdH1cbn0pIiwiJ3VzZSBzdHJpY3QnO1xuYXBwLmZhY3RvcnkoJ0NyZWF0ZVVzZXJGYWN0b3J5JywgZnVuY3Rpb24oJGh0dHApe1xuXHRcblx0cmV0dXJuIHtcblx0XHRwb3N0VXNlcjogZnVuY3Rpb24oZGF0YSl7XG5cdFx0XHRjb25zb2xlLmxvZygnaW50byB1c2VyIGZhY3RvcnknLCBkYXRhKTtcblx0XHRcdHJldHVybiAkaHR0cC5wb3N0KCdhcGkvam9pbicsIGRhdGEpLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2Upe1xuXHRcdFx0XHRyZXR1cm4gcmVzcG9uc2UuZGF0YTtcblx0XHRcdH0pXG5cdFx0fVxuXHR9XG59KVxuXG4vLyAnL2FwaS9sb2dpbiciLCIndXNlIHN0cmljdCc7XG5hcHAuZmFjdG9yeSgnR2V0SXRlbUZhY3RvcnknLCBmdW5jdGlvbigkaHR0cCl7XG5cdFxuXHRyZXR1cm4ge1xuXHRcdGdldEl0ZW06IGZ1bmN0aW9uKGlkKXtcblx0XHRcdC8vdmFyIG9wdGlvbnMgPSB7ZW1haWw6IGVtYWlsfTtcblx0XHRcdGNvbnNvbGUubG9nKGlkKTtcblx0XHRcdHJldHVybiAkaHR0cC5nZXQoJy9hcGkvaXRlbS8nK2lkKS50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKXtcblx0XHRcdFx0cmV0dXJuIHJlc3BvbnNlLmRhdGE7XG5cdFx0XHR9KVxuXHRcdH0sXG5cblx0XHQvLyBnZXRDYXRlZ29yeUl0ZW1zOiBmdW5jdGlvbiAoKSB7XG5cdFx0Ly8gXHRjb25zb2xlLmxvZyhcIkdldEl0ZW1GYWN0b3J5OiBnZXRDYXRlZ29yeUl0ZW1zXCIsIGNhdGVnb3J5KTtcblx0XHQvLyBcdHJldHVybiAkaHR0cC5nZXQoJy9hcGkvaXRlbS8nKyBjYXRlZ29yeSkudGhlbihmdW5jdGlvbihyZXNwb25zZSl7XG5cdFx0Ly8gXHRcdHJldHVybiByZXNwb25zZS5kYXRhO1xuXHRcdC8vIFx0fSk7XG5cdFx0Ly8gfSxcblxuXHR9XG59KSIsIid1c2Ugc3RyaWN0JztcbmFwcC5mYWN0b3J5KCdHZXRJdGVtc0ZhY3RvcnknLCBmdW5jdGlvbigkaHR0cCl7XG5cbiAgICByZXR1cm4ge1xuICAgICAgICBnZXRJdGVtczogZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIHJldHVybiAkaHR0cC5nZXQoJy9hcGkvaXRlbWxpc3QnKS50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKXtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzcG9uc2UuZGF0YTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgIH1cblxuICAgIH1cbn0pIiwiJ3VzZSBzdHJpY3QnO1xuYXBwLmZhY3RvcnkoJ0dldFVzZXJGYWN0b3J5JywgZnVuY3Rpb24oJGh0dHApe1xuXHRcblx0cmV0dXJuIHtcblx0XHRnZXRVc2VyOiBmdW5jdGlvbih1c2VyKXtcblx0XHRcdGNvbnNvbGUubG9nKCdpbnNpZGUgZmFjdG9yIHdpdGg6ICcsIGVtYWlsKTtcblx0XHRcdC8vdmFyIG9wdGlvbnMgPSB7ZW1haWw6IGVtYWlsfTtcblx0XHRcdHJldHVybiAkaHR0cC5nZXQoJy9hcGkvbG9naW4vJyArIHVzZXIuZW1haWwpLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2Upe1xuXHRcdFx0XHRyZXR1cm4gcmVzcG9uc2UuZGF0YTtcblx0XHRcdH0pXG5cdFx0fSxcblx0XHRhdXRoVXNlcjogZnVuY3Rpb24oZGF0YSl7XG5cdFx0XHRyZXR1cm4gJGh0dHAucG9zdCgnL2xvZ2luJywgZGF0YSkudGhlbihmdW5jdGlvbihyZXNwb25zZSl7XG5cdFx0XHRcdGNvbnNvbGUubG9nKFwiZmFjdG9yeSBkb25lXCIpXG5cdFx0XHRcdHJldHVybiByZXNwb25zZS5kYXRhO1xuXHRcdFx0fSlcblx0XHR9XG5cdH1cbn0pXG5cbi8vICcvYXBpL2xvZ2luLycgKyBlbWFpbCIsIid1c2Ugc3RyaWN0JztcbmFwcC5mYWN0b3J5KCdPcmRlckZhY3RvcnknLCBmdW5jdGlvbigkaHR0cCl7XG5cdFxuXHRyZXR1cm4ge1xuXHRcdGNyZWF0ZU9yZGVyOiBmdW5jdGlvbihkYXRhKXsvLyBkYXRhIHNob3VsZCBiZSBpbiBmb3JtIHt1c2VySWQ6IHVzZXIuX2lkLCBpdGVtczogW2l0ZW06IGl0ZW0uX2lkLCBxdHk6IHF0eV19XG5cdFx0XHRjb25zb2xlLmxvZygnc2VuZGluZyBhIHJlcXVlc3QgZm9yIGEgbmV3IG9yZGVyIGZyb20gZmFjdG9yeScpO1xuXHRcdFx0cmV0dXJuICRodHRwLnBvc3QoJy9hcGkvb3JkZXInLCBkYXRhKS50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKXtcblx0XHRcdC8vY29uc29sZS5sb2coJ3Jlc3BvbnNlIGZyb20gY3JlYXRlT3JkZXIgZmFjdG9yeSByZXF1ZXN0JywgcmVzcG9uc2UpO1xuXHRcdFx0XHRyZXR1cm4gcmVzcG9uc2UuZGF0YTtcblx0XHRcdH0pXG5cdFx0fSxcblx0XHR1cGRhdGVPcmRlcjogZnVuY3Rpb24oZGF0YSl7IC8vZXhwZWN0cyBvcmRlcklkLCBpdGVtSWQsIGFuZCBxdWFudGl0eSAoY2FzZSBzZW5zYXRpdmUpXG5cdFx0XHRyZXR1cm4gJGh0dHAucG9zdCgnL2FwaS9vcmRlci9saW5laXRlbScsIGRhdGEpLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2Upe1xuXHRcdFx0XHRyZXR1cm4gcmVzcG9uc2UuZGF0YTtcblx0XHRcdH0pXG5cdFx0fSxcblx0XHRnZXRPcmRlcnM6IGZ1bmN0aW9uKHVzZXJJZCl7XG5cdFx0XHRyZXR1cm4gJGh0dHAuZ2V0KCcvYXBpL29yZGVyLycrdXNlcklkKS50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKXtcblx0XHRcdFx0Ly9jb25zb2xlLmxvZygncmVzcG9uc2UgZnJvbSBnZXRPcmRlcnMgZmFjdG9yeSByZXF1ZXN0JywgcmVzcG9uc2UpO1xuXHRcdFx0XHRyZXR1cm4gcmVzcG9uc2UuZGF0YTtcblx0XHRcdH0pO1xuXHRcdH1cblxufX0pOyIsIid1c2Ugc3RyaWN0JztcbmFwcC5mYWN0b3J5KCdSYW5kb21HcmVldGluZ3MnLCBmdW5jdGlvbiAoKSB7XG5cbiAgICB2YXIgZ2V0UmFuZG9tRnJvbUFycmF5ID0gZnVuY3Rpb24gKGFycikge1xuICAgICAgICByZXR1cm4gYXJyW01hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIGFyci5sZW5ndGgpXTtcbiAgICB9O1xuXG4gICAgdmFyIGdyZWV0aW5ncyA9IFtcbiAgICAgICAgJ0hlbGxvLCB3b3JsZCEnLFxuICAgICAgICAnQXQgbG9uZyBsYXN0LCBJIGxpdmUhJyxcbiAgICAgICAgJ0hlbGxvLCBzaW1wbGUgaHVtYW4uJyxcbiAgICAgICAgJ1doYXQgYSBiZWF1dGlmdWwgZGF5IScsXG4gICAgICAgICdJXFwnbSBsaWtlIGFueSBvdGhlciBwcm9qZWN0LCBleGNlcHQgdGhhdCBJIGFtIHlvdXJzLiA6KScsXG4gICAgICAgICdUaGlzIGVtcHR5IHN0cmluZyBpcyBmb3IgTGluZHNheSBMZXZpbmUuJ1xuICAgIF07XG5cbiAgICByZXR1cm4ge1xuICAgICAgICBncmVldGluZ3M6IGdyZWV0aW5ncyxcbiAgICAgICAgZ2V0UmFuZG9tR3JlZXRpbmc6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiBnZXRSYW5kb21Gcm9tQXJyYXkoZ3JlZXRpbmdzKTtcbiAgICAgICAgfVxuICAgIH07XG5cbn0pOyIsIid1c2Ugc3RyaWN0JztcbiIsImFwcC5mYWN0b3J5KCdhZG1pbk5hdmJhckZhY3RvcnknLCBmdW5jdGlvbiAobmF2YmFyTWVudSkge1xuXHRcdHZhciBuYXZiYXJNZW51SXRlbXMgPSBbXG4gICAgICAgIHsgbGFiZWw6ICdIb21lJywgc3RhdGU6ICdob21lJyB9LFxuICAgICAgICB7IGxhYmVsOiAnQ3JlYXRlIEl0ZW0nLCBzdGF0ZTogJ2l0ZW1DcmVhdGUnIH0sXG4gICAgICAgIHsgbGFiZWw6ICdNb2RpZnkgVXNlcicsIHN0YXRlOiAndXNlck1vZGlmeScgfVxuICAgIF07XG5cblx0cmV0dXJuIHtcblxuXHR9XG59KSIsIid1c2Ugc3RyaWN0J1xuYXBwLmZhY3RvcnkoJ2FkbWluUG9zdFVzZXInLCBmdW5jdGlvbiAoJGh0dHApIHtcblxuXHRyZXR1cm4ge1xuXHRcdHBvc3RJbmZvOiBmdW5jdGlvbiAoaW5wdXRzKSB7XG5cdFx0XHRyZXR1cm4gJGh0dHAucG9zdCgnYWRtaW4nLCBpbnB1dHMpXG5cdFx0fVxuXHR9XG59KSAiLCIndXNlIHN0cmljdCc7XG5hcHAuZmFjdG9yeSgnb3JkZXJNb2RpZnlGYWN0b3J5JywgZnVuY3Rpb24gKCRodHRwKXtcblx0XG5cdHJldHVybiB7XG5cdFx0ZmlsdGVyT3JkZXJzOiBmdW5jdGlvbiAoc3RhdHVzLCBhbGxPcmRlcnMpIHtcblx0XHRcdGlmIChzdGF0dXMgPT09ICdhbGwgb3JkZXJzJykge1xuXHRcdFx0XHRyZXR1cm4gYWxsT3JkZXJzXG5cdFx0XHR9XG5cdFx0XHR2YXIgZmlsdGVyZWRBcnJheSA9IFtdO1xuXHRcdFx0Zm9yICh2YXIgYT0wLCBsZW49YWxsT3JkZXJzLmxlbmd0aDsgYTxsZW47IGErKykge1xuXHRcdFx0XHRpZiAoYWxsT3JkZXJzW2FdLnN0YXR1cyA9PT0gc3RhdHVzKSB7XG5cdFx0XHRcdFx0ZmlsdGVyZWRBcnJheS5wdXNoKGFsbE9yZGVyc1thXSlcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIGZpbHRlcmVkQXJyYXlcblx0XHR9LFxuXHRcdG1vZGlmeU9yZGVyOiBmdW5jdGlvbihkYXRhKXtcblx0XHRcdHJldHVybiAkaHR0cC5wdXQoJy9hcGkvYWRtaW4vb3JkZXInLCBkYXRhKS50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKXtcblx0XHRcdFx0cmV0dXJuIHJlc3BvbnNlLmRhdGE7XG5cdFx0XHR9KVxuXHRcdH0sXG5cdFx0Z2V0QWxsT3JkZXJzOiBmdW5jdGlvbigpe1xuXHRcdFx0Y29uc29sZS5sb2coJ2ludG8gdGhlIGZhY3RvcnknKTtcblx0XHRcdC8vIHJldHVybiAkaHR0cC5wb3N0KCcvYXBpL2l0ZW0nLCBkYXRhKTtcblxuXHRcdFx0cmV0dXJuICRodHRwLmdldCgnL2FwaS9hZG1pbi9vcmRlcicpLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2Upe1xuXHRcdFx0XHRyZXR1cm4gcmVzcG9uc2UuZGF0YTtcblx0XHRcdH0pXG5cdFx0fSxcblx0XHRjaGFuZ2VPcmRlclN0YXR1czogZnVuY3Rpb24gKCApIHtcblx0XHRcdHJldHVybiAkaHR0cC5wdXQoJy9hcGkvYWRtaW4vb3JkZXInKS50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKXtcblx0XHRcdFx0cmV0dXJuIHJlc3BvbnNlLmRhdGE7XG5cdFx0XHR9KVx0XG5cdFx0fVxuXHRcdC8vIGdldFVzZXJPcmRlcnNCeUVtYWlsOiBmdW5jdGlvbiAoKSB7XG5cdFx0Ly8gXHRyZXR1cm4gJGh0dHAucG9zdCgnL2FwaS9hZG1pbi9vcmRlcicpLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2Upe1xuXHRcdC8vIFx0XHRyZXR1cm4gcmVzcG9uc2UuZGF0YTtcblx0XHQvLyBcdH0pXG5cdFx0Ly8gfVxuXHR9XG5cbn0pIiwiJ3VzZSBzdHJpY3QnO1xuYXBwLmZhY3RvcnkoJ3VzZXJNb2RpZnlGYWN0b3J5JywgZnVuY3Rpb24oJGh0dHApe1xuXHRcblx0cmV0dXJuIHtcblx0XHRwb3N0UFc6IGZ1bmN0aW9uKGRhdGEpe1xuXHRcdFx0Y29uc29sZS5sb2coJ2ludG8gdGhlIGZhY3RvcnknLCBkYXRhKTtcblx0XHRcdC8vIHJldHVybiAkaHR0cC5wb3N0KCcvYXBpL2l0ZW0nLCBkYXRhKTtcblxuXHRcdFx0cmV0dXJuICRodHRwLnBvc3QoJy9hcGkvYWRtaW4vdXNlck1vZGlmeScsIGRhdGEpLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2Upe1xuXHRcdFx0XHRyZXR1cm4gcmVzcG9uc2UuZGF0YTtcblx0XHRcdH0pXG5cdFx0fVxuXHR9XG5cbn0pIiwiJ3VzZSBzdHJpY3QnO1xuXG5hcHAuZGlyZWN0aXZlKCd0dXRvcmlhbFNlY3Rpb24nLCBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgcmVzdHJpY3Q6ICdFJyxcbiAgICAgICAgc2NvcGU6IHtcbiAgICAgICAgICAgIG5hbWU6ICdAJyxcbiAgICAgICAgICAgIHZpZGVvczogJz0nLFxuICAgICAgICAgICAgYmFja2dyb3VuZDogJ0AnXG4gICAgICAgIH0sXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnanMvdHV0b3JpYWwvdHV0b3JpYWwtc2VjdGlvbi90dXRvcmlhbC1zZWN0aW9uLmh0bWwnLFxuICAgICAgICBsaW5rOiBmdW5jdGlvbiAoc2NvcGUsIGVsZW1lbnQpIHtcbiAgICAgICAgICAgIGVsZW1lbnQuY3NzKHsgYmFja2dyb3VuZDogc2NvcGUuYmFja2dyb3VuZCB9KTtcbiAgICAgICAgfVxuICAgIH07XG59KTsiLCIndXNlIHN0cmljdCc7XG5hcHAuZGlyZWN0aXZlKCd0dXRvcmlhbFNlY3Rpb25NZW51JywgZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB7XG4gICAgICAgIHJlc3RyaWN0OiAnRScsXG4gICAgICAgIHJlcXVpcmU6ICduZ01vZGVsJyxcbiAgICAgICAgdGVtcGxhdGVVcmw6ICdqcy90dXRvcmlhbC90dXRvcmlhbC1zZWN0aW9uLW1lbnUvdHV0b3JpYWwtc2VjdGlvbi1tZW51Lmh0bWwnLFxuICAgICAgICBzY29wZToge1xuICAgICAgICAgICAgc2VjdGlvbnM6ICc9J1xuICAgICAgICB9LFxuICAgICAgICBsaW5rOiBmdW5jdGlvbiAoc2NvcGUsIGVsZW1lbnQsIGF0dHJzLCBuZ01vZGVsQ3RybCkge1xuXG4gICAgICAgICAgICBzY29wZS5jdXJyZW50U2VjdGlvbiA9IHNjb3BlLnNlY3Rpb25zWzBdO1xuICAgICAgICAgICAgbmdNb2RlbEN0cmwuJHNldFZpZXdWYWx1ZShzY29wZS5jdXJyZW50U2VjdGlvbik7XG5cbiAgICAgICAgICAgIHNjb3BlLnNldFNlY3Rpb24gPSBmdW5jdGlvbiAoc2VjdGlvbikge1xuICAgICAgICAgICAgICAgIHNjb3BlLmN1cnJlbnRTZWN0aW9uID0gc2VjdGlvbjtcbiAgICAgICAgICAgICAgICBuZ01vZGVsQ3RybC4kc2V0Vmlld1ZhbHVlKHNlY3Rpb24pO1xuICAgICAgICAgICAgfTtcblxuICAgICAgICB9XG4gICAgfTtcbn0pOyIsIid1c2Ugc3RyaWN0JztcbmFwcC5kaXJlY3RpdmUoJ3R1dG9yaWFsVmlkZW8nLCBmdW5jdGlvbiAoJHNjZSkge1xuXG4gICAgdmFyIGZvcm1Zb3V0dWJlVVJMID0gZnVuY3Rpb24gKGlkKSB7XG4gICAgICAgIHJldHVybiAnaHR0cHM6Ly93d3cueW91dHViZS5jb20vZW1iZWQvJyArIGlkO1xuICAgIH07XG5cbiAgICByZXR1cm4ge1xuICAgICAgICByZXN0cmljdDogJ0UnLFxuICAgICAgICB0ZW1wbGF0ZVVybDogJ2pzL3R1dG9yaWFsL3R1dG9yaWFsLXZpZGVvL3R1dG9yaWFsLXZpZGVvLmh0bWwnLFxuICAgICAgICBzY29wZToge1xuICAgICAgICAgICAgdmlkZW86ICc9J1xuICAgICAgICB9LFxuICAgICAgICBsaW5rOiBmdW5jdGlvbiAoc2NvcGUpIHtcbiAgICAgICAgICAgIHNjb3BlLnRydXN0ZWRZb3V0dWJlVVJMID0gJHNjZS50cnVzdEFzUmVzb3VyY2VVcmwoZm9ybVlvdXR1YmVVUkwoc2NvcGUudmlkZW8ueW91dHViZUlEKSk7XG4gICAgICAgIH1cbiAgICB9O1xuXG59KTsiLCIndXNlIHN0cmljdCc7XG5hcHAuZGlyZWN0aXZlKCduYXZEcm9wZG93bicsIGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgICByZXN0cmljdDogJ0UnLFxuICAgICAgICAvL3Njb3BlOiB7XG4gICAgICAgIC8vICAgIGl0ZW1zOiAnPSdcbiAgICAgICAgLy99LFxuICAgICAgICB0ZW1wbGF0ZVVybDogJ2pzL2NvbW1vbi9kaXJlY3RpdmVzL25hdmJhci9uYXYtZHJvcGRvd24uaHRtbCdcbiAgICAgICAgLy9jb250cm9sbGVyOiAnZHJvcGRvd25Db250cm9sbGVyJ1xuICAgIH07XG59KTtcblxuYXBwLmRpcmVjdGl2ZSgnbmF2RHJvcGRvd25Xb21lbicsIGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgICByZXN0cmljdDogJ0UnLFxuICAgICAgICAvL3Njb3BlOiB7XG4gICAgICAgIC8vICAgIGl0ZW1zOiAnPSdcbiAgICAgICAgLy99LFxuICAgICAgICB0ZW1wbGF0ZVVybDogJ2pzL2NvbW1vbi9kaXJlY3RpdmVzL25hdmJhci9uYXYtZHJvcGRvd24td29tZW4uaHRtbCdcbiAgICAgICAgLy9jb250cm9sbGVyOiAnZHJvcGRvd25Db250cm9sbGVyJ1xuICAgIH07XG59KTtcblxuYXBwLmNvbnRyb2xsZXIoJ2Ryb3Bkb3duQ29udHJvbGxlcicsIGZ1bmN0aW9uICgkc2NvcGUsIEdldEl0ZW1zRmFjdG9yeSwgJHN0YXRlLCAkc3RhdGVQYXJhbXMsICR3aW5kb3cpIHtcblxuICAgIEdldEl0ZW1zRmFjdG9yeS5nZXRJdGVtcygpLnRoZW4oZnVuY3Rpb24oaXRlbXMsIGVycil7XG4gICAgICAgIGlmKGVycikgdGhyb3cgZXJyO1xuICAgICAgICBlbHNle1xuICAgICAgICAgICAgdmFyIGFsbEl0ZW1zID0gaXRlbXM7XG4gICAgICAgICAgICAvL2NvbnNvbGUubG9nKGFsbEl0ZW1zKTtcbiAgICAgICAgICAgIHZhciBkcm9wRG93blNvcnRlciA9IGZ1bmN0aW9uIChnZW5kZXIpIHtcbiAgICAgICAgICAgICAgICB2YXIgc29ydGVkQXJyYXkgPSBbXTtcbiAgICAgICAgICAgICAgICB2YXIgc2VsZWN0ZWROYW1lcyA9IFtdO1xuICAgICAgICAgICAgICAgIGZvciAodmFyIG9iaiBpbiBhbGxJdGVtcykge1xuICAgICAgICAgICAgICAgICAgICBpZiAoc2VsZWN0ZWROYW1lcy5pbmRleE9mKGFsbEl0ZW1zW29ial0ubmFtZSkgPT09IC0xICYmIGFsbEl0ZW1zW29ial0uZ2VuZGVyID09IGdlbmRlcikge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8vL2NvbnNvbGUubG9nKGFsbEl0ZW1zW29ial0ubmFtZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxlY3RlZE5hbWVzLnB1c2goYWxsSXRlbXNbb2JqXS5uYW1lKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNvcnRlZEFycmF5LnB1c2goYWxsSXRlbXNbb2JqXSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIHNvcnRlZEFycmF5O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgJHNjb3BlLm1lblByb2R1Y3RzMSA9IGRyb3BEb3duU29ydGVyKCdtZW4nKS5zbGljZSgwLDMpO1xuICAgICAgICAgICAgJHNjb3BlLm1lblByb2R1Y3RzMiA9IGRyb3BEb3duU29ydGVyKCdtZW4nKS5zbGljZSgzLDYpO1xuXG4gICAgICAgICAgICAkc2NvcGUud29tZW5Qcm9kdWN0czEgPSBkcm9wRG93blNvcnRlcignd29tZW4nKS5zbGljZSgwLDMpO1xuICAgICAgICAgICAgJHNjb3BlLndvbWVuUHJvZHVjdHMyID0gZHJvcERvd25Tb3J0ZXIoJ3dvbWVuJykuc2xpY2UoMyw2KTtcbiAgICAgICAgICAgIC8vY29uc29sZS5sb2coJHNjb3BlLm1lblByb2R1Y3RzMSwgJHNjb3BlLm1lblByb2R1Y3RzMik7XG4gICAgICAgICAgICAvL2NvbnNvbGUubG9nKCRzY29wZS53b21lblByb2R1Y3RzKTtcblxuICAgICAgICAgICAgLy8gRHJvcGRvd24gY29udHJvbHNcbiAgICAgICAgICAgICRzY29wZS5tZW5WaXNpYmxlID0gZmFsc2U7XG4gICAgICAgICAgICAkc2NvcGUud29tZW5WaXNpYmxlID0gZmFsc2U7XG5cbiAgICAgICAgICAgICRzY29wZS50b2dnbGVNZW5WaXNpYmxlID0gZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICAkc2NvcGUubWVuVmlzaWJsZSA9ICEkc2NvcGUubWVuVmlzaWJsZTtcbiAgICAgICAgICAgICAgICAkc2NvcGUud29tZW5WaXNpYmxlID0gZmFsc2U7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICRzY29wZS50b2dnbGVXb21lblZpc2libGUgPSBmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgJHNjb3BlLndvbWVuVmlzaWJsZSA9ICEkc2NvcGUud29tZW5WaXNpYmxlO1xuICAgICAgICAgICAgICAgICRzY29wZS5tZW5WaXNpYmxlID0gZmFsc2U7XG4gICAgICAgICAgICB9XG5cblxuXG4gICAgICAgIH1cbiAgICB9KTtcblxufSk7IiwiJ3VzZSBzdHJpY3QnO1xuYXBwLmRpcmVjdGl2ZSgnbmF2YmFyJywgZnVuY3Rpb24gKCRkb2N1bWVudCkge1xuICAgIHJldHVybiB7XG4gICAgICAgIHJlc3RyaWN0OiAnRScsXG5cbiAgICAgICAgLy9zY29wZToge1xuICAgICAgICAvLyAgaXRlbXM6ICc9J1xuICAgICAgICAvL30sXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnanMvY29tbW9uL2RpcmVjdGl2ZXMvbmF2YmFyL25hdmJhci5odG1sJyxcbiAgICAgICAgLy9saW5rOiBmdW5jdGlvbihzY29wZSwgZWxlbWVudCwgYXR0cil7XG4gICAgICAgIC8vICAgIGNvbnNvbGUubG9nKHNjb3BlKTtcbiAgICAgICAgLy8gICAgY29uc29sZS5sb2coZWxlbWVudCk7XG4gICAgICAgIC8vICAgIC8vc2NvcGUubWVuVmlzaWJsZSA9IGZhbHNlO1xuICAgICAgICAvLyAgICAvL1xuICAgICAgICAvLyAgICAvL3Njb3BlLnRvZ2dsZVNlbGVjdCA9IGZ1bmN0aW9uKCl7XG4gICAgICAgIC8vICAgIC8vICAgIHNjb3BlLm1lblZpc2libGUgPSAhc2NvcGUubWVuVmlzaWJsZTtcbiAgICAgICAgLy8gICAgLy99XG4gICAgICAgIC8vICAgIC8vXG4gICAgICAgIC8vICAgICRkb2N1bWVudC5iaW5kKCdjbGljaycsIGZ1bmN0aW9uKGV2ZW50KXtcbiAgICAgICAgLy9cbiAgICAgICAgLy8gICAgICAgIHZhciBpc0NsaWNrZWRFbGVtZW50Q2hpbGRPZlBvcHVwID0gZWxlbWVudFxuICAgICAgICAvLyAgICAgICAgICAgICAgICAuZmluZChldmVudC50YXJnZXQpXG4gICAgICAgIC8vICAgICAgICAgICAgICAgIC5sZW5ndGggPiAwO1xuICAgICAgICAvLyAgICAgICAgY29uc29sZS5sb2coJ2lzIGNsaWNrZWQnLCBzY29wZS5tZW5WaXNpYmxlKVxuICAgICAgICAvLyAgICAgICAgaWYgKGlzQ2xpY2tlZEVsZW1lbnRDaGlsZE9mUG9wdXApXG4gICAgICAgIC8vICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAvL1xuICAgICAgICAvLyAgICAgICAgc2NvcGUubWVuVmlzaWJsZSA9IGZhbHNlO1xuICAgICAgICAvLyAgICAgICAgc2NvcGUuJGFwcGx5KCk7XG4gICAgICAgIC8vICAgIH0pO1xuICAgICAgICAvL31cblxuXG4gICAgfTtcbn0pO1xuIiwiJ3VzZSBzdHJpY3QnO1xuYXBwLmRpcmVjdGl2ZSgncmFuZG9HcmVldGluZycsIGZ1bmN0aW9uIChSYW5kb21HcmVldGluZ3MpIHtcblxuICAgIHJldHVybiB7XG4gICAgICAgIHJlc3RyaWN0OiAnRScsXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnanMvY29tbW9uL2RpcmVjdGl2ZXMvcmFuZG8tZ3JlZXRpbmcvcmFuZG8tZ3JlZXRpbmcuaHRtbCcsXG4gICAgICAgIGxpbms6IGZ1bmN0aW9uIChzY29wZSkge1xuICAgICAgICAgICAgc2NvcGUuZ3JlZXRpbmcgPSBSYW5kb21HcmVldGluZ3MuZ2V0UmFuZG9tR3JlZXRpbmcoKTtcbiAgICAgICAgfVxuICAgIH07XG5cbn0pOyIsIid1c2Ugc3RyaWN0JztcbmFwcC5kaXJlY3RpdmUoJ3NwZWNzdGFja3VsYXJMb2dvJywgZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB7XG4gICAgICAgIHJlc3RyaWN0OiAnRScsXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnanMvY29tbW9uL2RpcmVjdGl2ZXMvc3BlY3N0YWNrdWxhci1sb2dvL3NwZWNzdGFja3VsYXItbG9nby5odG1sJ1xuICAgIH07XG59KTsiXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=