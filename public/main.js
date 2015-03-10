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


    // Register our *products* state.
    $stateProvider.state('products', {
        url: '/products',
        controller: 'allItemsController',
        templateUrl: 'js/allitems/allitems.html'
    })

});

app.config(function ($stateProvider) {

    // Register our *men* state.
    $stateProvider.state('men', {
        url: '/products/men',
        controller: 'allItemsController',
        templateUrl: 'js/allitems/allitems.html'
    })

});

app.config(function ($stateProvider) {

    // Register our *women* state.
    $stateProvider.state('women', {
        url: '/products/women',
        // controller: 'categoryController',
        controller: function ($scope, GetItemsFactory, $state, $stateParams) {
			console.log("before", $scope.items, $state.current);
			GetItemsFactory.getItems().then(function(items){	
				$scope.items = items;
				console.log(items);
			});
		},
        templateUrl: 'js/allitems/allitems.html',
    })
});


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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyIsImFib3V0L2Fib3V0LmpzIiwiYWRtaW4vYWRtaW4uanMiLCJhZG1pbi9pbmRleC5qcyIsImFsbEl0ZW1zL2FsbEl0ZW1zLmpzIiwiY2hlY2tvdXQvY2hlY2tvdXQuanMiLCJmc2EvZnNhLXByZS1idWlsdC5qcyIsImhvbWUvaG9tZS5qcyIsImhvbWUvcHJvZHVjdHJldmlld3Njb250cm9sbGVyLmpzIiwiaG9tZS9yZXZpZXdzdGFyLmpzIiwiaXRlbS9pdGVtLmpzIiwiaXRlbUNyZWF0ZS9pdGVtQ3JlYXRlLmpzIiwiam9pbm5vdy9qb2lubm93LmpzIiwibG9naW4vbG9naW4uanMiLCJvcmRlci9vcmRlci5qcyIsIm9yZGVyTW9kaWZ5L29yZGVyTW9kaWZ5LmpzIiwicHJvZHVjdENhdENyZWF0ZS9wcm9kdWN0Q2F0Q3JlYXRlLmpzIiwicmV2aWV3LWVudHJ5L3Jldmlldy1lbnRyeS5qcyIsInJldmlldy1lbnRyeS9zdGFycy5qcyIsInRlc3RTdHJpcGUvc3RyaXBlLmpzIiwidHV0b3JpYWwvdHV0b3JpYWwuanMiLCJ1c2VyTW9kaWZ5L3VzZXJNb2RpZnkuanMiLCJjb21tb24vZmFjdG9yaWVzL0NyZWF0ZUl0ZW1GYWN0b3J5LmpzIiwiY29tbW9uL2ZhY3Rvcmllcy9DcmVhdGVSZXZpZXcuanMiLCJjb21tb24vZmFjdG9yaWVzL0NyZWF0ZVVzZXJGYWN0b3J5LmpzIiwiY29tbW9uL2ZhY3Rvcmllcy9HZXRJdGVtRmFjdG9yeS5qcyIsImNvbW1vbi9mYWN0b3JpZXMvR2V0SXRlbXNGYWN0b3J5LmpzIiwiY29tbW9uL2ZhY3Rvcmllcy9HZXRVc2VyRmFjdG9yeS5qcyIsImNvbW1vbi9mYWN0b3JpZXMvT3JkZXJGYWN0b3J5LmpzIiwiY29tbW9uL2ZhY3Rvcmllcy9SYW5kb21HcmVldGluZ3MuanMiLCJjb21tb24vZmFjdG9yaWVzL1NvY2tldC5qcyIsImNvbW1vbi9mYWN0b3JpZXMvYWRtaW5OYXZiYXJGYWN0b3J5LmpzIiwiY29tbW9uL2ZhY3Rvcmllcy9hZG1pblBvc3RVc2VyLmpzIiwiY29tbW9uL2ZhY3Rvcmllcy9vcmRlck1vZGlmeUZhY3RvcnkuanMiLCJjb21tb24vZmFjdG9yaWVzL3VzZXJNb2RpZnlGYWN0b3J5LmpzIiwidHV0b3JpYWwvdHV0b3JpYWwtc2VjdGlvbi90dXRvcmlhbC1zZWN0aW9uLmpzIiwidHV0b3JpYWwvdHV0b3JpYWwtc2VjdGlvbi1tZW51L3R1dG9yaWFsLXNlY3Rpb24tbWVudS5qcyIsInR1dG9yaWFsL3R1dG9yaWFsLXZpZGVvL3R1dG9yaWFsLXZpZGVvLmpzIiwiY29tbW9uL2RpcmVjdGl2ZXMvbmF2YmFyL25hdi1kcm9wZG93bi5qcyIsImNvbW1vbi9kaXJlY3RpdmVzL25hdmJhci9uYXZiYXIuanMiLCJjb21tb24vZGlyZWN0aXZlcy9yYW5kby1ncmVldGluZy9yYW5kby1ncmVldGluZy5qcyIsImNvbW1vbi9kaXJlY3RpdmVzL3NwZWNzdGFja3VsYXItbG9nby9zcGVjc3RhY2t1bGFyLWxvZ28uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbkNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDeEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3BCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQy9HQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbEhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDWkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDMUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDMUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN2REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN6REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzlDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNsREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbkxBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDekRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDM0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNqREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDZEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2pEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2pDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNkQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNYQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDYkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDcEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3BCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN2QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdkJBO0FBQ0E7QUNEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDVkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDUkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDekNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDZkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNyQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNsQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNyRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDaENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6Im1haW4uanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHN0cmljdCc7XG4vLyB2YXIgYXBwID0gYW5ndWxhci5tb2R1bGUoJ0Z1bGxzdGFja0dlbmVyYXRlZEFwcCcsIFsndWkucm91dGVyJywgJ2ZzYVByZUJ1aWx0J10pO1xuXG52YXIgYXBwID0gYW5ndWxhci5tb2R1bGUoJ3NwZWNTdGFja3VsYXInLCBbJ3VpLnJvdXRlcicsICdmc2FQcmVCdWlsdCcsICduZ0Nvb2tpZXMnXSk7XG5hcHAuY29udHJvbGxlcignTWFpbkNvbnRyb2xsZXInLCBmdW5jdGlvbiAoJHNjb3BlLCAkcm9vdFNjb3BlKSB7XG5cbiAgICAvLyBHaXZlbiB0byB0aGUgPG5hdmJhcj4gZGlyZWN0aXZlIHRvIHNob3cgdGhlIG1lbnUuXG4gICAgJHNjb3BlLm1lbnVJdGVtcyA9IFtcbiAgICAgICAgeyBsYWJlbDogJ01lbicsIHN0YXRlOiAncHJvZHVjdHMnIH0sXG4gICAgICAgIHsgbGFiZWw6ICdXb21lbicsIHN0YXRlOiAnd29tZW4nIH0sXG4gICAgICAgIHsgbGFiZWw6ICdKb2luIHVzJywgc3RhdGU6ICdqb2luJyB9LFxuICAgICAgICB7IGxhYmVsOiAnTG9nIEluJywgc3RhdGU6ICdsb2dpbid9LFxuICAgICAgICB7IGxhYmVsOiAnUHJvZHVjdCBsaXN0Jywgc3RhdGU6ICdwcm9kdWN0cycgfSxcbiAgICAgICAgeyBsYWJlbDogJ015IE9yZGVycycsIHN0YXRlOiAnb3JkZXJzJ31cbiAgICBdO1xuICAgICRzY29wZS5hZG1pbkl0ZW1zPSBbXG4gICAgICAgIHsgbGFiZWw6ICdDcmVhdGUgcHJvZHVjdCcsIHN0YXRlOiAnYWRtaW4uaXRlbUNyZWF0ZScgfSxcbiAgICAgICAgeyBsYWJlbDogJ01vZGlmeSBVc2VyJywgc3RhdGU6ICdhZG1pbi51c2VyTW9kaWZ5J30sXG4gICAgICAgIHsgbGFiZWw6ICdNb2RpZnkgT3JkZXInLCBzdGF0ZTogJ2FkbWluLm9yZGVyTW9kaWZ5J30sXG4gICAgICAgIHsgbGFiZWw6ICdDcmVhdGUgUHJvZHVjdCBDYXQgUGcnLCBzdGF0ZTogJ2FkbWluLnByb2R1Y3RDYXRDcmVhdGUnfVxuICAgIF1cblxuXG5cblxuXG59KTtcblxuXG5hcHAuY29uZmlnKGZ1bmN0aW9uICgkdXJsUm91dGVyUHJvdmlkZXIsICRsb2NhdGlvblByb3ZpZGVyKSB7XG4gICAgLy8gVGhpcyB0dXJucyBvZmYgaGFzaGJhbmcgdXJscyAoLyNhYm91dCkgYW5kIGNoYW5nZXMgaXQgdG8gc29tZXRoaW5nIG5vcm1hbCAoL2Fib3V0KVxuICAgICRsb2NhdGlvblByb3ZpZGVyLmh0bWw1TW9kZSh0cnVlKTtcbiAgICAvLyBJZiB3ZSBnbyB0byBhIFVSTCB0aGF0IHVpLXJvdXRlciBkb2Vzbid0IGhhdmUgcmVnaXN0ZXJlZCwgZ28gdG8gdGhlIFwiL1wiIHVybC5cbiAgICAkdXJsUm91dGVyUHJvdmlkZXIub3RoZXJ3aXNlKCcvJyk7XG59KTtcbiIsIid1c2Ugc3RyaWN0JztcbmFwcC5jb25maWcoZnVuY3Rpb24gKCRzdGF0ZVByb3ZpZGVyKSB7XG5cbiAgICAvLyBSZWdpc3RlciBvdXIgKmFib3V0KiBzdGF0ZS5cbiAgICAkc3RhdGVQcm92aWRlci5zdGF0ZSgnYWJvdXQnLCB7XG4gICAgICAgIHVybDogJy9hYm91dCcsXG4gICAgICAgIGNvbnRyb2xsZXI6ICdBYm91dENvbnRyb2xsZXInLFxuICAgICAgICB0ZW1wbGF0ZVVybDogJ2pzL2Fib3V0L2Fib3V0Lmh0bWwnXG4gICAgfSk7XG5cbn0pO1xuXG5hcHAuY29udHJvbGxlcignQWJvdXRDb250cm9sbGVyJywgZnVuY3Rpb24gKCRzY29wZSkge1xuXG4gICAgLy8gSW1hZ2VzIG9mIGJlYXV0aWZ1bCBGdWxsc3RhY2sgcGVvcGxlLlxuICAgICRzY29wZS5pbWFnZXMgPSBbXG4gICAgICAgICdodHRwczovL3Bicy50d2ltZy5jb20vbWVkaWEvQjdnQlh1bENBQUFYUWNFLmpwZzpsYXJnZScsXG4gICAgICAgICdodHRwczovL2ZiY2RuLXNwaG90b3MtYy1hLmFrYW1haWhkLm5ldC9ocGhvdG9zLWFrLXhhcDEvdDMxLjAtOC8xMDg2MjQ1MV8xMDIwNTYyMjk5MDM1OTI0MV84MDI3MTY4ODQzMzEyODQxMTM3X28uanBnJyxcbiAgICAgICAgJ2h0dHBzOi8vcGJzLnR3aW1nLmNvbS9tZWRpYS9CLUxLVXNoSWdBRXk5U0suanBnJyxcbiAgICAgICAgJ2h0dHBzOi8vcGJzLnR3aW1nLmNvbS9tZWRpYS9CNzktWDdvQ01BQWt3N3kuanBnJyxcbiAgICAgICAgJ2h0dHBzOi8vcGJzLnR3aW1nLmNvbS9tZWRpYS9CLVVqOUNPSUlBSUZBaDAuanBnOmxhcmdlJyxcbiAgICAgICAgJ2h0dHBzOi8vcGJzLnR3aW1nLmNvbS9tZWRpYS9CNnlJeUZpQ0VBQXFsMTIuanBnOmxhcmdlJ1xuICAgIF07XG5cbn0pOyIsIid1c2Ugc3RyaWN0JztcbmFwcC5jb25maWcoZnVuY3Rpb24gKCRzdGF0ZVByb3ZpZGVyKSB7XG5cbiAgICBcbiAgICAkc3RhdGVQcm92aWRlci5zdGF0ZSgnYWRtaW4nLCB7XG4gICAgICAgIHVybDogJy9hZG1pbicsXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnanMvYWRtaW4vYWRtaW4uaHRtbCdcbiAgICB9KTtcblxufSk7XG5cbiIsIid1c2Ugc3RyaWN0JztcbmFwcC5jb250cm9sbGVyKCdBZG1pbkNvbnRyb2xsZXInLCBmdW5jdGlvbiAoJHNjb3BlKSB7XG5cbiAgICAvLyBHaXZlbiB0byB0aGUgPG5hdmJhcj4gZGlyZWN0aXZlIHRvIHNob3cgdGhlIG1lbnUuXG4gICAgJHNjb3BlLm1lbnVJdGVtcyA9IFtcbiAgICAgICAgeyBsYWJlbDogJ0hvbWUnLCBzdGF0ZTogJ2hvbWUnIH0sXG4gICAgICAgIHsgbGFiZWw6ICdDcmVhdGUgSXRlbScsIHN0YXRlOiAnaXRlbUNyZWF0ZScgfSxcbiAgICAgICAgeyBsYWJlbDogJ01vZGlmeSBVc2VyJywgc3RhdGU6ICd1c2VyTW9kaWZ5JyB9XG4gICAgXTtcblxufSk7XG5cbmFwcC5kaXJlY3RpdmUoJ2FkbWluTmF2YmFyJywgZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB7XG4gICAgICAgIHJlc3RyaWN0OiAnRScsXG4gICAgICAgIHNjb3BlOiB7XG4gICAgICAgICAgaXRlbXM6ICc9J1xuICAgICAgICB9LFxuICAgICAgICB0ZW1wbGF0ZVVybDogJ2pzL2NvbW1vbi9kaXJlY3RpdmVzL25hdmJhci9uYXZiYXIuaHRtbCdcbiAgICB9O1xufSk7IiwiJ3VzZSBzdHJpY3QnO1xuXG5hcHAucnVuKGZ1bmN0aW9uICgkY29va2llcywgJGNvb2tpZVN0b3JlKSB7XG5cblx0dmFyIGluaXQgPSAkY29va2llU3RvcmUuZ2V0KCdPcmRlcicpO1xuXHRpZighaW5pdCl7XG5cdFx0JGNvb2tpZVN0b3JlLnB1dCgnT3JkZXInLCBbXSk7XG5cdFx0Y29uc29sZS5sb2coJ3N0YXJ0aW5nIGNvb2tpZTogJywgJGNvb2tpZVN0b3JlLmdldCgnT3JkZXInKSk7XG5cdH1cblxufSk7XG5cbmFwcC5jb25maWcoZnVuY3Rpb24gKCRzdGF0ZVByb3ZpZGVyKSB7XG5cblxuICAgIC8vIFJlZ2lzdGVyIG91ciAqcHJvZHVjdHMqIHN0YXRlLlxuICAgICRzdGF0ZVByb3ZpZGVyLnN0YXRlKCdwcm9kdWN0cycsIHtcbiAgICAgICAgdXJsOiAnL3Byb2R1Y3RzJyxcbiAgICAgICAgY29udHJvbGxlcjogJ2FsbEl0ZW1zQ29udHJvbGxlcicsXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnanMvYWxsaXRlbXMvYWxsaXRlbXMuaHRtbCdcbiAgICB9KVxuXG59KTtcblxuYXBwLmNvbmZpZyhmdW5jdGlvbiAoJHN0YXRlUHJvdmlkZXIpIHtcblxuICAgIC8vIFJlZ2lzdGVyIG91ciAqbWVuKiBzdGF0ZS5cbiAgICAkc3RhdGVQcm92aWRlci5zdGF0ZSgnbWVuJywge1xuICAgICAgICB1cmw6ICcvcHJvZHVjdHMvbWVuJyxcbiAgICAgICAgY29udHJvbGxlcjogJ2FsbEl0ZW1zQ29udHJvbGxlcicsXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnanMvYWxsaXRlbXMvYWxsaXRlbXMuaHRtbCdcbiAgICB9KVxuXG59KTtcblxuYXBwLmNvbmZpZyhmdW5jdGlvbiAoJHN0YXRlUHJvdmlkZXIpIHtcblxuICAgIC8vIFJlZ2lzdGVyIG91ciAqd29tZW4qIHN0YXRlLlxuICAgICRzdGF0ZVByb3ZpZGVyLnN0YXRlKCd3b21lbicsIHtcbiAgICAgICAgdXJsOiAnL3Byb2R1Y3RzL3dvbWVuJyxcbiAgICAgICAgLy8gY29udHJvbGxlcjogJ2NhdGVnb3J5Q29udHJvbGxlcicsXG4gICAgICAgIGNvbnRyb2xsZXI6IGZ1bmN0aW9uICgkc2NvcGUsIEdldEl0ZW1zRmFjdG9yeSwgJHN0YXRlLCAkc3RhdGVQYXJhbXMpIHtcblx0XHRcdGNvbnNvbGUubG9nKFwiYmVmb3JlXCIsICRzY29wZS5pdGVtcywgJHN0YXRlLmN1cnJlbnQpO1xuXHRcdFx0R2V0SXRlbXNGYWN0b3J5LmdldEl0ZW1zKCkudGhlbihmdW5jdGlvbihpdGVtcyl7XHRcblx0XHRcdFx0JHNjb3BlLml0ZW1zID0gaXRlbXM7XG5cdFx0XHRcdGNvbnNvbGUubG9nKGl0ZW1zKTtcblx0XHRcdH0pO1xuXHRcdH0sXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnanMvYWxsaXRlbXMvYWxsaXRlbXMuaHRtbCcsXG4gICAgfSlcbn0pO1xuXG5cbmFwcC5jb250cm9sbGVyKCdhbGxJdGVtc0NvbnRyb2xsZXInLCBmdW5jdGlvbiAoJHNjb3BlLCBBdXRoU2VydmljZSwgR2V0SXRlbXNGYWN0b3J5LCAkc3RhdGUsICRzdGF0ZVBhcmFtcywgJGNvb2tpZVN0b3JlLCBPcmRlckZhY3RvcnkpIHtcblxuXHRHZXRJdGVtc0ZhY3RvcnkuZ2V0SXRlbXMoKS50aGVuKGZ1bmN0aW9uKGl0ZW1zLCBlcnIpe1xuXHRcdGlmKGVycikgdGhyb3cgZXJyO1xuXHRcdGVsc2V7XG5cdFx0XHQkc2NvcGUuaXRlbXMgPSBpdGVtcztcblx0XHR9XG5cdH0pO1xuXG5cblx0JHNjb3BlLmFkZFRvT3JkZXIgPSBmdW5jdGlvbihzcGVjaWZpY0l0ZW0pe1xuXHRcdGNvbnNvbGUubG9nKCdnb3QgaW50byB0aGUgYWRkVG9PcmRlciBmdW5jdGlvbicpOyAvL3BhcnQgb25lIGFsd2F5cyBhZGQgaXQgdG8gdGhlIGNvb2tpZVxuXHRcdHZhciBvcmRlciA9ICRjb29raWVTdG9yZS5nZXQoJ09yZGVyJyk7XG5cdFx0dmFyIHJlc29sdmVkID0gZmFsc2U7XG5cdFx0dmFyIGxpbmUgPSB7aXRlbUlkOiBzcGVjaWZpY0l0ZW0uX2lkLCBxdWFudGl0eTogMX07XG5cdFx0IGNvbnNvbGUubG9nKCdvcmRlcicsIG9yZGVyKTtcblx0XHRcdGlmKG9yZGVyKXsgLy9pZiB1c2VyIGhhcyBhbiBvcmRlciBvbiBhIGNvb2tpZVxuIFxuXHRcdFx0XHRvcmRlci5mb3JFYWNoKGZ1bmN0aW9uKGl0ZW1MaW5lKXtcblx0XHRcdFx0XHRpZihpdGVtTGluZS5pdGVtSWQgPT09IHNwZWNpZmljSXRlbS5faWQpe1xuXHRcdFx0XHRcdFx0aXRlbUxpbmUucXVhbnRpdHkrKztcblx0XHRcdFx0XHRcdHJlc29sdmVkID0gdHJ1ZTtcblx0XHRcdFx0XHR9XHRcblx0XHRcdFx0fSk7XG5cdFx0XHRcdGlmKCFyZXNvbHZlZCl7XG5cdFx0XHRcdFx0b3JkZXIucHVzaChsaW5lKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0ZWxzZXtcblx0XHRcdFx0b3JkZXIucHVzaChsaW5lKTtcblx0XHRcdH1cblxuXG5cdFx0JGNvb2tpZVN0b3JlLnB1dCgnT3JkZXInLCBvcmRlcik7XG5cblx0XHQvLyB2YXIgdXNlciA9IEF1dGhTZXJ2aWNlLmdldExvZ2dlZEluVXNlcigpO1xuXHRcdC8vIGlmKHVzZXIpe1xuXHRcdC8vIFx0Ly9PcmRlckZhY3RvcnkuZ2V0T3JkZXJzKHVzZXIuX2lkKS8vXG5cdFx0Ly8gfVxuXHR9XG59KTtcblxuXG5cbmFwcC5jb250cm9sbGVyKCdjYXRlZ29yeUNvbnRyb2xsZXInLCBmdW5jdGlvbiAoJHNjb3BlLCBHZXRJdGVtc0ZhY3RvcnksICRzdGF0ZSwgJHN0YXRlUGFyYW1zKSB7XG5cblx0JHNjb3BlLmdldENhdGVnb3J5ID0gZnVuY3Rpb24gKGNhdGVnb3J5KXtcblx0XHRjb25zb2xlLmxvZyhcIm1lbiBjb250cm9sbGVyXCIsIGNhdGVnb3J5KTtcblx0XHRcdEdldEl0ZW1GYWN0b3J5LmdldENhdGVnb3J5SXRlbXMoKS50aGVuKGZ1bmN0aW9uKGl0ZW1zLCBlcnIpe1xuXHRcdFx0XHRcdGlmKGVycikgdGhyb3cgZXJyO1xuXHRcdFx0XHRcdFx0ZWxzZXtcblx0XHRcdFx0XHRcdFx0JHNjb3BlLml0ZW1zID0gaXRlbXM7XG5cdFx0XHRcdFx0fTtcblx0XHRcdH0pO1xuXHR9O1xufSk7XG5cblxuIiwiIiwiKGZ1bmN0aW9uICgpIHtcblxuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIC8vIEhvcGUgeW91IGRpZG4ndCBmb3JnZXQgQW5ndWxhciEgRHVoLWRveS5cbiAgICBpZiAoIXdpbmRvdy5hbmd1bGFyKSB0aHJvdyBuZXcgRXJyb3IoJ0kgY2FuXFwndCBmaW5kIEFuZ3VsYXIhJyk7XG5cbiAgICB2YXIgYXBwID0gYW5ndWxhci5tb2R1bGUoJ2ZzYVByZUJ1aWx0JywgW10pO1xuXG4gICAgYXBwLmZhY3RvcnkoJ1NvY2tldCcsIGZ1bmN0aW9uICgkbG9jYXRpb24pIHtcblxuICAgICAgICBpZiAoIXdpbmRvdy5pbykgdGhyb3cgbmV3IEVycm9yKCdzb2NrZXQuaW8gbm90IGZvdW5kIScpO1xuXG4gICAgICAgIHZhciBzb2NrZXQ7XG5cbiAgICAgICAgaWYgKCRsb2NhdGlvbi4kJHBvcnQpIHtcbiAgICAgICAgICAgIHNvY2tldCA9IGlvKCdodHRwOi8vbG9jYWxob3N0OjEzMzcnKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHNvY2tldCA9IGlvKCcvJyk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gc29ja2V0O1xuXG4gICAgfSk7XG5cbiAgICBhcHAuY29uc3RhbnQoJ0FVVEhfRVZFTlRTJywge1xuICAgICAgICBsb2dpblN1Y2Nlc3M6ICdhdXRoLWxvZ2luLXN1Y2Nlc3MnLFxuICAgICAgICBsb2dpbkZhaWxlZDogJ2F1dGgtbG9naW4tZmFpbGVkJyxcbiAgICAgICAgbG9nb3V0U3VjY2VzczogJ2F1dGgtbG9nb3V0LXN1Y2Nlc3MnLFxuICAgICAgICBzZXNzaW9uVGltZW91dDogJ2F1dGgtc2Vzc2lvbi10aW1lb3V0JyxcbiAgICAgICAgbm90QXV0aGVudGljYXRlZDogJ2F1dGgtbm90LWF1dGhlbnRpY2F0ZWQnLFxuICAgICAgICBub3RBdXRob3JpemVkOiAnYXV0aC1ub3QtYXV0aG9yaXplZCdcbiAgICB9KTtcblxuICAgIGFwcC5jb25maWcoZnVuY3Rpb24gKCRodHRwUHJvdmlkZXIpIHtcbiAgICAgICAgJGh0dHBQcm92aWRlci5pbnRlcmNlcHRvcnMucHVzaChbXG4gICAgICAgICAgICAnJGluamVjdG9yJyxcbiAgICAgICAgICAgIGZ1bmN0aW9uICgkaW5qZWN0b3IpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gJGluamVjdG9yLmdldCgnQXV0aEludGVyY2VwdG9yJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIF0pO1xuICAgIH0pO1xuXG4gICAgYXBwLmZhY3RvcnkoJ0F1dGhJbnRlcmNlcHRvcicsIGZ1bmN0aW9uICgkcm9vdFNjb3BlLCAkcSwgQVVUSF9FVkVOVFMpIHtcbiAgICAgICAgdmFyIHN0YXR1c0RpY3QgPSB7XG4gICAgICAgICAgICA0MDE6IEFVVEhfRVZFTlRTLm5vdEF1dGhlbnRpY2F0ZWQsXG4gICAgICAgICAgICA0MDM6IEFVVEhfRVZFTlRTLm5vdEF1dGhvcml6ZWQsXG4gICAgICAgICAgICA0MTk6IEFVVEhfRVZFTlRTLnNlc3Npb25UaW1lb3V0LFxuICAgICAgICAgICAgNDQwOiBBVVRIX0VWRU5UUy5zZXNzaW9uVGltZW91dFxuICAgICAgICB9O1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgcmVzcG9uc2VFcnJvcjogZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICAgICAgJHJvb3RTY29wZS4kYnJvYWRjYXN0KHN0YXR1c0RpY3RbcmVzcG9uc2Uuc3RhdHVzXSwgcmVzcG9uc2UpO1xuICAgICAgICAgICAgICAgIHJldHVybiAkcS5yZWplY3QocmVzcG9uc2UpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgIH0pO1xuXG4gICAgYXBwLnNlcnZpY2UoJ0F1dGhTZXJ2aWNlJywgZnVuY3Rpb24gKCRodHRwLCBTZXNzaW9uLCAkcm9vdFNjb3BlLCBBVVRIX0VWRU5UUywgJHEpIHtcblxuICAgICAgICB2YXIgb25TdWNjZXNzZnVsTG9naW4gPSBmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgICAgICAgICAgIHZhciBkYXRhID0gcmVzcG9uc2UuZGF0YTtcbiAgICAgICAgICAgIFNlc3Npb24uY3JlYXRlKGRhdGEuaWQsIGRhdGEudXNlcik7XG4gICAgICAgICAgICAkcm9vdFNjb3BlLiRicm9hZGNhc3QoQVVUSF9FVkVOVFMubG9naW5TdWNjZXNzKTtcbiAgICAgICAgICAgIHJldHVybiBkYXRhLnVzZXI7XG4gICAgICAgIH07XG5cbiAgICAgICAgdGhpcy5nZXRMb2dnZWRJblVzZXIgPSBmdW5jdGlvbiAoKSB7XG5cbiAgICAgICAgICAgIGlmICh0aGlzLmlzQXV0aGVudGljYXRlZCgpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuICRxLndoZW4oeyB1c2VyOiBTZXNzaW9uLnVzZXIgfSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiAkaHR0cC5nZXQoJy9zZXNzaW9uJykudGhlbihvblN1Y2Nlc3NmdWxMb2dpbikuY2F0Y2goZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgfTtcblxuICAgICAgICB0aGlzLmxvZ2luID0gZnVuY3Rpb24gKGNyZWRlbnRpYWxzKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhjcmVkZW50aWFscyk7XG4gICAgICAgICAgICByZXR1cm4gJGh0dHAucG9zdCgnL2xvZ2luJywgY3JlZGVudGlhbHMpLnRoZW4ob25TdWNjZXNzZnVsTG9naW4pO1xuICAgICAgICB9O1xuXG4gICAgICAgIHRoaXMubG9nb3V0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuICRodHRwLmdldCgnL2xvZ291dCcpLnRoZW4oZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIFNlc3Npb24uZGVzdHJveSgpO1xuICAgICAgICAgICAgICAgICRyb290U2NvcGUuJGJyb2FkY2FzdChBVVRIX0VWRU5UUy5sb2dvdXRTdWNjZXNzKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuXG4gICAgICAgIHRoaXMuaXNBdXRoZW50aWNhdGVkID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuICEhU2Vzc2lvbi51c2VyO1xuICAgICAgICB9O1xuXG4gICAgfSk7XG5cbiAgICBhcHAuc2VydmljZSgnU2Vzc2lvbicsIGZ1bmN0aW9uICgkcm9vdFNjb3BlLCBBVVRIX0VWRU5UUykge1xuXG4gICAgICAgICRyb290U2NvcGUuJG9uKEFVVEhfRVZFTlRTLm5vdEF1dGhlbnRpY2F0ZWQsIHRoaXMuZGVzdHJveSk7XG4gICAgICAgICRyb290U2NvcGUuJG9uKEFVVEhfRVZFTlRTLnNlc3Npb25UaW1lb3V0LCB0aGlzLmRlc3Ryb3kpO1xuXG4gICAgICAgIHRoaXMuY3JlYXRlID0gZnVuY3Rpb24gKHNlc3Npb25JZCwgdXNlcikge1xuICAgICAgICAgICAgdGhpcy5pZCA9IHNlc3Npb25JZDtcbiAgICAgICAgICAgIHRoaXMudXNlciA9IHVzZXI7XG4gICAgICAgIH07XG5cbiAgICAgICAgdGhpcy5kZXN0cm95ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdGhpcy5pZCA9IG51bGw7XG4gICAgICAgICAgICB0aGlzLnVzZXIgPSBudWxsO1xuICAgICAgICB9O1xuXG4gICAgfSk7XG5cbn0pKCk7IiwiJ3VzZSBzdHJpY3QnO1xuYXBwLmNvbmZpZyhmdW5jdGlvbiAoJHN0YXRlUHJvdmlkZXIpIHtcblxuICAgICRzdGF0ZVByb3ZpZGVyLnN0YXRlKCdob21lJywge1xuICAgICAgICB1cmw6ICcvJyxcbiAgICAgICAgY29udHJvbGxlcjogJ0hvbWVDdHJsJyxcbiAgICAgICAgdGVtcGxhdGVVcmw6ICdqcy9ob21lL2hvbWUuaHRtbCdcbiAgICB9KTtcblxufSk7XG5cbmFwcC5jb250cm9sbGVyKCdIb21lQ3RybCcsIGZ1bmN0aW9uICgkc2NvcGUpIHtcbn0pOyIsImFwcC5jb250cm9sbGVyKCdwcm9kdWN0cmV2aWV3c2NvbnRyb2xsZXInLCBmdW5jdGlvbigkc2NvcGUpe1xuICAgICRzY29wZS5yYXRlMSA9IDA7XG5cbiAgICAkc2NvcGUucmF0ZTIgPSA2O1xuXG4gICAgJHNjb3BlLnJldmlld3NsaXN0ID0gW1xuICAgICAgICB7XG4gICAgICAgICAgICByYXRpbmc6IDUsXG4gICAgICAgICAgICB0ZXh0OiBcIlRoZXNlIGFyZSBxdWl0ZSBzaW1wbHkgdGhlIGJlc3QgZ2xhc3NlcywgbmF5IHRoZSBiZXN0IEFOWVRISU5HIEkndmUgZXZlciBvd25lZCEgXCIgK1xuICAgICAgICAgICAgXCJXaGVuIEkgcHV0IHRoZW0gb24sIGFuIGVuZXJneSBiZWFtIHNob290cyBvdXQgb2YgbXkgZXllYmFsbHMgdGhhdCBtYWtlcyBldmVyeXRoaW5nIEkgbG9vayBhdCBcIiArXG4gICAgICAgICAgICBcImJ1cnN0IGludG8gZmxhbWVzISEgTXkgZ2lybGZyaWVuZCBkb2Vzbid0IGFwcHJlY2lhdGUgaXQsIHRob3VnaC5cIlxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICByYXRpbmc6IDEsXG4gICAgICAgICAgICB0ZXh0OiBcIlRoZXNlIGdsYXNzZXMgYXJlIHRoZSB3b3JzdCEgV2hvIG1hZGUgdGhlc2U/IFdoZW4gSSBvcGVuZWQgdGhlIHBhY2thZ2UgdGhleSBzcHJ1bmcgb3V0IGFuZCBzdWNrZWQgXCIgK1xuICAgICAgICAgICAgXCJvbnRvIG15IGZhY2UgbGlrZSB0aGUgbW9uc3RlciBpbiBBTElFTiEgSSBoYWQgdG8gYmVhdCBteXNlbGYgaW4gdGhlIGhlYWQgd2l0aCBhIHNob3ZlbCB0byBnZXQgdGhlbSBvZmYhIFwiICtcbiAgICAgICAgICAgIFwiV2hvIEFSRSB5b3UgcGVvcGxlPyBXaGF0IGlzIHdyb25nIHdpdGggeW91PyBIYXZlIHlvdSBubyBkaWduaXR5PyBEb24ndCB5b3UgdW5kZXJzdGFuZCB3aGF0IGV5ZWdsYXNzZXMgYXJlIFwiICtcbiAgICAgICAgICAgIFwiRk9SP1wiXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIHJhdGluZzogNCxcbiAgICAgICAgICAgIHRleHQ6IFwiVGhlIGdsYXNzZXMgYXJlIGp1c3QgT0sg4oCUIHRvIHNwaWNlIHRoaW5ncyB1cCBJIGNob3BwZWQgdXAgc29tZSBzY2FsbGlvbnMgYW5kIGFkZGVkIHNvbWUgaGVhdnkgY3JlYW0sIGEgcGluY2ggb2YgdGFydGFyLCBcIiArXG4gICAgICAgICAgICBcInNvbWUgYW5jaG92eSBwYXN0ZSwgYmFzaWwgYW5kIGEgaGFsZiBwaW50IG9mIG1hcGxlIHN5cnVwLiBUaGUgZ2xhc3MgaW4gdGhlIGdsYXNzZXMgc3RpbGwgY2FtZSBvdXQgY3J1bmNoeSB0aG91Z2guIFwiICtcbiAgICAgICAgICAgIFwiSSdtIHRoaW5raW5nIG9mIHJ1bm5pbmcgdGhlbSB0aHJvdWdoIGEgbWl4bXVsY2hlciBuZXh0IHRpbWUgYmVmb3JlIHRocm93aW5nIGV2ZXJ5dGhpbmcgaW4gdGhlIG92ZW4uXCJcbiAgICAgICAgfVxuICAgIF1cbn0pIiwiYXBwXG5cbiAgICAuY29uc3RhbnQoJ3JhdGluZ0NvbmZpZycsIHtcbiAgICAgICAgbWF4OiA1LFxuICAgIH0pXG5cbiAgICAuZGlyZWN0aXZlKCdyZXZpZXdzdGFyJywgWydyYXRpbmdDb25maWcnLCBmdW5jdGlvbihyYXRpbmdDb25maWcpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHJlc3RyaWN0OiAnRUEnLFxuICAgICAgICAgICAgcmVwbGFjZTogdHJ1ZSxcbiAgICAgICAgICAgIHNjb3BlOiB7XG4gICAgICAgICAgICAgICAgdmFsdWU6ICc9J1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGNvbnRyb2xsZXI6IFwicHJvZHVjdHJldmlld3Njb250cm9sbGVyXCIsXG4gICAgICAgICAgICB0ZW1wbGF0ZTogJzxkaXYgaWQ9XCJzaG93bWVcIiBuZy1tb3VzZWxlYXZlPVwicmVzZXQoKVwiPjxpIGlkPVwic2hvd21lXCIgbmctcmVwZWF0PVwibnVtYmVyIGluIHJhbmdlXCIgJyArXG4gICAgICAgICAgICAgICAgJ25nLW1vdXNlZW50ZXI9XCJlbnRlcihudW1iZXIpXCIgbmctY2xpY2s9XCJhc3NpZ24obnVtYmVyKVwiICcgK1xuICAgICAgICAgICAgICAgICduZy1jbGFzcz1cIntcXCdnbHlwaGljb24gZ2x5cGhpY29uLXN0YXIgaWNvbi1nb2xkXFwnOiBudW1iZXIgPD0gdmFsLCAnICtcbiAgICAgICAgICAgICAgICAnXFwnZ2x5cGhpY29uIGdseXBoaWNvbi1zdGFyIGljb24tZ3JheVxcJzogbnVtYmVyID4gdmFsfVwiPjwvaT48L2Rpdj4nLFxuICAgICAgICAgICAgbGluazogZnVuY3Rpb24oc2NvcGUsIGVsZW1lbnQsIGF0dHJzLCBpbmRleCkge1xuICAgICAgICAgICAgICAgIHZhciBtYXhSYW5nZSA9IGFuZ3VsYXIuaXNEZWZpbmVkKGF0dHJzLm1heCkgPyBzY29wZS4kZXZhbChhdHRycy5tYXgpIDogcmF0aW5nQ29uZmlnLm1heDtcbiAgICAgICAgICAgICAgICBzY29wZS5yYW5nZSA9IFtdO1xuICAgICAgICAgICAgICAgIGZvcih2YXIgaSA9IDE7IGkgPD0gbWF4UmFuZ2U7IGkrKyApIHtcbiAgICAgICAgICAgICAgICAgICAgc2NvcGUucmFuZ2UucHVzaChpKTtcbiAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAgICAgc2NvcGUudmFsID0gc2NvcGUudmFsdWU7XG5cbiAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKHNjb3BlKTtcblxuXG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgfV0pO1xuXG5hcHAuY29udHJvbGxlcigncHJvZHVjdHN0YXInLCBmdW5jdGlvbigkc2NvcGUpIHtcblxuICAgICRzY29wZS5yYXRlMSA9IDA7XG5cbiAgICAkc2NvcGUucmF0ZTIgPSA2O1xuXG4gICAgJHNjb3BlLnZhbCA9ICRzY29wZS5yYXRpbmc7XG5cbn0pOyIsIid1c2Ugc3RyaWN0JztcblxuYXBwLnJ1bihmdW5jdGlvbiAoJGNvb2tpZXMsICRjb29raWVTdG9yZSkge1xuXG5cdHZhciBpbml0ID0gJGNvb2tpZVN0b3JlLmdldCgnT3JkZXInKTtcblx0aWYoIWluaXQpe1xuXHRcdCRjb29raWVTdG9yZS5wdXQoJ09yZGVyJywgW10pO1xuXHRcdGNvbnNvbGUubG9nKCdzdGFydGluZyBjb29raWU6ICcsICRjb29raWVTdG9yZS5nZXQoJ09yZGVyJykpO1xuXHR9XG5cbn0pO1xuXG5hcHAuY29uZmlnKGZ1bmN0aW9uICgkc3RhdGVQcm92aWRlcikge1xuXG4gICAgLy8gUmVnaXN0ZXIgb3VyICppdGVtKiBzdGF0ZS5cbiAgICAkc3RhdGVQcm92aWRlci5zdGF0ZSgnaXRlbScsIHtcbiAgICAgICAgdXJsOiAnL2l0ZW0vOm5hbWUnLFxuICAgICAgICBjb250cm9sbGVyOiAnaXRlbUNvbnRyb2xsZXInLFxuICAgICAgICB0ZW1wbGF0ZVVybDogJ2pzL2l0ZW0vaXRlbS5odG1sJ1xuICAgIH0pO1xuXG59KTtcblxuYXBwLmNvbnRyb2xsZXIoJ2l0ZW1Db250cm9sbGVyJywgZnVuY3Rpb24gKCRzY29wZSwgR2V0SXRlbUZhY3RvcnksICRzdGF0ZSwgJHN0YXRlUGFyYW1zLCAkY29va2llU3RvcmUsIEF1dGhTZXJ2aWNlLCBPcmRlckZhY3RvcnkgKSB7XG5cblx0Ly9nZXQgaW5wdXQgZnJvbSB1c2VyIGFib3V0IGl0ZW0gKGlkIGZyb20gdXJsIClcblx0Ly9jaGVjayBpZCB2cyBkYXRhYmFzZVxuXHQvL2lmIG5vdCBmb3VuZCwgcmVkaXJlY3QgdG8gc2VhcmNoIHBhZ2Vcblx0Ly9pZiBmb3VuZCBzZW5kIHRlbXBhbGF0ZVVybFxuXG5cdEdldEl0ZW1GYWN0b3J5LmdldEl0ZW0oJHN0YXRlUGFyYW1zLm5hbWUpLnRoZW4oZnVuY3Rpb24oaXRlbSwgZXJyKXtcblx0XHRpZihlcnIpICRzdGF0ZS5nbygnaG9tZScpO1xuXHRcdGVsc2V7XG5cdFx0XHQkc2NvcGUuaXRlbSA9IGl0ZW1bMF07XG5cdFx0XHR9XG5cdH0pO1xuXG5cdCRzY29wZS5hZGRUb09yZGVyID0gZnVuY3Rpb24oKXtcblx0XHRcblx0XHRBdXRoU2VydmljZS5pc0F1dGhlbnRpY2F0ZWQoKS50aGVuKGZ1bmN0aW9uKGFuc3dlcil7XG5cdFx0XHR2YXIgb3JkZXIgPSAkY29va2llcy5nZXQoJ09yZGVyJyk7XG5cdFx0XHR2YXIgbGluZSA9IHtpdGVtOiAkc2NvcGUuaXRlbSwgcXVhbnRpdHk6IDF9O1xuXHRcdFx0aWYoIW9yZGVyKXtcblx0XHRcdFx0JGNvb2tpZXMucHV0KCdPcmRlcicsIGxpbmUpO1xuXHRcdFx0fVxuXHRcdFx0ZWxzZXtcblx0XHRcdFx0b3JkZXIucHVzaChsaW5lKTtcblx0XHRcdFx0JGNvb2tpZXMucHV0KCdPcmRlcicsIG9yZGVyKTtcblx0XHRcdH1cblxuXHRcdFx0aWYoYW5zd2VyKXtcblx0XHRcdFx0T3JkZXJGYWN0b3J5LmFkZEl0ZW0oKVxuXHRcdFx0fVxuXHRcdH0pXG5cdH1cbn0pOyIsIid1c2Ugc3RyaWN0JztcbmFwcC5jb25maWcoZnVuY3Rpb24gKCRzdGF0ZVByb3ZpZGVyKSB7XG5cbiAgICAvLyBSZWdpc3RlciBvdXIgKml0ZW1DcmVhdGUqIHN0YXRlLlxuICAgICRzdGF0ZVByb3ZpZGVyLnN0YXRlKCdhZG1pbi5pdGVtQ3JlYXRlJywge1xuICAgICAgICB1cmw6ICcvaXRlbUNyZWF0ZScsXG4gICAgICAgIGNvbnRyb2xsZXI6ICdpdGVtQ3JlYXRlQ29udHJvbGxlcicsXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnanMvaXRlbUNyZWF0ZS9pdGVtQ3JlYXRlLmh0bWwnLFxuICAgICAgICByZXNvbHZlOiB7XG4gICAgICAgIFx0Z2V0SXRlbXM6ICBmdW5jdGlvbigkaHR0cCl7XG4gICAgICAgIFx0XHRyZXR1cm4gJGh0dHAuZ2V0KCcvYXBpL2l0ZW1saXN0JykudGhlbihmdW5jdGlvbiAocmVzcG9uc2Upe1xuXHRcdFx0XHRcdHJldHVybiByZXNwb25zZS5kYXRhO1xuICAgICAgICBcdFx0XHR9KVxuICAgICAgICBcdFx0fVxuICAgICAgICBcdH1cbiAgICB9KTtcblxufSk7XG5cbmFwcC5jb250cm9sbGVyKCdpdGVtQ3JlYXRlQ29udHJvbGxlcicsIGZ1bmN0aW9uICgkc2NvcGUsIENyZWF0ZUl0ZW1GYWN0b3J5LCBnZXRJdGVtcywgJHN0YXRlLCAkc3RhdGVQYXJhbXMpIHtcblxuXHQkc2NvcGUuaXRlbTtcblx0JHNjb3BlLnN1Y2Nlc3M7XG5cblx0JHNjb3BlLm1lbnVJdGVtcyA9IFtcblx0XHR7IGxhYmVsOiAnYWxsIGl0ZW1zJ30sXG4gICAgICAgIHsgbGFiZWw6ICdtZW5zJ30sXG4gICAgICAgIHsgbGFiZWw6ICd3b21lbnMnfSxcbiAgICAgICAgeyBsYWJlbDogJ2tpZHMnfSxcbiAgICAgICAgeyBsYWJlbDogJ3BldHMnfVxuICAgIF07XG5cblx0JHNjb3BlLmFsbEl0ZW1zID0gZ2V0SXRlbXNcblxuXHQkc2NvcGUuaXRlbXMgPSAkc2NvcGUuYWxsSXRlbXNcblxuXHQkc2NvcGUuZmlsdGVySXRlbXMgPSBmdW5jdGlvbiAoY2F0ZWdvcnkpIHtcblx0XHRpZiAoY2F0ZWdvcnkgPSAnYWxsIGl0ZW1zJykge1xuXHRcdFx0cmV0dXJuICRzY29wZS5pdGVtcyA9ICRzY29wZS5hbGxJdGVtc1xuXHRcdH1cblx0fVxuXG5cdGNvbnNvbGUubG9nKCRzY29wZS5pdGVtc1swXS5hdmFpbGFibGUpXG5cblx0JHNjb3BlLnN1Ym1pdEl0ZW0gPSBmdW5jdGlvbigpIHtcblx0XHQvLyRzY29wZS5pdGVtLmNhdGVnb3JpZXMgPSAkc2NvcGUuaXRlbS5jYXRlZ29yaWVzLnNwbGl0KCcgJyk7XG5cdFx0Y29uc29sZS5sb2coJ3Byb2Nlc3Mgc3RhcnRlZCcpO1xuXHRcdGNvbnNvbGUubG9nKCRzY29wZS5pdGVtKTtcblx0XHRDcmVhdGVJdGVtRmFjdG9yeS5wb3N0SXRlbSgkc2NvcGUuaXRlbSkudGhlbihmdW5jdGlvbihpdGVtLCBlcnIpe1xuXHRcdFx0aWYoZXJyKSAkc2NvcGUuc3VjY2Vzcz0gZmFsc2U7XG5cdFx0XHRlbHNle1xuXHRcdFx0XHRjb25zb2xlLmxvZyhpdGVtKTtcblx0XHRcdFx0JHNjb3BlLnN1Y2Nlc3MgPSB0cnVlO1xuXHRcdFx0XHRcblx0XHRcdH1cblx0XHR9KTtcblx0fVxufSk7IiwiYXBwLmNvbmZpZyhmdW5jdGlvbiAoJHN0YXRlUHJvdmlkZXIpIHtcblxuICAgIC8vIFJlZ2lzdGVyIG91ciAqSm9pbiBOb3cqIHN0YXRlLlxuICAgICRzdGF0ZVByb3ZpZGVyLnN0YXRlKCdqb2luJywge1xuICAgICAgICB1cmw6ICcvam9pbicsXG4gICAgICAgIGNvbnRyb2xsZXI6ICdqb2luQ29udHJvbGxlcicsXG5cbiAgICAgICAgdGVtcGxhdGVVcmw6ICdqcy9qb2lubm93L2pvaW5ub3cuaHRtbCcgXG5cbiAgICB9KTtcblxufSk7XG5cblxuXG5hcHAuY29udHJvbGxlcignam9pbkNvbnRyb2xsZXInLCBmdW5jdGlvbigkc2NvcGUsICR3aW5kb3csIENyZWF0ZVVzZXJGYWN0b3J5LCBBdXRoU2VydmljZSkge1xuXG4gICAgJHNjb3BlLmxvZ2lub2F1dGggPSBmdW5jdGlvbiAocHJvdmlkZXIpIHtcbiAgICAgICAgdmFyIGxvY2F0aW9uID0gJ2F1dGgvJyArIHByb3ZpZGVyO1xuICAgICAgICAkd2luZG93LmxvY2F0aW9uLmhyZWYgPSBsb2NhdGlvbjtcbiAgICB9XG5cbiAgICAkc2NvcGUuc3VjY2VzcztcblxuXG4gICAgJHNjb3BlLnN1Ym1pdFVzZXIgPSBmdW5jdGlvbigpIHtcbiAgICBcdGNvbnNvbGUubG9nKFwidXNlciBzdWJtaXQgcHJvY2VzcyBzdGFydGVkXCIpO1xuICAgIFx0Y29uc29sZS5sb2coJHNjb3BlLnVzZXIpO1xuXHQgICAgQ3JlYXRlVXNlckZhY3RvcnkucG9zdFVzZXIoJHNjb3BlLnVzZXIpLnRoZW4oZnVuY3Rpb24odXNlciwgZXJyKXtcblx0ICAgIFx0aWYgKGVycikgJHNjb3BlLnN1Y2Nlc3M9ZmFsc2U7XG5cdCAgICBcdGVsc2V7XG4gICAgICAgICAgICAgICAgQXV0aFNlcnZpY2UubG9naW4odXNlcikudGhlbihmdW5jdGlvbihjb25jbHVzaW9uKXtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2codXNlcik7XG4gICAgICAgICAgICAgICAgICAgICRzY29wZS5zdWNjZXNzID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9KTtcblx0ICAgIFx0fVxuXHQgICAgfSk7XG5cdCAgfVxuXG4gICAgICBmdW5jdGlvbiB2YWxpZGF0ZVBhc3N3b3JkIChlbWFpbCl7XG4gICAgICAgIHJlZ2V4ID0gL14oW1xcdy1cXC5dK0AoPyFnbWFpbC5jb20pKD8heWFob28uY29tKSg/IWhvdG1haWwuY29tKShbXFx3LV0rXFwuKStbXFx3LV17Miw0fSk/JC87XG4gICAgICAgIHJldHVybiByZWdleC50ZXN0KGVtYWlsKTtcbiAgICAgIH1cblxufSk7XG5cbiIsImFwcC5jb25maWcoZnVuY3Rpb24gKCRzdGF0ZVByb3ZpZGVyKSB7XG5cbiAgICAvLyBSZWdpc3RlciBvdXIgKkpvaW4gTm93KiBzdGF0ZS5cbiAgICAkc3RhdGVQcm92aWRlci5zdGF0ZSgnbG9naW4nLCB7XG4gICAgICAgIHVybDogJy9sb2dpbicsXG4gICAgICAgIGNvbnRyb2xsZXI6ICdsb2dpbkNvbnRyb2xsZXInLFxuICAgICAgICB0ZW1wbGF0ZVVybDogJ2pzL2xvZ2luL2xvZ2luLmh0bWwnIFxuICAgIH0pO1xuXG59KTtcblxuXG5hcHAuY29udHJvbGxlcignbG9naW5Db250cm9sbGVyJywgZnVuY3Rpb24gKCRzY29wZSwgJHdpbmRvdywgQXV0aFNlcnZpY2UsICRzdGF0ZSwgU2Vzc2lvbiwgJHJvb3RTY29wZSkge1xuICAgICRzY29wZS5sb2dpbm9hdXRoID0gZnVuY3Rpb24gKHByb3ZpZGVyKSB7XG4gICAgICAgIHZhciBsb2NhdGlvbiA9ICdhdXRoLycgKyBwcm92aWRlcjtcbiAgICAgICAgJHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gbG9jYXRpb247XG4gICAgfVxuICAgICRzY29wZS5zdWNjZXNzO1xuICAgICRzY29wZS5zdWJtaXRVc2VyID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBpbmZvID0gJHNjb3BlLnVzZXI7XG4gICAgICAgIGNvbnNvbGUubG9nKFwidXNlciBsb2dpbiBwcm9jZXNzIHN0YXJ0ZWQgd2l0aDogXCIsIGluZm8pO1xuICAgICAgICBBdXRoU2VydmljZS5sb2dpbihpbmZvKS50aGVuKGZ1bmN0aW9uKGluZm8pe1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJjb250cm9sbGVyXCIsIGluZm8pO1xuICAgICAgICAgICAgICAgIGlmIChpbmZvLmFkbWluKSB7XG4gICAgICAgICAgICAgICAgICAgICRzdGF0ZS5nbygnYWRtaW4nKVxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICRzdGF0ZS5nbygncHJvZHVjdHMnKVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgLy8gdGhpcyBpcyBqdXN0IHRlc3Rpbmcgc2Vzc2lvbnMgc3RhcnRlZFxuICAgICRzY29wZS5pc0xvZ2dlZEluID0gQXV0aFNlcnZpY2UuaXNBdXRoZW50aWNhdGVkKCk7XG4gICAgLy8gZW5kIHRlc3RcblxuXG5cbiAgICAgICAgLy8gR2V0VXNlckZhY3RvcnkuYXV0aFVzZXIoaW5mbykudGhlbihmdW5jdGlvbih1c2VyLCBlcnIpe1xuICAgICAgICAvLyAgICAgaWYoZXJyKSAkc2NvcGUuc3VjY2VzcyA9IGZhbHNlO1xuICAgICAgICAvLyAgICAgZWxzZSB7XG4gICAgICAgIC8vICAgICAgICAgJHJvb3RTY29wZS5zdWNjZXNzID0gZmFsc2U7XG4gICAgICAgIC8vICAgICAgICAgY29uc29sZS5sb2coJHJvb3RTY29wZS5jdXJyZW50VXNlcilcbiAgICAgICAgLy8gICAgICAgICBpZiAodXNlclswXS5hZG1pbikge1xuICAgICAgICAvLyAgICAgICAgICAgICAkc3RhdGUuZ28oJ2FkbWluJylcbiAgICAgICAgLy8gICAgICAgICB9IGVsc2Uge1xuICAgICAgICAvLyAgICAgICAgICAgICAkc3RhdGUuZ28oJ2hvbWUnKVxuICAgICAgICAvLyAgICAgICAgIH1cbiAgICAgICAgLy8gICAgIH1cbiAgICAgICAgLy8gfSkgICAgICBcblxuICAgIH07XG59KTtcbiIsIid1c2Ugc3RyaWN0JztcbmFwcC5jb25maWcoZnVuY3Rpb24gKCRzdGF0ZVByb3ZpZGVyKSB7XG5cbiAgICAvLyBSZWdpc3RlciBvdXIgKm9yZGVycyogc3RhdGUuXG4gICAgJHN0YXRlUHJvdmlkZXIuc3RhdGUoJ29yZGVycycsIHtcbiAgICAgICAgdXJsOiAnL29yZGVyLzpuYW1lJyxcbiAgICAgICAgY29udHJvbGxlcjogJ29yZGVyQ29udHJvbGxlcicsXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnanMvb3JkZXIvb3JkZXIuaHRtbCdcbiAgICB9KTtcblxufSk7XG5cbmFwcC5jb250cm9sbGVyKCdvcmRlckNvbnRyb2xsZXInLCBmdW5jdGlvbiAoJHNjb3BlLCBHZXRJdGVtc0ZhY3RvcnksIE9yZGVyRmFjdG9yeSwgJHN0YXRlLCAkc3RhdGVQYXJhbXMsICRjb29raWVTdG9yZSwgQXV0aFNlcnZpY2UpIHtcblxuXHQvL3Byb3ZpZGVzIGdlbmVyYWwgZnVuY3Rpb25hbGl0eSB3aXRoIGFuIG9yZGVyXG5cdC8vdmlld3MgY3VycmVudCB1c2VyIG9yZGVyXG5cdFx0Ly9vcmRlciBpcyBzaG93biBieSBsaW5lIGl0ZW1cblx0XHQvL2hhcyBhYmlsaXR5IHRvIGVkaXQgb3JkZXIsIG9yIHByb2NlZWQgdG8gY2hlY2tvdXRcblx0JHNjb3BlLmFjdGl2ZW9yZGVycz1bXTsgLy9leHBlY3RzIGl0ZW0ge2l0ZW1JZDogaXRlbUlkLCBwcmljZTogbnVtLCBpbWdVcmw6U3RyaW5nLCB9LCBxdHk6IG51bVxuXHQkc2NvcGUucGFzdG9yZGVycz1bXTtcblx0JHNjb3BlLnVzZXI7XG5cdCRzY29wZS5zdW0gPSAwO1xuXHQkc2NvcGUudG90YWxRdHkgPSAwOyBcblx0JHNjb3BlLnRlbXBWYWw7XG5cdCRzY29wZS5vcmRlcklkO1xuXHQkc2NvcGUudXNlcklkO1xuXHQkc2NvcGUuYXV0aDtcblxuXHRmdW5jdGlvbiBmaXJzdFVwZGF0ZSAoKXtcblx0Ly9jaGVjayBpZiB1c2VyIGlzIGF1dGhlbnRpY2F0ZWQsIHBvcHVsYXRlIG9yZGVyIGZyb20gZGIsIHNldCBvcmRlciB0byBjb29raWVcblx0XHRpZiggQXV0aFNlcnZpY2UuaXNBdXRoZW50aWNhdGVkKCkgKXtcblx0XHRcdEF1dGhTZXJ2aWNlLmdldExvZ2dlZEluVXNlcigpLnRoZW4oZnVuY3Rpb24odXNlcil7XG5cdFx0XHQkc2NvcGUudXNlcklkID0gdXNlci5faWQ7XG5cdFx0XHQkc2NvcGUudXNlciA9IHVzZXIuZmlyc3RfbmFtZTtcblx0XHRcdCRzY29wZS5hdXRoID0gdHJ1ZTtcblx0XHRcdFx0T3JkZXJGYWN0b3J5LmdldE9yZGVycygkc2NvcGUudXNlcklkKS50aGVuKGZ1bmN0aW9uKGl0ZW1zLCBlcnIpe1xuXHRcdFx0XHRcdGNvbnNvbGUubG9nKCdpdGVtcycsIGl0ZW1zKTtcblx0XHRcdFx0XHRpZiAoZXJyKSBjb25zb2xlLmxvZygnRXJyb3I6ICcsIGVycik7XG5cdFx0XHRcdFx0ZWxzZSBpZighaXRlbXMpIHsgLy9ubyBpdGVtcyBpbiBkQiwgZ2V0IGNvb2tpZXMsIHNldCBvcmRlclxuXHRcdFx0XHRcdFx0JHNjb3BlLmFjdGl2ZW9yZGVycyA9ICRjb29raWVTdG9yZS5nZXQoJ09yZGVyJyk7XG5cdFx0XHRcdFx0XHRPcmRlckZhY3RvcnkuY3JlYXRlT3JkZXIoe3VzZXJJZDogJHNjb3BlLnVzZXJJZCwgaXRlbXM6ICRzY29wZS5hY3RpdmVvcmRlcnN9LCBmdW5jdGlvbihyZXNwb25zZSl7XG5cdFx0XHRcdFx0XHRcdCRzY29wZS5hY3RpdmVvcmRlcnMgPSByZXNwb25zZS5saW5laXRlbXM7XG5cdFx0XHRcdFx0XHRcdHN1bSgpO1xuXHRcdFx0XHRcdFx0XHR0b3RhbFF0eSgpO1xuXHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGVsc2UgeyAvL2l0ZW1zIGluIGRiLCBtYWtlIHN1cmUgY29va2llcyBhcmUgYWRkZWQgdG8gZGJcblx0XHRcdFx0XHRcdCRzY29wZS5hY3RpdmVvcmRlcnMgPSBpdGVtcy5saW5laXRlbXMubGluZUl0ZW07XG5cdFx0XHRcdFx0XHQkc2NvcGUub3JkZXJJZCA9IGl0ZW1zLm9yZGVySWQ7XG5cdFx0XHRcdFx0XHRzdW0oKTtcblx0XHRcdFx0XHRcdHRvdGFsUXR5KCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9KTtcblx0XHRcdH0pO1xuXHRcdH1cblx0XHRlbHNlIHtcblx0XHRcdHZhciBpZEFuZFF0eSA9ICRjb29raWVTdG9yZS5nZXQoJ09yZGVyJyk7XG5cdFx0XHR2YXIgcHJvZHVjdExpc3Q9W107XG5cdFx0XHRHZXRJdGVtc0ZhY3RvcnkuZ2V0SXRlbXMoKS50aGVuKGZ1bmN0aW9uKGl0ZW1zLCBlcnIpeyAvL2FwcHJvYWNoIHdpbGwgbm90IHNjYWxlIHdlbGwgYnV0IGlzIHF1aWNrZXIgbm93XG5cdFx0XHRcdGlmKGVycikgY29uc29sZS5sb2coZXJyKTtcblx0XHRcdFx0aWRBbmRRdHkuZm9yRWFjaChmdW5jdGlvbihpdGVtUGFpcil7XG5cdFx0XHRcdFx0Zm9yKHZhciBhPTAsIGxlbj1pdGVtcy5sZW5ndGg7IGE8NzsgYSsrKXtcblx0XHRcdFx0XHRcdGlmKGl0ZW1QYWlyLml0ZW1JZCA9PT0gaXRlbXNbYV0uX2lkKXtcblx0XHRcdFx0XHRcdFx0cHJvZHVjdExpc3QucHVzaCh7aXRlbTogaXRlbXNbYV0sIHF1YW50aXR5OiBpdGVtUGFpci5xdWFudGl0eSB9KTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0pO1xuXHRcdFx0XHRjb25zb2xlLmxvZygncHJvZExpc3QnLCBwcm9kdWN0TGlzdCk7XG5cdFx0XHRcdCRzY29wZS5hY3RpdmVvcmRlcnMgPSBwcm9kdWN0TGlzdDtcblx0XHRcdFx0JHNjb3BlLnVzZXIgPSAnVXNlcic7XG5cdFx0XHRcdCRzY29wZS5hdXRoID0gZmFsc2U7XG5cdFx0XHRcdHN1bSgpO1xuXHRcdFx0XHR0b3RhbFF0eSgpO1xuXHRcdFx0fSlcblx0XHR9XG5cdH07XG5cblx0Zmlyc3RVcGRhdGUoKTtcblxuXHRmdW5jdGlvbiB0b3RhbFF0eSAoKXtcblx0XHR2YXIgdG90YWxRID0gMDtcblx0XHRjb25zb2xlLmxvZygnZ290IHRvIHN1bScpO1xuXHRcdCRzY29wZS5hY3RpdmVvcmRlcnMuZm9yRWFjaChmdW5jdGlvbihsaW5lSXRlbSl7XG5cdFx0XHR0b3RhbFE9IHRvdGFsUSArIGxpbmVJdGVtLnF1YW50aXR5O1xuXHRcdH0pXG5cdFx0JHNjb3BlLnRvdGFsUXR5ID0gdG90YWxRO1xuXHR9O1xuXG5cdCRzY29wZS5yZW1vdmVJdGVtID0gZnVuY3Rpb24oaXRlbSl7XG5cdFx0Ly9yZW1vdmUgaXRlbSBmcm9tIGRiLCByZW1vdmUgaXRlbSBmcm9tIGNvb2tpZSwgcmVtb3ZlIGl0ZW0gZnJvbSBzY29wZVxuXHRcdC8vaWYgYXV0aGVudGljYXRlZCwgcmVtb3ZlIGl0ZW0gZnJvbSBvcmRlclxuXHRcdHZhciBteU9yZGVyQ29va2llID0gJGNvb2tpZVN0b3JlLmdldCgnT3JkZXInKTtcblx0XHRjb25zb2xlLmxvZyhteU9yZGVyQ29va2llLCBpdGVtKTtcblx0XHR2YXIgbG9jYXRpb24gPSBnZXRMb2NJbkNvb2tpZShteU9yZGVyQ29va2llLCBpdGVtLl9pZCk7XG5cblx0XHR2YXIgcmVtb3ZlZEl0ZW0gPSBteU9yZGVyQ29va2llLnNwbGljZShsb2NhdGlvbiwgMSk7XG5cdFx0JGNvb2tpZVN0b3JlLnB1dCgnT3JkZXInLCBteU9yZGVyQ29va2llKTtcblxuXHRcdCRzY29wZS5hY3RpdmVvcmRlcnMuc3BsaWNlKGxvY2F0aW9uLDEpO1xuXHRcdHN1bSgpO1xuXHRcdHRvdGFsUXR5KCk7XG5cblx0XHRpZihBdXRoU2VydmljZS5pc0F1dGhlbnRpY2F0ZWQoKSl7XG5cdFx0XHRPcmRlckZhY3RvcnkudXBkYXRlT3JkZXIoe29yZGVySWQ6ICRzY29wZS5vcmRlcklkLCBxdWFudGl0eTogMCwgaXRlbUlkOiBJdGVtLl9pZH0pLnRoZW4oZnVuY3Rpb24oZXJyLCBkYXRhKXtcblx0XHRcdFx0aWYoZXJyKSBjb25zb2xlLmxvZyhlcnIpO1xuXG5cdFx0XHR9KTtcblx0XHRcdCRzY29wZS5hdXRoID0gdHJ1ZTtcblx0XHR9XG5cdH1cblxuXHRmdW5jdGlvbiBnZXRMb2NJbkNvb2tpZSAoY29va2llcywgaWQpe1xuXHRcdHZhciBsb2M7XG5cdFx0Y29va2llcy5mb3JFYWNoKGZ1bmN0aW9uKGVsZW1lbnQsIGluZGV4KXtcblx0XHRcdGlmKGVsZW1lbnQuaXRlbUlkID09PSBpZCl7XG5cdFx0XHRcdGNvbnNvbGUubG9nKGVsZW1lbnQuaXRlbUlkLCBcIiBpcyB0aGUgY29ycmVjdCBrZXlcIik7XG5cdFx0XHRcdGxvYyA9IGluZGV4O1xuXHRcdFx0fVxuXHRcdH0pO1xuXHRcdHJldHVybiBsb2M7XG5cdH1cblxuXHQkc2NvcGUudXBkYXRlT3JkZXIgPSBmdW5jdGlvbihpdGVtLCB2YWwpe1xuXHRcdC8vdGFrZXMgaW4gaW5mb3JtYXRpb24gYWJvdXQgdGhlIHVzZXIsIFxuXHRcdGlmKHZhbCA9PSAwKXtcblx0XHRcdCRzY29wZS5yZW1vdmVJdGVtKGl0ZW0uaXRlbSk7XG5cdFx0fVxuXHRcdGVsc2V7XG5cdFx0XHRpZigkc2NvcGUudXNlcklkKXtcblx0XHRcdFx0T3JkZXJGYWN0b3J5LnVwZGF0ZU9yZGVyKHtvcmRlcklkOiAkc2NvcGV9KTtcblx0XHRcdH1cblx0XHRcdHZhciBvcmRlckNvb2tpZSA9ICRjb29raWVTdG9yZS5nZXQoJ09yZGVyJyk7XG5cdFx0XHR2YXIgaW5kZXggPSBnZXRMb2NJbkNvb2tpZShvcmRlckNvb2tpZSwgaXRlbS5pdGVtLl9pZCk7XG5cdFx0XHRvcmRlckNvb2tpZVtpbmRleF0ucXVhbnRpdHkgPSBOdW1iZXIodmFsKTtcblx0XHRcdCRjb29raWVTdG9yZS5wdXQoJ09yZGVyJywgb3JkZXJDb29raWUpO1xuXG5cdFx0XHQkc2NvcGUuYWN0aXZlb3JkZXJzW2luZGV4XS5xdWFudGl0eSA9IE51bWJlcih2YWwpO1xuXHRcdFx0c3VtKCk7XG5cdFx0XHR0b3RhbFF0eSgpO1xuXHRcdH1cblx0XHRcblx0fTsgXG5cdCRzY29wZS5uZXdOdW1iZXIgPSBmdW5jdGlvbihpdGVtLCB2YWwpe1xuXHRcdGNvbnNvbGUubG9nKCdpdGVtJywgaXRlbSwgJ3ZhbCcsIHZhbCk7XG5cdH1cblx0Ly9nZXQgdXNlciBpbmZvcm1hdGlvbiBhbmQgc2VuZCBJZFxuXG5cdCRzY29wZS5zaG93Q29va2llID0gZnVuY3Rpb24oKXtcblx0XHRjb25zb2xlLmxvZygkY29va2llU3RvcmUuZ2V0KCdPcmRlcicpKTtcblx0XHQkc2NvcGUuYWN0aXZlb3JkZXJzID0gJGNvb2tpZVN0b3JlLmdldCgnT3JkZXInKTtcblx0fVxuXG5cdCRzY29wZS5kZWxldGVDb29raWUgPSBmdW5jdGlvbigpe1xuXHRcdCRjb29raWVTdG9yZS5yZW1vdmUoJ09yZGVyJyk7XG5cdFx0Y29uc29sZS5sb2coJGNvb2tpZVN0b3JlLmdldCgnT3JkZXInKSk7XG5cdH1cblx0JHNjb3BlLnNob3dPcmRlckZyb21EYiA9IGZ1bmN0aW9uKCl7XG5cdFx0Ly9jb25zb2xlLmxvZyhBdXRoU2VydmljZS5pc0F1dGhlbnRpY2F0ZWQoKSk7XG5cdFx0aWYoJHNjb3BlLnVzZXJJZCl7XG5cdFx0XHRPcmRlckZhY3RvcnkuZ2V0T3JkZXJzKCRzY29wZS51c2VySWQpLnRoZW4oZnVuY3Rpb24ocmVzdWx0LCBlcnIpe1xuXHRcdFx0XHRjb25zb2xlLmxvZygncmVzdWx0cycsIHJlc3VsdCwnRXJyb3InLCBlcnIpO1xuXHRcdFx0fSlcblx0XHR9XG5cdFx0ZWxzZSB7XG5cdFx0XHRjb25zb2xlLmxvZygnTm8gdXNlciBleGlzdHMnKTtcblx0XHR9XG5cdFx0XG5cdH1cblxuXHRmdW5jdGlvbiBzdW0gKCl7XG5cdFx0dmFyIHRvdGFsID0gMDtcblx0XHRjb25zb2xlLmxvZygnZ290IHRvIHN1bScpO1xuXHRcdCRzY29wZS5hY3RpdmVvcmRlcnMuZm9yRWFjaChmdW5jdGlvbihsaW5lSXRlbSl7XG5cdFx0XHRjb25zb2xlLmxvZyhsaW5lSXRlbSk7XG5cdFx0XHR0b3RhbD0gdG90YWwgKyBsaW5lSXRlbS5pdGVtLnByaWNlICogbGluZUl0ZW0ucXVhbnRpdHk7XG5cdFx0fSlcblx0XHQkc2NvcGUuc3VtID0gdG90YWw7XG5cdH07XG5cdFxufSk7IiwiJ3VzZSBzdHJpY3QnO1xuYXBwLmNvbmZpZyhmdW5jdGlvbiAoJHN0YXRlUHJvdmlkZXIpIHtcblxuICAgIFxuICAgICRzdGF0ZVByb3ZpZGVyLnN0YXRlKCdhZG1pbi5vcmRlck1vZGlmeScsIHtcbiAgICAgICAgdXJsOiAnL29yZGVyTW9kaWZ5JyxcbiAgICAgICAgdGVtcGxhdGVVcmw6ICdqcy9vcmRlck1vZGlmeS9vcmRlck1vZGlmeS5odG1sJyxcbiAgICAgICAgY29udHJvbGxlcjogJ29yZGVyTW9kaWZ5Q29udHJvbGxlcicsXG4gICAgICAgIHJlc29sdmU6IHtcbiAgICAgICAgXHRnZXRPcmRlcnM6ICBmdW5jdGlvbigkaHR0cCl7XG4gICAgICAgIFx0XHRcdC8vIHZhciBvcmRlck9iamVjdCA9IHt9XG4gICAgICAgIFx0XHRcdHJldHVybiAkaHR0cC5nZXQoJy9hcGkvYWRtaW4vb3JkZXInKVxuICAgICAgICBcdFx0XHRcdC50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKXtcbiAgICAgICAgXHRcdFx0XHRcdHJldHVybiByZXNwb25zZS5kYXRhXG4gICAgICAgIFx0XHRcdFx0XHR9KVxuICAgICAgICBcdFx0XHR9XG4gICAgICAgIFx0XHR9XG4gICBcdH0pXG59KTtcblxuYXBwLmNvbnRyb2xsZXIoJ29yZGVyTW9kaWZ5Q29udHJvbGxlcicsIFxuXHRmdW5jdGlvbiAoJHNjb3BlLCBvcmRlck1vZGlmeUZhY3RvcnksICRzdGF0ZSwgJHN0YXRlUGFyYW1zLCAkcm9vdFNjb3BlLCBnZXRPcmRlcnMpIHtcblxuXHQkc2NvcGUuaXRlbSA9IHtcblx0XHRjYXRlZ29yaWVzOiBbXSB9O1xuXHQkc2NvcGUuc3VjY2VzcztcblxuXHQkc2NvcGUuYWxsT3JkZXJzID0gZ2V0T3JkZXJzXG5cblx0JHNjb3BlLm9yZGVycztcblxuXHQkc2NvcGUubWVudUl0ZW1zID0gW1xuXHRcdHsgbGFiZWw6ICdhbGwgb3JkZXJzJ30sXG4gICAgICAgIHsgbGFiZWw6ICdvcGVuJ30sXG4gICAgICAgIHsgbGFiZWw6ICdwbGFjZWQnfSxcbiAgICAgICAgeyBsYWJlbDogJ3NoaXBwZWQnfSxcbiAgICAgICAgeyBsYWJlbDogJ2NvbXBsZXRlJ31cbiAgICBdO1xuXG4gICAgJHNjb3BlLmNoYW5nZVN0YXR1c01lbnVJdGVtcyA9IFtcbiAgICAgICAgeyBsYWJlbDogJ29wZW4nfSxcbiAgICAgICAgeyBsYWJlbDogJ3BsYWNlZCd9LFxuICAgICAgICB7IGxhYmVsOiAnc2hpcHBlZCd9LFxuICAgICAgICB7IGxhYmVsOiAnY29tcGxldGUnfVxuICAgIF07XG5cblx0JHNjb3BlLmZpbHRlck9yZGVycyA9IGZ1bmN0aW9uKHN0YXR1cykge1xuXHRcdCRzY29wZS5vcmRlcnMgPSBvcmRlck1vZGlmeUZhY3RvcnkuZmlsdGVyT3JkZXJzKHN0YXR1cywgJHNjb3BlLmFsbE9yZGVycylcblxuXHRcdCRzY29wZS5maWx0ZXJlZCA9IGZhbHNlO1xuXHR9XG5cbiAgICAkc2NvcGUuY2hhbmdlU3RhdHVzID0gZnVuY3Rpb24gKG9yZGVySWQsIHN0YXR1cywgaW5kZXgpIHtcbiAgICAgICAgdmFyIGRhdGEgPSBbb3JkZXJJZCwgc3RhdHVzXVxuICAgICAgICAkc2NvcGUub3JkZXJzW2luZGV4XS5zdGF0dXMgPSBzdGF0dXNcbiAgICAgICAgb3JkZXJNb2RpZnlGYWN0b3J5Lm1vZGlmeU9yZGVyKGRhdGEpXG4gICAgfVxufSk7IiwiJ3VzZSBzdHJpY3QnO1xuYXBwLmNvbmZpZyhmdW5jdGlvbiAoJHN0YXRlUHJvdmlkZXIpIHtcblxuICAgICRzdGF0ZVByb3ZpZGVyLnN0YXRlKCdhZG1pbi5wcm9kdWN0Q2F0Q3JlYXRlJywge1xuICAgICAgICB1cmw6ICcvcHJvZHVjdENhdENyZWF0ZScsXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnanMvcHJvZHVjdENhdENyZWF0ZS9wcm9kdWN0Q2F0Q3JlYXRlLmh0bWwnXG4gICAgfSk7XG5cbn0pOyIsImFwcC5jb25maWcoZnVuY3Rpb24gKCRzdGF0ZVByb3ZpZGVyKSB7XG5cbiAgICAvLyBSZWdpc3RlciBvdXIgKlJldmlldyBFbnRyeSogc3RhdGUuXG4gICAgJHN0YXRlUHJvdmlkZXIuc3RhdGUoJ3Jldmlldy1lbnRyeScsIHtcbiAgICAgICAgdXJsOiAnOm5hbWUvOnVybC9yZXZpZXctZW50cnknLFxuICAgICAgICBjb250cm9sbGVyOiBmdW5jdGlvbigkc2NvcGUsIENyZWF0ZVJldmlldywgJHN0YXRlLCAkc3RhdGVQYXJhbXMpIHtcbiAgICAgICAgICAgICRzY29wZS5wcm9kdWN0bmFtZSA9ICRzdGF0ZVBhcmFtcy5uYW1lO1xuICAgICAgICAgICAgJHNjb3BlLnByb2R1Y3R1cmwgPSAkc3RhdGVQYXJhbXMudXJsO1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJpbiBjb25yb2xsZXJcIiwgJHNjb3BlKTtcblxuICAgICAgICAgICAgJHNjb3BlLm5ld1JldmlldyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIFx0Y29uc29sZS5sb2coXCJpbnNpZGUgbmV3UmV2aWV3XCIsICRzY29wZS5wcm9kdWN0bmFtZSk7XG4gICAgICAgICAgICBcdHZhciBpbmZvID0gJHNjb3BlLnByb2R1Y3RuYW1lO1xuICAgICAgICAgICAgXHRDcmVhdGVSZXZpZXcuc3VibWl0UmV2aWV3KGluZm8pLnRoZW4oZnVuY3Rpb24odXNlciwgZXJyKXtcblx0ICAgIFx0XHRcdFx0XHRpZiAoZXJyKSAkc2NvcGUuc3VjY2VzcyA9IGZhbHNlO1xuXHQgICAgXHRcdFx0XHRcdFx0ZWxzZXtcbiAgICAgICAgICAgICAgICAgICAgJHN0YXRlLmdvKCdwcm9kdWN0cycpO1xuICAgICAgICAgICAgICBcdH1cblx0ICAgIFx0XHRcdFx0fSlcblx0ICAgXHRcdFx0XHR9O1xuICAgICAgICAgfSxcbiAgICAgICAgdGVtcGxhdGVVcmw6ICdqcy9yZXZpZXctZW50cnkvcmV2aWV3LWVudHJ5Lmh0bWwnXG4gICAgfSlcblxufSk7XG5cblxuIiwiYXBwXG5cbiAgICAuY29uc3RhbnQoJ3JhdGluZ0NvbmZpZycsIHtcbiAgICAgICAgbWF4OiA1LFxuICAgIH0pXG5cbiAgICAuZGlyZWN0aXZlKCdyYXRpbmcnLCBbJ3JhdGluZ0NvbmZpZycsIGZ1bmN0aW9uKHJhdGluZ0NvbmZpZykge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgcmVzdHJpY3Q6ICdFQScsXG4gICAgICAgICAgICByZXBsYWNlOiB0cnVlLFxuICAgICAgICAgICAgc2NvcGU6IHtcbiAgICAgICAgICAgICAgICB2YWx1ZTogJz0nLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHRlbXBsYXRlOiAnPHNwYW4gbmctbW91c2VsZWF2ZT1cInJlc2V0KClcIj48aSBuZy1yZXBlYXQ9XCJudW1iZXIgaW4gcmFuZ2VcIiBuZy1tb3VzZWVudGVyPVwiZW50ZXIobnVtYmVyKVwiIG5nLWNsaWNrPVwiYXNzaWduKG51bWJlcilcIiBuZy1jbGFzcz1cIntcXCdnbHlwaGljb24gZ2x5cGhpY29uLXN0YXIgaWNvbi1nb2xkXFwnOiBudW1iZXIgPD0gdmFsLCBcXCdnbHlwaGljb24gZ2x5cGhpY29uLXN0YXIgaWNvbi1ncmF5XFwnOiBudW1iZXIgPiB2YWx9XCI+PC9pPjwvc3Bhbj4nLFxuICAgICAgICAgICAgbGluazogZnVuY3Rpb24oc2NvcGUsIGVsZW1lbnQsIGF0dHJzKSB7XG4gICAgICAgICAgICAgICAgdmFyIG1heFJhbmdlID0gYW5ndWxhci5pc0RlZmluZWQoYXR0cnMubWF4KSA/IHNjb3BlLiRldmFsKGF0dHJzLm1heCkgOiByYXRpbmdDb25maWcubWF4O1xuXG4gICAgICAgICAgICAgICAgc2NvcGUucmFuZ2UgPSBbXTtcbiAgICAgICAgICAgICAgICBmb3IodmFyIGkgPSAxOyBpIDw9IG1heFJhbmdlOyBpKysgKSB7XG4gICAgICAgICAgICAgICAgICAgIHNjb3BlLnJhbmdlLnB1c2goaSk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgc2NvcGUuJHdhdGNoKCd2YWx1ZScsIGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgIHNjb3BlLnZhbCA9IHZhbHVlO1xuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgc2NvcGUuYXNzaWduID0gZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgc2NvcGUudmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBzY29wZS5lbnRlciA9IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgIHNjb3BlLnZhbCA9IHZhbHVlO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHNjb3BlLnJlc2V0ID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgIHNjb3BlLnZhbCA9IGFuZ3VsYXIuY29weShzY29wZS52YWx1ZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHNjb3BlLnJlc2V0KCk7XG5cbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICB9XSk7XG5cbmFwcC5jb250cm9sbGVyKCdTdGFyQ3RybCcsIGZ1bmN0aW9uKCRzY29wZSkge1xuXG4gICAgJHNjb3BlLnJhdGUxID0gMDtcblxuICAgICRzY29wZS5yYXRlMiA9IDY7XG5cbn0pOyIsIid1c2Ugc3RyaWN0JztcbmFwcC5jb25maWcoZnVuY3Rpb24gKCRzdGF0ZVByb3ZpZGVyKSB7XG5cbiAgICAvLyBSZWdpc3RlciBvdXIgKmFib3V0KiBzdGF0ZS5cbiAgICAkc3RhdGVQcm92aWRlci5zdGF0ZSgnc3RyaXBlJywge1xuICAgICAgICB1cmw6ICcvc3RyaXBlJyxcbiAgICAgICAgY29udHJvbGxlcjogJ1N0cmlwZUNvbnRyb2xsZXInLFxuICAgICAgICB0ZW1wbGF0ZVVybDogJ2pzL3Rlc3RTdHJpcGUvc3RyaXBlLmh0bWwnXG4gICAgfSk7XG5cbn0pO1xuXG5hcHAuY29udHJvbGxlcignU3RyaXBlQ29udHJvbGxlcicsIGZ1bmN0aW9uICgkc2NvcGUpIHtcblxufSk7IiwiJ3VzZSBzdHJpY3QnO1xuYXBwLmNvbmZpZyhmdW5jdGlvbiAoJHN0YXRlUHJvdmlkZXIpIHtcblxuICAgICRzdGF0ZVByb3ZpZGVyLnN0YXRlKCd0dXRvcmlhbCcsIHtcbiAgICAgICAgdXJsOiAnL3R1dG9yaWFsJyxcbiAgICAgICAgdGVtcGxhdGVVcmw6ICdqcy90dXRvcmlhbC90dXRvcmlhbC5odG1sJyxcbiAgICAgICAgY29udHJvbGxlcjogJ1R1dG9yaWFsQ3RybCcsXG4gICAgICAgIHJlc29sdmU6IHtcbiAgICAgICAgICAgIHR1dG9yaWFsSW5mbzogZnVuY3Rpb24gKFR1dG9yaWFsRmFjdG9yeSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBUdXRvcmlhbEZhY3RvcnkuZ2V0VHV0b3JpYWxWaWRlb3MoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0pO1xuXG59KTtcblxuYXBwLmZhY3RvcnkoJ1R1dG9yaWFsRmFjdG9yeScsIGZ1bmN0aW9uICgkaHR0cCkge1xuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgZ2V0VHV0b3JpYWxWaWRlb3M6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiAkaHR0cC5nZXQoJy9hcGkvdHV0b3JpYWwvdmlkZW9zJykudGhlbihmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzcG9uc2UuZGF0YTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfTtcblxufSk7XG5cbmFwcC5jb250cm9sbGVyKCdUdXRvcmlhbEN0cmwnLCBmdW5jdGlvbiAoJHNjb3BlLCB0dXRvcmlhbEluZm8pIHtcblxuICAgICRzY29wZS5zZWN0aW9ucyA9IHR1dG9yaWFsSW5mby5zZWN0aW9ucztcbiAgICAkc2NvcGUudmlkZW9zID0gXy5ncm91cEJ5KHR1dG9yaWFsSW5mby52aWRlb3MsICdzZWN0aW9uJyk7XG5cbiAgICAkc2NvcGUuY3VycmVudFNlY3Rpb24gPSB7IHNlY3Rpb246IG51bGwgfTtcblxuICAgICRzY29wZS5jb2xvcnMgPSBbXG4gICAgICAgICdyZ2JhKDM0LCAxMDcsIDI1NSwgMC4xMCknLFxuICAgICAgICAncmdiYSgyMzgsIDI1NSwgNjgsIDAuMTEpJyxcbiAgICAgICAgJ3JnYmEoMjM0LCA1MSwgMjU1LCAwLjExKScsXG4gICAgICAgICdyZ2JhKDI1NSwgMTkzLCA3MywgMC4xMSknLFxuICAgICAgICAncmdiYSgyMiwgMjU1LCAxLCAwLjExKSdcbiAgICBdO1xuXG4gICAgJHNjb3BlLmdldFZpZGVvc0J5U2VjdGlvbiA9IGZ1bmN0aW9uIChzZWN0aW9uLCB2aWRlb3MpIHtcbiAgICAgICAgcmV0dXJuIHZpZGVvcy5maWx0ZXIoZnVuY3Rpb24gKHZpZGVvKSB7XG4gICAgICAgICAgICByZXR1cm4gdmlkZW8uc2VjdGlvbiA9PT0gc2VjdGlvbjtcbiAgICAgICAgfSk7XG4gICAgfTtcblxufSk7IiwiJ3VzZSBzdHJpY3QnO1xuYXBwLmNvbmZpZyhmdW5jdGlvbiAoJHN0YXRlUHJvdmlkZXIpIHtcblx0JHN0YXRlUHJvdmlkZXIuc3RhdGUoJ2FkbWluLnVzZXJNb2RpZnknLCB7XG4gICAgICAgIHVybDogJy91c2VyTW9kaWZ5JyxcbiAgICAgICAgY29udHJvbGxlcjogJ3VzZXJNb2RpZnlDb250cm9sbGVyJyxcbiAgICAgICAgdGVtcGxhdGVVcmw6ICdqcy91c2VyTW9kaWZ5L3VzZXJNb2RpZnkuaHRtbCdcbiAgICB9KTtcbn0pXG5cbmFwcC5jb250cm9sbGVyKCd1c2VyTW9kaWZ5Q29udHJvbGxlcicsIGZ1bmN0aW9uICgkc2NvcGUsIHVzZXJNb2RpZnlGYWN0b3J5LCAkc3RhdGUsICRzdGF0ZVBhcmFtcywgQXV0aFNlcnZpY2UpIHtcblxuICAgIFxuICAgICRzY29wZS5zdWJtaXQgPSB7XG4gICAgICAgIHBhc3N3b3JkOiAnJyxcbiAgICAgICAgZW1haWw6ICcnLFxuICAgICAgICBtYWtlQWRtaW46IGZhbHNlXG4gICAgfVxuICAgICRzY29wZS5zdWNjZXNzO1xuXG5cbiAgICAkc2NvcGUuY2hhbmdlUFcgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgdXNlck1vZGlmeUZhY3RvcnkucG9zdFBXKCRzY29wZS5zdWJtaXQpLnRoZW4oZnVuY3Rpb24odXNlciwgZXJyKXtcbiAgICAgICAgICAgICRzY29wZS5zdWJtaXQgPSB7fVxuICAgICAgICAgICAgaWYoZXJyKSB7XG4gICAgICAgICAgICAgICAgJHNjb3BlLnN1Y2Nlc3M9IGZhbHNlO1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdjaGFuZ2luZyBzdGF0ZScpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNle1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCRzY29wZS5zdWJtaXQpO1xuICAgICAgICAgICAgICAgICRzY29wZS5zdWNjZXNzID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfSAgXG59KTsiLCIndXNlIHN0cmljdCc7XG5hcHAuZmFjdG9yeSgnQ3JlYXRlSXRlbUZhY3RvcnknLCBmdW5jdGlvbigkaHR0cCl7XG5cdFxuXHRyZXR1cm4ge1xuXHRcdHBvc3RJdGVtOiBmdW5jdGlvbihkYXRhKXtcblx0XHRcdGNvbnNvbGUubG9nKCdpbnRvIHRoZSBmYWN0b3J5JywgZGF0YSk7XG5cdFx0XHQvLyByZXR1cm4gJGh0dHAucG9zdCgnL2FwaS9pdGVtJywgZGF0YSk7XG5cblx0XHRcdHJldHVybiAkaHR0cC5wb3N0KCcvYXBpL2FkbWluL2l0ZW1DcmVhdGUnLCBkYXRhKS50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKXtcblx0XHRcdFx0cmV0dXJuIHJlc3BvbnNlLmRhdGE7XG5cdFx0XHR9KVxuXHRcdH1cblx0fVxuXG59KSIsIid1c2Ugc3RyaWN0JztcbmFwcC5mYWN0b3J5KCdDcmVhdGVSZXZpZXcnLCBmdW5jdGlvbigkaHR0cCl7XG5cdFxuXHRyZXR1cm4ge1xuXHRcdHN1Ym1pdFJldmlldzogZnVuY3Rpb24oZGF0YSl7XG5cdFx0XHRjb25zb2xlLmxvZygnaW50byByZXZpZXcgZmFjdG9yeScsIGRhdGEpO1xuXHRcdFx0cmV0dXJuICRodHRwLnBvc3QoJy9hcGkvcmV2aWV3cy8nKyBkYXRhKS50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKXtcblx0XHRcdFx0cmV0dXJuIHJlc3BvbnNlLmRhdGE7XG5cdFx0XHR9KVxuXHRcdH1cblx0fVxufSkiLCIndXNlIHN0cmljdCc7XG5hcHAuZmFjdG9yeSgnQ3JlYXRlVXNlckZhY3RvcnknLCBmdW5jdGlvbigkaHR0cCl7XG5cdFxuXHRyZXR1cm4ge1xuXHRcdHBvc3RVc2VyOiBmdW5jdGlvbihkYXRhKXtcblx0XHRcdGNvbnNvbGUubG9nKCdpbnRvIHVzZXIgZmFjdG9yeScsIGRhdGEpO1xuXHRcdFx0cmV0dXJuICRodHRwLnBvc3QoJ2FwaS9qb2luJywgZGF0YSkudGhlbihmdW5jdGlvbihyZXNwb25zZSl7XG5cdFx0XHRcdHJldHVybiByZXNwb25zZS5kYXRhO1xuXHRcdFx0fSlcblx0XHR9XG5cdH1cbn0pXG5cbi8vICcvYXBpL2xvZ2luJyIsIid1c2Ugc3RyaWN0JztcbmFwcC5mYWN0b3J5KCdHZXRJdGVtRmFjdG9yeScsIGZ1bmN0aW9uKCRodHRwKXtcblx0XG5cdHJldHVybiB7XG5cdFx0Z2V0SXRlbTogZnVuY3Rpb24oaWQpe1xuXHRcdFx0Ly92YXIgb3B0aW9ucyA9IHtlbWFpbDogZW1haWx9O1xuXHRcdFx0Y29uc29sZS5sb2coaWQpO1xuXHRcdFx0cmV0dXJuICRodHRwLmdldCgnL2FwaS9pdGVtLycraWQpLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2Upe1xuXHRcdFx0XHRyZXR1cm4gcmVzcG9uc2UuZGF0YTtcblx0XHRcdH0pXG5cdFx0fSxcblxuXHRcdC8vIGdldENhdGVnb3J5SXRlbXM6IGZ1bmN0aW9uICgpIHtcblx0XHQvLyBcdGNvbnNvbGUubG9nKFwiR2V0SXRlbUZhY3Rvcnk6IGdldENhdGVnb3J5SXRlbXNcIiwgY2F0ZWdvcnkpO1xuXHRcdC8vIFx0cmV0dXJuICRodHRwLmdldCgnL2FwaS9pdGVtLycrIGNhdGVnb3J5KS50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKXtcblx0XHQvLyBcdFx0cmV0dXJuIHJlc3BvbnNlLmRhdGE7XG5cdFx0Ly8gXHR9KTtcblx0XHQvLyB9LFxuXG5cdH1cbn0pIiwiJ3VzZSBzdHJpY3QnO1xuYXBwLmZhY3RvcnkoJ0dldEl0ZW1zRmFjdG9yeScsIGZ1bmN0aW9uKCRodHRwKXtcblxuICAgIHJldHVybiB7XG4gICAgICAgIGdldEl0ZW1zOiBmdW5jdGlvbigpe1xuICAgICAgICAgICAgcmV0dXJuICRodHRwLmdldCgnL2FwaS9pdGVtbGlzdCcpLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2Upe1xuICAgICAgICAgICAgICAgIHJldHVybiByZXNwb25zZS5kYXRhO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgfVxuXG4gICAgfVxufSkiLCIndXNlIHN0cmljdCc7XG5hcHAuZmFjdG9yeSgnR2V0VXNlckZhY3RvcnknLCBmdW5jdGlvbigkaHR0cCl7XG5cdFxuXHRyZXR1cm4ge1xuXHRcdGdldFVzZXI6IGZ1bmN0aW9uKHVzZXIpe1xuXHRcdFx0Y29uc29sZS5sb2coJ2luc2lkZSBmYWN0b3Igd2l0aDogJywgZW1haWwpO1xuXHRcdFx0Ly92YXIgb3B0aW9ucyA9IHtlbWFpbDogZW1haWx9O1xuXHRcdFx0cmV0dXJuICRodHRwLmdldCgnL2FwaS9sb2dpbi8nICsgdXNlci5lbWFpbCkudGhlbihmdW5jdGlvbihyZXNwb25zZSl7XG5cdFx0XHRcdHJldHVybiByZXNwb25zZS5kYXRhO1xuXHRcdFx0fSlcblx0XHR9LFxuXHRcdGF1dGhVc2VyOiBmdW5jdGlvbihkYXRhKXtcblx0XHRcdHJldHVybiAkaHR0cC5wb3N0KCcvbG9naW4nLCBkYXRhKS50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKXtcblx0XHRcdFx0Y29uc29sZS5sb2coXCJmYWN0b3J5IGRvbmVcIilcblx0XHRcdFx0cmV0dXJuIHJlc3BvbnNlLmRhdGE7XG5cdFx0XHR9KVxuXHRcdH1cblx0fVxufSlcblxuLy8gJy9hcGkvbG9naW4vJyArIGVtYWlsIiwiJ3VzZSBzdHJpY3QnO1xuYXBwLmZhY3RvcnkoJ09yZGVyRmFjdG9yeScsIGZ1bmN0aW9uKCRodHRwKXtcblx0XG5cdHJldHVybiB7XG5cdFx0Y3JlYXRlT3JkZXI6IGZ1bmN0aW9uKGRhdGEpey8vIGRhdGEgc2hvdWxkIGJlIGluIGZvcm0ge3VzZXJJZDogdXNlci5faWQsIGl0ZW1zOiBbaXRlbTogaXRlbS5faWQsIHF0eTogcXR5XX1cblx0XHRcdGNvbnNvbGUubG9nKCdzZW5kaW5nIGEgcmVxdWVzdCBmb3IgYSBuZXcgb3JkZXIgZnJvbSBmYWN0b3J5Jyk7XG5cdFx0XHRyZXR1cm4gJGh0dHAucG9zdCgnL2FwaS9vcmRlcicsIGRhdGEpLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2Upe1xuXHRcdFx0Ly9jb25zb2xlLmxvZygncmVzcG9uc2UgZnJvbSBjcmVhdGVPcmRlciBmYWN0b3J5IHJlcXVlc3QnLCByZXNwb25zZSk7XG5cdFx0XHRcdHJldHVybiByZXNwb25zZS5kYXRhO1xuXHRcdFx0fSlcblx0XHR9LFxuXHRcdHVwZGF0ZU9yZGVyOiBmdW5jdGlvbihkYXRhKXsgLy9leHBlY3RzIG9yZGVySWQsIGl0ZW1JZCwgYW5kIHF1YW50aXR5IChjYXNlIHNlbnNhdGl2ZSlcblx0XHRcdHJldHVybiAkaHR0cC5wb3N0KCcvYXBpL29yZGVyL2xpbmVpdGVtJywgZGF0YSkudGhlbihmdW5jdGlvbihyZXNwb25zZSl7XG5cdFx0XHRcdHJldHVybiByZXNwb25zZS5kYXRhO1xuXHRcdFx0fSlcblx0XHR9LFxuXHRcdGdldE9yZGVyczogZnVuY3Rpb24odXNlcklkKXtcblx0XHRcdHJldHVybiAkaHR0cC5nZXQoJy9hcGkvb3JkZXIvJyt1c2VySWQpLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2Upe1xuXHRcdFx0XHQvL2NvbnNvbGUubG9nKCdyZXNwb25zZSBmcm9tIGdldE9yZGVycyBmYWN0b3J5IHJlcXVlc3QnLCByZXNwb25zZSk7XG5cdFx0XHRcdHJldHVybiByZXNwb25zZS5kYXRhO1xuXHRcdFx0fSk7XG5cdFx0fVxuXG59fSk7IiwiJ3VzZSBzdHJpY3QnO1xuYXBwLmZhY3RvcnkoJ1JhbmRvbUdyZWV0aW5ncycsIGZ1bmN0aW9uICgpIHtcblxuICAgIHZhciBnZXRSYW5kb21Gcm9tQXJyYXkgPSBmdW5jdGlvbiAoYXJyKSB7XG4gICAgICAgIHJldHVybiBhcnJbTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogYXJyLmxlbmd0aCldO1xuICAgIH07XG5cbiAgICB2YXIgZ3JlZXRpbmdzID0gW1xuICAgICAgICAnSGVsbG8sIHdvcmxkIScsXG4gICAgICAgICdBdCBsb25nIGxhc3QsIEkgbGl2ZSEnLFxuICAgICAgICAnSGVsbG8sIHNpbXBsZSBodW1hbi4nLFxuICAgICAgICAnV2hhdCBhIGJlYXV0aWZ1bCBkYXkhJyxcbiAgICAgICAgJ0lcXCdtIGxpa2UgYW55IG90aGVyIHByb2plY3QsIGV4Y2VwdCB0aGF0IEkgYW0geW91cnMuIDopJyxcbiAgICAgICAgJ1RoaXMgZW1wdHkgc3RyaW5nIGlzIGZvciBMaW5kc2F5IExldmluZS4nXG4gICAgXTtcblxuICAgIHJldHVybiB7XG4gICAgICAgIGdyZWV0aW5nczogZ3JlZXRpbmdzLFxuICAgICAgICBnZXRSYW5kb21HcmVldGluZzogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIGdldFJhbmRvbUZyb21BcnJheShncmVldGluZ3MpO1xuICAgICAgICB9XG4gICAgfTtcblxufSk7IiwiJ3VzZSBzdHJpY3QnO1xuIiwiYXBwLmZhY3RvcnkoJ2FkbWluTmF2YmFyRmFjdG9yeScsIGZ1bmN0aW9uIChuYXZiYXJNZW51KSB7XG5cdFx0dmFyIG5hdmJhck1lbnVJdGVtcyA9IFtcbiAgICAgICAgeyBsYWJlbDogJ0hvbWUnLCBzdGF0ZTogJ2hvbWUnIH0sXG4gICAgICAgIHsgbGFiZWw6ICdDcmVhdGUgSXRlbScsIHN0YXRlOiAnaXRlbUNyZWF0ZScgfSxcbiAgICAgICAgeyBsYWJlbDogJ01vZGlmeSBVc2VyJywgc3RhdGU6ICd1c2VyTW9kaWZ5JyB9XG4gICAgXTtcblxuXHRyZXR1cm4ge1xuXG5cdH1cbn0pIiwiJ3VzZSBzdHJpY3QnXG5hcHAuZmFjdG9yeSgnYWRtaW5Qb3N0VXNlcicsIGZ1bmN0aW9uICgkaHR0cCkge1xuXG5cdHJldHVybiB7XG5cdFx0cG9zdEluZm86IGZ1bmN0aW9uIChpbnB1dHMpIHtcblx0XHRcdHJldHVybiAkaHR0cC5wb3N0KCdhZG1pbicsIGlucHV0cylcblx0XHR9XG5cdH1cbn0pICIsIid1c2Ugc3RyaWN0JztcbmFwcC5mYWN0b3J5KCdvcmRlck1vZGlmeUZhY3RvcnknLCBmdW5jdGlvbiAoJGh0dHApe1xuXHRcblx0cmV0dXJuIHtcblx0XHRmaWx0ZXJPcmRlcnM6IGZ1bmN0aW9uIChzdGF0dXMsIGFsbE9yZGVycykge1xuXHRcdFx0aWYgKHN0YXR1cyA9PT0gJ2FsbCBvcmRlcnMnKSB7XG5cdFx0XHRcdHJldHVybiBhbGxPcmRlcnNcblx0XHRcdH1cblx0XHRcdHZhciBmaWx0ZXJlZEFycmF5ID0gW107XG5cdFx0XHRmb3IgKHZhciBhPTAsIGxlbj1hbGxPcmRlcnMubGVuZ3RoOyBhPGxlbjsgYSsrKSB7XG5cdFx0XHRcdGlmIChhbGxPcmRlcnNbYV0uc3RhdHVzID09PSBzdGF0dXMpIHtcblx0XHRcdFx0XHRmaWx0ZXJlZEFycmF5LnB1c2goYWxsT3JkZXJzW2FdKVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gZmlsdGVyZWRBcnJheVxuXHRcdH0sXG5cdFx0bW9kaWZ5T3JkZXI6IGZ1bmN0aW9uKGRhdGEpe1xuXHRcdFx0cmV0dXJuICRodHRwLnB1dCgnL2FwaS9hZG1pbi9vcmRlcicsIGRhdGEpLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2Upe1xuXHRcdFx0XHRyZXR1cm4gcmVzcG9uc2UuZGF0YTtcblx0XHRcdH0pXG5cdFx0fSxcblx0XHRnZXRBbGxPcmRlcnM6IGZ1bmN0aW9uKCl7XG5cdFx0XHRjb25zb2xlLmxvZygnaW50byB0aGUgZmFjdG9yeScpO1xuXHRcdFx0Ly8gcmV0dXJuICRodHRwLnBvc3QoJy9hcGkvaXRlbScsIGRhdGEpO1xuXG5cdFx0XHRyZXR1cm4gJGh0dHAuZ2V0KCcvYXBpL2FkbWluL29yZGVyJykudGhlbihmdW5jdGlvbihyZXNwb25zZSl7XG5cdFx0XHRcdHJldHVybiByZXNwb25zZS5kYXRhO1xuXHRcdFx0fSlcblx0XHR9LFxuXHRcdGNoYW5nZU9yZGVyU3RhdHVzOiBmdW5jdGlvbiAoICkge1xuXHRcdFx0cmV0dXJuICRodHRwLnB1dCgnL2FwaS9hZG1pbi9vcmRlcicpLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2Upe1xuXHRcdFx0XHRyZXR1cm4gcmVzcG9uc2UuZGF0YTtcblx0XHRcdH0pXHRcblx0XHR9XG5cdFx0Ly8gZ2V0VXNlck9yZGVyc0J5RW1haWw6IGZ1bmN0aW9uICgpIHtcblx0XHQvLyBcdHJldHVybiAkaHR0cC5wb3N0KCcvYXBpL2FkbWluL29yZGVyJykudGhlbihmdW5jdGlvbihyZXNwb25zZSl7XG5cdFx0Ly8gXHRcdHJldHVybiByZXNwb25zZS5kYXRhO1xuXHRcdC8vIFx0fSlcblx0XHQvLyB9XG5cdH1cblxufSkiLCIndXNlIHN0cmljdCc7XG5hcHAuZmFjdG9yeSgndXNlck1vZGlmeUZhY3RvcnknLCBmdW5jdGlvbigkaHR0cCl7XG5cdFxuXHRyZXR1cm4ge1xuXHRcdHBvc3RQVzogZnVuY3Rpb24oZGF0YSl7XG5cdFx0XHRjb25zb2xlLmxvZygnaW50byB0aGUgZmFjdG9yeScsIGRhdGEpO1xuXHRcdFx0Ly8gcmV0dXJuICRodHRwLnBvc3QoJy9hcGkvaXRlbScsIGRhdGEpO1xuXG5cdFx0XHRyZXR1cm4gJGh0dHAucG9zdCgnL2FwaS9hZG1pbi91c2VyTW9kaWZ5JywgZGF0YSkudGhlbihmdW5jdGlvbihyZXNwb25zZSl7XG5cdFx0XHRcdHJldHVybiByZXNwb25zZS5kYXRhO1xuXHRcdFx0fSlcblx0XHR9XG5cdH1cblxufSkiLCIndXNlIHN0cmljdCc7XG5cbmFwcC5kaXJlY3RpdmUoJ3R1dG9yaWFsU2VjdGlvbicsIGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgICByZXN0cmljdDogJ0UnLFxuICAgICAgICBzY29wZToge1xuICAgICAgICAgICAgbmFtZTogJ0AnLFxuICAgICAgICAgICAgdmlkZW9zOiAnPScsXG4gICAgICAgICAgICBiYWNrZ3JvdW5kOiAnQCdcbiAgICAgICAgfSxcbiAgICAgICAgdGVtcGxhdGVVcmw6ICdqcy90dXRvcmlhbC90dXRvcmlhbC1zZWN0aW9uL3R1dG9yaWFsLXNlY3Rpb24uaHRtbCcsXG4gICAgICAgIGxpbms6IGZ1bmN0aW9uIChzY29wZSwgZWxlbWVudCkge1xuICAgICAgICAgICAgZWxlbWVudC5jc3MoeyBiYWNrZ3JvdW5kOiBzY29wZS5iYWNrZ3JvdW5kIH0pO1xuICAgICAgICB9XG4gICAgfTtcbn0pOyIsIid1c2Ugc3RyaWN0JztcbmFwcC5kaXJlY3RpdmUoJ3R1dG9yaWFsU2VjdGlvbk1lbnUnLCBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgcmVzdHJpY3Q6ICdFJyxcbiAgICAgICAgcmVxdWlyZTogJ25nTW9kZWwnLFxuICAgICAgICB0ZW1wbGF0ZVVybDogJ2pzL3R1dG9yaWFsL3R1dG9yaWFsLXNlY3Rpb24tbWVudS90dXRvcmlhbC1zZWN0aW9uLW1lbnUuaHRtbCcsXG4gICAgICAgIHNjb3BlOiB7XG4gICAgICAgICAgICBzZWN0aW9uczogJz0nXG4gICAgICAgIH0sXG4gICAgICAgIGxpbms6IGZ1bmN0aW9uIChzY29wZSwgZWxlbWVudCwgYXR0cnMsIG5nTW9kZWxDdHJsKSB7XG5cbiAgICAgICAgICAgIHNjb3BlLmN1cnJlbnRTZWN0aW9uID0gc2NvcGUuc2VjdGlvbnNbMF07XG4gICAgICAgICAgICBuZ01vZGVsQ3RybC4kc2V0Vmlld1ZhbHVlKHNjb3BlLmN1cnJlbnRTZWN0aW9uKTtcblxuICAgICAgICAgICAgc2NvcGUuc2V0U2VjdGlvbiA9IGZ1bmN0aW9uIChzZWN0aW9uKSB7XG4gICAgICAgICAgICAgICAgc2NvcGUuY3VycmVudFNlY3Rpb24gPSBzZWN0aW9uO1xuICAgICAgICAgICAgICAgIG5nTW9kZWxDdHJsLiRzZXRWaWV3VmFsdWUoc2VjdGlvbik7XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgIH1cbiAgICB9O1xufSk7IiwiJ3VzZSBzdHJpY3QnO1xuYXBwLmRpcmVjdGl2ZSgndHV0b3JpYWxWaWRlbycsIGZ1bmN0aW9uICgkc2NlKSB7XG5cbiAgICB2YXIgZm9ybVlvdXR1YmVVUkwgPSBmdW5jdGlvbiAoaWQpIHtcbiAgICAgICAgcmV0dXJuICdodHRwczovL3d3dy55b3V0dWJlLmNvbS9lbWJlZC8nICsgaWQ7XG4gICAgfTtcblxuICAgIHJldHVybiB7XG4gICAgICAgIHJlc3RyaWN0OiAnRScsXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnanMvdHV0b3JpYWwvdHV0b3JpYWwtdmlkZW8vdHV0b3JpYWwtdmlkZW8uaHRtbCcsXG4gICAgICAgIHNjb3BlOiB7XG4gICAgICAgICAgICB2aWRlbzogJz0nXG4gICAgICAgIH0sXG4gICAgICAgIGxpbms6IGZ1bmN0aW9uIChzY29wZSkge1xuICAgICAgICAgICAgc2NvcGUudHJ1c3RlZFlvdXR1YmVVUkwgPSAkc2NlLnRydXN0QXNSZXNvdXJjZVVybChmb3JtWW91dHViZVVSTChzY29wZS52aWRlby55b3V0dWJlSUQpKTtcbiAgICAgICAgfVxuICAgIH07XG5cbn0pOyIsIid1c2Ugc3RyaWN0JztcbmFwcC5kaXJlY3RpdmUoJ25hdkRyb3Bkb3duJywgZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB7XG4gICAgICAgIHJlc3RyaWN0OiAnRScsXG4gICAgICAgIC8vc2NvcGU6IHtcbiAgICAgICAgLy8gICAgaXRlbXM6ICc9J1xuICAgICAgICAvL30sXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnanMvY29tbW9uL2RpcmVjdGl2ZXMvbmF2YmFyL25hdi1kcm9wZG93bi5odG1sJ1xuICAgICAgICAvL2NvbnRyb2xsZXI6ICdkcm9wZG93bkNvbnRyb2xsZXInXG4gICAgfTtcbn0pO1xuXG5hcHAuZGlyZWN0aXZlKCduYXZEcm9wZG93bldvbWVuJywgZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB7XG4gICAgICAgIHJlc3RyaWN0OiAnRScsXG4gICAgICAgIC8vc2NvcGU6IHtcbiAgICAgICAgLy8gICAgaXRlbXM6ICc9J1xuICAgICAgICAvL30sXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnanMvY29tbW9uL2RpcmVjdGl2ZXMvbmF2YmFyL25hdi1kcm9wZG93bi13b21lbi5odG1sJ1xuICAgICAgICAvL2NvbnRyb2xsZXI6ICdkcm9wZG93bkNvbnRyb2xsZXInXG4gICAgfTtcbn0pO1xuXG5hcHAuY29udHJvbGxlcignZHJvcGRvd25Db250cm9sbGVyJywgZnVuY3Rpb24gKCRzY29wZSwgR2V0SXRlbXNGYWN0b3J5LCAkc3RhdGUsICRzdGF0ZVBhcmFtcywgJHdpbmRvdykge1xuXG4gICAgR2V0SXRlbXNGYWN0b3J5LmdldEl0ZW1zKCkudGhlbihmdW5jdGlvbihpdGVtcywgZXJyKXtcbiAgICAgICAgaWYoZXJyKSB0aHJvdyBlcnI7XG4gICAgICAgIGVsc2V7XG4gICAgICAgICAgICB2YXIgYWxsSXRlbXMgPSBpdGVtcztcbiAgICAgICAgICAgIC8vY29uc29sZS5sb2coYWxsSXRlbXMpO1xuICAgICAgICAgICAgdmFyIGRyb3BEb3duU29ydGVyID0gZnVuY3Rpb24gKGdlbmRlcikge1xuICAgICAgICAgICAgICAgIHZhciBzb3J0ZWRBcnJheSA9IFtdO1xuICAgICAgICAgICAgICAgIHZhciBzZWxlY3RlZE5hbWVzID0gW107XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgb2JqIGluIGFsbEl0ZW1zKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChzZWxlY3RlZE5hbWVzLmluZGV4T2YoYWxsSXRlbXNbb2JqXS5uYW1lKSA9PT0gLTEgJiYgYWxsSXRlbXNbb2JqXS5nZW5kZXIgPT0gZ2VuZGVyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLy8vY29uc29sZS5sb2coYWxsSXRlbXNbb2JqXS5uYW1lKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGVjdGVkTmFtZXMucHVzaChhbGxJdGVtc1tvYmpdLm5hbWUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgc29ydGVkQXJyYXkucHVzaChhbGxJdGVtc1tvYmpdKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gc29ydGVkQXJyYXk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAkc2NvcGUubWVuUHJvZHVjdHMxID0gZHJvcERvd25Tb3J0ZXIoJ21lbicpLnNsaWNlKDAsMyk7XG4gICAgICAgICAgICAkc2NvcGUubWVuUHJvZHVjdHMyID0gZHJvcERvd25Tb3J0ZXIoJ21lbicpLnNsaWNlKDMsNik7XG5cbiAgICAgICAgICAgICRzY29wZS53b21lblByb2R1Y3RzMSA9IGRyb3BEb3duU29ydGVyKCd3b21lbicpLnNsaWNlKDAsMyk7XG4gICAgICAgICAgICAkc2NvcGUud29tZW5Qcm9kdWN0czIgPSBkcm9wRG93blNvcnRlcignd29tZW4nKS5zbGljZSgzLDYpO1xuICAgICAgICAgICAgLy9jb25zb2xlLmxvZygkc2NvcGUubWVuUHJvZHVjdHMxLCAkc2NvcGUubWVuUHJvZHVjdHMyKTtcbiAgICAgICAgICAgIC8vY29uc29sZS5sb2coJHNjb3BlLndvbWVuUHJvZHVjdHMpO1xuXG4gICAgICAgICAgICAvLyBEcm9wZG93biBjb250cm9sc1xuICAgICAgICAgICAgJHNjb3BlLm1lblZpc2libGUgPSBmYWxzZTtcbiAgICAgICAgICAgICRzY29wZS53b21lblZpc2libGUgPSBmYWxzZTtcblxuICAgICAgICAgICAgJHNjb3BlLnRvZ2dsZU1lblZpc2libGUgPSBmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgICRzY29wZS5tZW5WaXNpYmxlID0gISRzY29wZS5tZW5WaXNpYmxlO1xuICAgICAgICAgICAgICAgICRzY29wZS53b21lblZpc2libGUgPSBmYWxzZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgJHNjb3BlLnRvZ2dsZVdvbWVuVmlzaWJsZSA9IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAkc2NvcGUud29tZW5WaXNpYmxlID0gISRzY29wZS53b21lblZpc2libGU7XG4gICAgICAgICAgICAgICAgJHNjb3BlLm1lblZpc2libGUgPSBmYWxzZTtcbiAgICAgICAgICAgIH1cblxuXG5cbiAgICAgICAgfVxuICAgIH0pO1xuXG59KTsiLCIndXNlIHN0cmljdCc7XG5hcHAuZGlyZWN0aXZlKCduYXZiYXInLCBmdW5jdGlvbiAoJGRvY3VtZW50KSB7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgcmVzdHJpY3Q6ICdFJyxcbiAgICAgICAgLy9zY29wZToge1xuICAgICAgICAvLyAgaXRlbXM6ICc9J1xuICAgICAgICAvL30sXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnanMvY29tbW9uL2RpcmVjdGl2ZXMvbmF2YmFyL25hdmJhci5odG1sJyxcbiAgICAgICAgLy9saW5rOiBmdW5jdGlvbihzY29wZSwgZWxlbWVudCwgYXR0cil7XG4gICAgICAgIC8vICAgIGNvbnNvbGUubG9nKHNjb3BlKTtcbiAgICAgICAgLy8gICAgY29uc29sZS5sb2coZWxlbWVudCk7XG4gICAgICAgIC8vICAgIC8vc2NvcGUubWVuVmlzaWJsZSA9IGZhbHNlO1xuICAgICAgICAvLyAgICAvL1xuICAgICAgICAvLyAgICAvL3Njb3BlLnRvZ2dsZVNlbGVjdCA9IGZ1bmN0aW9uKCl7XG4gICAgICAgIC8vICAgIC8vICAgIHNjb3BlLm1lblZpc2libGUgPSAhc2NvcGUubWVuVmlzaWJsZTtcbiAgICAgICAgLy8gICAgLy99XG4gICAgICAgIC8vICAgIC8vXG4gICAgICAgIC8vICAgICRkb2N1bWVudC5iaW5kKCdjbGljaycsIGZ1bmN0aW9uKGV2ZW50KXtcbiAgICAgICAgLy9cbiAgICAgICAgLy8gICAgICAgIHZhciBpc0NsaWNrZWRFbGVtZW50Q2hpbGRPZlBvcHVwID0gZWxlbWVudFxuICAgICAgICAvLyAgICAgICAgICAgICAgICAuZmluZChldmVudC50YXJnZXQpXG4gICAgICAgIC8vICAgICAgICAgICAgICAgIC5sZW5ndGggPiAwO1xuICAgICAgICAvLyAgICAgICAgY29uc29sZS5sb2coJ2lzIGNsaWNrZWQnLCBzY29wZS5tZW5WaXNpYmxlKVxuICAgICAgICAvLyAgICAgICAgaWYgKGlzQ2xpY2tlZEVsZW1lbnRDaGlsZE9mUG9wdXApXG4gICAgICAgIC8vICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAvL1xuICAgICAgICAvLyAgICAgICAgc2NvcGUubWVuVmlzaWJsZSA9IGZhbHNlO1xuICAgICAgICAvLyAgICAgICAgc2NvcGUuJGFwcGx5KCk7XG4gICAgICAgIC8vICAgIH0pO1xuICAgICAgICAvL31cblxuICAgIH07XG59KTsiLCIndXNlIHN0cmljdCc7XG5hcHAuZGlyZWN0aXZlKCdyYW5kb0dyZWV0aW5nJywgZnVuY3Rpb24gKFJhbmRvbUdyZWV0aW5ncykge1xuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgcmVzdHJpY3Q6ICdFJyxcbiAgICAgICAgdGVtcGxhdGVVcmw6ICdqcy9jb21tb24vZGlyZWN0aXZlcy9yYW5kby1ncmVldGluZy9yYW5kby1ncmVldGluZy5odG1sJyxcbiAgICAgICAgbGluazogZnVuY3Rpb24gKHNjb3BlKSB7XG4gICAgICAgICAgICBzY29wZS5ncmVldGluZyA9IFJhbmRvbUdyZWV0aW5ncy5nZXRSYW5kb21HcmVldGluZygpO1xuICAgICAgICB9XG4gICAgfTtcblxufSk7IiwiJ3VzZSBzdHJpY3QnO1xuYXBwLmRpcmVjdGl2ZSgnc3BlY3N0YWNrdWxhckxvZ28nLCBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgcmVzdHJpY3Q6ICdFJyxcbiAgICAgICAgdGVtcGxhdGVVcmw6ICdqcy9jb21tb24vZGlyZWN0aXZlcy9zcGVjc3RhY2t1bGFyLWxvZ28vc3BlY3N0YWNrdWxhci1sb2dvLmh0bWwnXG4gICAgfTtcbn0pOyJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==