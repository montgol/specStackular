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

<<<<<<< HEAD
	$scope.addToOrder = function(specificItem){
		console.log('got into the function'); //part one always add it to the cookie
		var order = $cookieStore.get('Order');
		var resolved = false;
		var line = {itemId: specificItem._id, quantity: 1};
		// console.log('Request to add item to order');
			if(order){ //if user has an order on a cookie
				order.forEach(function(itemLine){
					if(itemLine.itemId === specificItem.itemId){
						itemLine.qty++;
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
		var user = AuthService.getLoggedInUser();
		if(user){
			//OrderFactory.getOrders(user._id)//
		}
		

		//part 2, check if user has logged in, and send to order db
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


=======

});
>>>>>>> 30-glenn-UIchanges-dropdownmenu

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
        templateUrl: 'js/itemCreate/itemCreate.html'
    });

});

app.controller('itemCreateController', function ($scope, CreateItemFactory, $state, $stateParams) {

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

    // Register our *Login* state.
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

app.controller('orderController', function ($scope, OrderFactory, $state, $stateParams, $cookieStore, AuthService) {

	//provides general functionality with an order
	//views current user order
		//order is shown by line item
		//has ability to edit order, or proceed to checkout
	$scope.activeorders=[];
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
		// if( 5 ){ //force user is authenticated
			AuthService.getLoggedInUser().then(function(user){
			$scope.userId = user._id;
			// $scope.userId = '54fb722d95c428c04612b1a5';
			$scope.user = user.first_name;
			// $scope.user = 'Evan'
			$scope.auth = true;
				OrderFactory.getOrders($scope.userId).then(function(items, err){
					console.log('items', items);
					if (err) console.log('Error: ', err);
					else if(!items) { //no items in dB, get cookies, set order
						//console.log('No current order in DB'); //not sure what else needs to be declared.
						$scope.activeorders = $cookieStore.get('Order');
						//console.log('current items', $scope.activeorders);
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
			$scope.activeorders = $cookieStore.get('Order');
			$scope.user = 'User';
			$scope.auth = false;
			sum();
			totalQty();
		}
	};

	firstUpdate();


	function serverUpdate(){

	}

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
		var location = getLocInCookie(myOrderCookie, item._id);
		//var removedItem = myOrderCookie.splice(location, 1);
		//$cookieStore.put('Order', myOrderCookie);
		//$scope.activeorders = myOrderCookie;
		//sum();
		//totalQty();

		if(AuthService.isAuthenticated()){
			OrderFactory.updateOrder({orderId: $scope.orderId, quantity: 0, itemId: Item._id}).then(function(err, data){
				if(err) console.log(err);

			});
			$scope.auth = true;
		}
	}

	function getLocInCookie (cookie, id){
		var loc;
		cookie.forEach(function(element, index){
			if(element.item._id === id){
				console.log(element.item._id, " is the correct key");
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
			$scope.activeorders = orderCookie;
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
        controller: 'orderModifyController'
    });

});

app.controller('orderModifyController', function ($scope, orderModifyFactory, $state, $stateParams, $rootScope) {

	$scope.item = {
		categories: [] };
	$scope.success;

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
app.factory('orderModifyFactory', function($http){
	
	return {
		modifyOrder: function(data){
			console.log('into the factory', data);
			// return $http.post('/api/item', data);

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

app.controller('dropdownController', function ($scope, GetItemsFactory, $state, $stateParams) {

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

            $scope.hello = "well hello";

            $scope.toggleMenVisible = function(){
                console.log($scope.menVisible);
                if ($scope.menVisible === false) {
                    $scope.menVisible = true;
                    //console.log("Wahoo")
                }

                else $scope.menVisible = false;

            }

            $scope.toggleWomenVisible = function(){
                //console.log($scope.menVisible);
                if ($scope.womenVisible === false) {
                    $scope.womenVisible = true;
                    //console.log("Wahoo")
                }

                else $scope.womenVisible = false;

            }



        }
    });

});
'use strict';
app.directive('navbar', function () {
    return {
        restrict: 'E',

        //scope: {
        //  items: '='
        //},

        templateUrl: 'js/common/directives/navbar/navbar.html'
    };
});

//app.directive('hoverdrop', function() {
//
//    return {
//        restrict: 'A',
//        link: function (scope, elem, attr) {
//            elem.on('click', function(label) {
//                console.log(label)
//            })
//        }
//    }
//})

'use strict';
app.directive('specstackularLogo', function () {
    return {
        restrict: 'E',
        templateUrl: 'js/common/directives/specstackular-logo/specstackular-logo.html'
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyIsImFib3V0L2Fib3V0LmpzIiwiYWxsSXRlbXMvYWxsSXRlbXMuanMiLCJhZG1pbi9hZG1pbi5qcyIsImFkbWluL2luZGV4LmpzIiwiZnNhL2ZzYS1wcmUtYnVpbHQuanMiLCJob21lL2hvbWUuanMiLCJob21lL3Byb2R1Y3RyZXZpZXdzY29udHJvbGxlci5qcyIsImhvbWUvcmV2aWV3c3Rhci5qcyIsIml0ZW0vaXRlbS5qcyIsIml0ZW1DcmVhdGUvaXRlbUNyZWF0ZS5qcyIsImpvaW5ub3cvam9pbm5vdy5qcyIsImxvZ2luL2xvZ2luLmpzIiwib3JkZXIvb3JkZXIuanMiLCJvcmRlck1vZGlmeS9vcmRlck1vZGlmeS5qcyIsInByb2R1Y3RDYXRDcmVhdGUvcHJvZHVjdENhdENyZWF0ZS5qcyIsInJldmlldy1lbnRyeS9yZXZpZXctZW50cnkuanMiLCJyZXZpZXctZW50cnkvc3RhcnMuanMiLCJ0ZXN0U3RyaXBlL3N0cmlwZS5qcyIsInR1dG9yaWFsL3R1dG9yaWFsLmpzIiwidXNlck1vZGlmeS91c2VyTW9kaWZ5LmpzIiwiY29tbW9uL2ZhY3Rvcmllcy9DcmVhdGVJdGVtRmFjdG9yeS5qcyIsImNvbW1vbi9mYWN0b3JpZXMvQ3JlYXRlUmV2aWV3LmpzIiwiY29tbW9uL2ZhY3Rvcmllcy9DcmVhdGVVc2VyRmFjdG9yeS5qcyIsImNvbW1vbi9mYWN0b3JpZXMvR2V0SXRlbUZhY3RvcnkuanMiLCJjb21tb24vZmFjdG9yaWVzL0dldEl0ZW1zRmFjdG9yeS5qcyIsImNvbW1vbi9mYWN0b3JpZXMvR2V0VXNlckZhY3RvcnkuanMiLCJjb21tb24vZmFjdG9yaWVzL09yZGVyRmFjdG9yeS5qcyIsImNvbW1vbi9mYWN0b3JpZXMvUmFuZG9tR3JlZXRpbmdzLmpzIiwiY29tbW9uL2ZhY3Rvcmllcy9Tb2NrZXQuanMiLCJjb21tb24vZmFjdG9yaWVzL2FkbWluTmF2YmFyRmFjdG9yeS5qcyIsImNvbW1vbi9mYWN0b3JpZXMvYWRtaW5Qb3N0VXNlci5qcyIsImNvbW1vbi9mYWN0b3JpZXMvb3JkZXJNb2RpZnlGYWN0b3J5LmpzIiwiY29tbW9uL2ZhY3Rvcmllcy91c2VyTW9kaWZ5RmFjdG9yeS5qcyIsInR1dG9yaWFsL3R1dG9yaWFsLXNlY3Rpb24vdHV0b3JpYWwtc2VjdGlvbi5qcyIsInR1dG9yaWFsL3R1dG9yaWFsLXNlY3Rpb24tbWVudS90dXRvcmlhbC1zZWN0aW9uLW1lbnUuanMiLCJ0dXRvcmlhbC90dXRvcmlhbC12aWRlby90dXRvcmlhbC12aWRlby5qcyIsImNvbW1vbi9kaXJlY3RpdmVzL3JhbmRvLWdyZWV0aW5nL3JhbmRvLWdyZWV0aW5nLmpzIiwiY29tbW9uL2RpcmVjdGl2ZXMvbmF2YmFyL25hdi1kcm9wZG93bi5qcyIsImNvbW1vbi9kaXJlY3RpdmVzL25hdmJhci9uYXZiYXIuanMiLCJjb21tb24vZGlyZWN0aXZlcy9zcGVjc3RhY2t1bGFyLWxvZ28vc3BlY3N0YWNrdWxhci1sb2dvLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ25DQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNqSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDWEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDcEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2pIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzFCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdkRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMvQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzlDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNsREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMzS0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMxQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDUkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMzQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2pEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNkQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDakRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDakNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNiQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNwQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDWEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDcEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3ZCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN2QkE7QUFDQTtBQ0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNWQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNSQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNoQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDZEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNmQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3JCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2xCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNYQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNuRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN4QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0Jztcbi8vIHZhciBhcHAgPSBhbmd1bGFyLm1vZHVsZSgnRnVsbHN0YWNrR2VuZXJhdGVkQXBwJywgWyd1aS5yb3V0ZXInLCAnZnNhUHJlQnVpbHQnXSk7XG5cbnZhciBhcHAgPSBhbmd1bGFyLm1vZHVsZSgnc3BlY1N0YWNrdWxhcicsIFsndWkucm91dGVyJywgJ2ZzYVByZUJ1aWx0JywgJ25nQ29va2llcyddKTtcbmFwcC5jb250cm9sbGVyKCdNYWluQ29udHJvbGxlcicsIGZ1bmN0aW9uICgkc2NvcGUsICRyb290U2NvcGUpIHtcblxuICAgIC8vIEdpdmVuIHRvIHRoZSA8bmF2YmFyPiBkaXJlY3RpdmUgdG8gc2hvdyB0aGUgbWVudS5cbiAgICAkc2NvcGUubWVudUl0ZW1zID0gW1xuICAgICAgICB7IGxhYmVsOiAnTWVuJywgc3RhdGU6ICdwcm9kdWN0cycgfSxcbiAgICAgICAgeyBsYWJlbDogJ1dvbWVuJywgc3RhdGU6ICd3b21lbicgfSxcbiAgICAgICAgeyBsYWJlbDogJ0pvaW4gdXMnLCBzdGF0ZTogJ2pvaW4nIH0sXG4gICAgICAgIHsgbGFiZWw6ICdMb2cgSW4nLCBzdGF0ZTogJ2xvZ2luJ30sXG4gICAgICAgIHsgbGFiZWw6ICdQcm9kdWN0IGxpc3QnLCBzdGF0ZTogJ3Byb2R1Y3RzJyB9LFxuICAgICAgICB7IGxhYmVsOiAnTXkgT3JkZXJzJywgc3RhdGU6ICdvcmRlcnMnfVxuICAgIF07XG4gICAgJHNjb3BlLmFkbWluSXRlbXM9IFtcbiAgICAgICAgeyBsYWJlbDogJ0NyZWF0ZSBwcm9kdWN0Jywgc3RhdGU6ICdhZG1pbi5pdGVtQ3JlYXRlJyB9LFxuICAgICAgICB7IGxhYmVsOiAnTW9kaWZ5IFVzZXInLCBzdGF0ZTogJ2FkbWluLnVzZXJNb2RpZnknfSxcbiAgICAgICAgeyBsYWJlbDogJ01vZGlmeSBPcmRlcicsIHN0YXRlOiAnYWRtaW4ub3JkZXJNb2RpZnknfSxcbiAgICAgICAgeyBsYWJlbDogJ0NyZWF0ZSBQcm9kdWN0IENhdCBQZycsIHN0YXRlOiAnYWRtaW4ucHJvZHVjdENhdENyZWF0ZSd9XG4gICAgXVxuXG5cblxuXG5cbn0pO1xuXG5cbmFwcC5jb25maWcoZnVuY3Rpb24gKCR1cmxSb3V0ZXJQcm92aWRlciwgJGxvY2F0aW9uUHJvdmlkZXIpIHtcbiAgICAvLyBUaGlzIHR1cm5zIG9mZiBoYXNoYmFuZyB1cmxzICgvI2Fib3V0KSBhbmQgY2hhbmdlcyBpdCB0byBzb21ldGhpbmcgbm9ybWFsICgvYWJvdXQpXG4gICAgJGxvY2F0aW9uUHJvdmlkZXIuaHRtbDVNb2RlKHRydWUpO1xuICAgIC8vIElmIHdlIGdvIHRvIGEgVVJMIHRoYXQgdWktcm91dGVyIGRvZXNuJ3QgaGF2ZSByZWdpc3RlcmVkLCBnbyB0byB0aGUgXCIvXCIgdXJsLlxuICAgICR1cmxSb3V0ZXJQcm92aWRlci5vdGhlcndpc2UoJy8nKTtcbn0pO1xuIiwiJ3VzZSBzdHJpY3QnO1xuYXBwLmNvbmZpZyhmdW5jdGlvbiAoJHN0YXRlUHJvdmlkZXIpIHtcblxuICAgIC8vIFJlZ2lzdGVyIG91ciAqYWJvdXQqIHN0YXRlLlxuICAgICRzdGF0ZVByb3ZpZGVyLnN0YXRlKCdhYm91dCcsIHtcbiAgICAgICAgdXJsOiAnL2Fib3V0JyxcbiAgICAgICAgY29udHJvbGxlcjogJ0Fib3V0Q29udHJvbGxlcicsXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnanMvYWJvdXQvYWJvdXQuaHRtbCdcbiAgICB9KTtcblxufSk7XG5cbmFwcC5jb250cm9sbGVyKCdBYm91dENvbnRyb2xsZXInLCBmdW5jdGlvbiAoJHNjb3BlKSB7XG5cbiAgICAvLyBJbWFnZXMgb2YgYmVhdXRpZnVsIEZ1bGxzdGFjayBwZW9wbGUuXG4gICAgJHNjb3BlLmltYWdlcyA9IFtcbiAgICAgICAgJ2h0dHBzOi8vcGJzLnR3aW1nLmNvbS9tZWRpYS9CN2dCWHVsQ0FBQVhRY0UuanBnOmxhcmdlJyxcbiAgICAgICAgJ2h0dHBzOi8vZmJjZG4tc3Bob3Rvcy1jLWEuYWthbWFpaGQubmV0L2hwaG90b3MtYWsteGFwMS90MzEuMC04LzEwODYyNDUxXzEwMjA1NjIyOTkwMzU5MjQxXzgwMjcxNjg4NDMzMTI4NDExMzdfby5qcGcnLFxuICAgICAgICAnaHR0cHM6Ly9wYnMudHdpbWcuY29tL21lZGlhL0ItTEtVc2hJZ0FFeTlTSy5qcGcnLFxuICAgICAgICAnaHR0cHM6Ly9wYnMudHdpbWcuY29tL21lZGlhL0I3OS1YN29DTUFBa3c3eS5qcGcnLFxuICAgICAgICAnaHR0cHM6Ly9wYnMudHdpbWcuY29tL21lZGlhL0ItVWo5Q09JSUFJRkFoMC5qcGc6bGFyZ2UnLFxuICAgICAgICAnaHR0cHM6Ly9wYnMudHdpbWcuY29tL21lZGlhL0I2eUl5RmlDRUFBcWwxMi5qcGc6bGFyZ2UnXG4gICAgXTtcblxufSk7IiwiJ3VzZSBzdHJpY3QnO1xuXG5hcHAucnVuKGZ1bmN0aW9uICgkY29va2llcywgJGNvb2tpZVN0b3JlKSB7XG5cblx0dmFyIGluaXQgPSAkY29va2llU3RvcmUuZ2V0KCdPcmRlcicpO1xuXHRpZighaW5pdCl7XG5cdFx0JGNvb2tpZVN0b3JlLnB1dCgnT3JkZXInLCBbXSk7XG5cdFx0Y29uc29sZS5sb2coJ3N0YXJ0aW5nIGNvb2tpZTogJywgJGNvb2tpZVN0b3JlLmdldCgnT3JkZXInKSk7XG5cdH1cblxufSk7XG5cbmFwcC5jb25maWcoZnVuY3Rpb24gKCRzdGF0ZVByb3ZpZGVyKSB7XG5cblxuICAgICRzdGF0ZVByb3ZpZGVyLnN0YXRlKCdwcm9kdWN0cycsIHtcbiAgICAgICAgdXJsOiAnL3Byb2R1Y3RzJyxcbiAgICAgICAgY29udHJvbGxlcjogJ2FsbEl0ZW1zQ29udHJvbGxlcicsXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnanMvYWxsaXRlbXMvYWxsaXRlbXMuaHRtbCdcbiAgICB9KVxuXG59KTtcblxuYXBwLmNvbmZpZyhmdW5jdGlvbiAoJHN0YXRlUHJvdmlkZXIpIHtcblxuICAgIC8vIFJlZ2lzdGVyIG91ciAqbWVuKiBzdGF0ZS5cbiAgICAkc3RhdGVQcm92aWRlci5zdGF0ZSgnbWVuJywge1xuICAgICAgICB1cmw6ICcvcHJvZHVjdHMvbWVuJyxcbiAgICAgICAgY29udHJvbGxlcjogJ2FsbEl0ZW1zQ29udHJvbGxlcicsXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnanMvYWxsaXRlbXMvYWxsaXRlbXMuaHRtbCdcbiAgICB9KVxuXG59KTtcblxuYXBwLmNvbmZpZyhmdW5jdGlvbiAoJHN0YXRlUHJvdmlkZXIpIHtcblxuICAgIC8vIFJlZ2lzdGVyIG91ciAqd29tZW4qIHN0YXRlLlxuICAgICRzdGF0ZVByb3ZpZGVyLnN0YXRlKCd3b21lbicsIHtcbiAgICAgICAgdXJsOiAnL3Byb2R1Y3RzL3dvbWVuJyxcbiAgICAgICAgLy8gY29udHJvbGxlcjogJ2NhdGVnb3J5Q29udHJvbGxlcicsXG4gICAgICAgIGNvbnRyb2xsZXI6IGZ1bmN0aW9uICgkc2NvcGUsIEdldEl0ZW1zRmFjdG9yeSwgJHN0YXRlLCAkc3RhdGVQYXJhbXMpIHtcblx0XHRcdGNvbnNvbGUubG9nKFwiYmVmb3JlXCIsICRzY29wZS5pdGVtcywgJHN0YXRlLmN1cnJlbnQpO1xuXHRcdFx0R2V0SXRlbXNGYWN0b3J5LmdldEl0ZW1zKCkudGhlbihmdW5jdGlvbihpdGVtcyl7XHRcblx0XHRcdFx0JHNjb3BlLml0ZW1zID0gaXRlbXM7XG5cdFx0XHRcdGNvbnNvbGUubG9nKGl0ZW1zKTtcblx0XHRcdH0pO1xuXHRcdH0sXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnanMvYWxsaXRlbXMvYWxsaXRlbXMuaHRtbCcsXG4gICAgfSlcbn0pO1xuXG5cbmFwcC5jb250cm9sbGVyKCdhbGxJdGVtc0NvbnRyb2xsZXInLCBmdW5jdGlvbiAoJHNjb3BlLCBBdXRoU2VydmljZSwgR2V0SXRlbXNGYWN0b3J5LCAkc3RhdGUsICRzdGF0ZVBhcmFtcywgJGNvb2tpZVN0b3JlLCBPcmRlckZhY3RvcnkpIHtcblxuXHRHZXRJdGVtc0ZhY3RvcnkuZ2V0SXRlbXMoKS50aGVuKGZ1bmN0aW9uKGl0ZW1zLCBlcnIpe1xuXHRcdGlmKGVycikgdGhyb3cgZXJyO1xuXHRcdGVsc2V7XG5cdFx0XHQkc2NvcGUuaXRlbXMgPSBpdGVtcztcblx0XHR9XG5cdH0pO1xuXG48PDw8PDw8IEhFQURcblx0JHNjb3BlLmFkZFRvT3JkZXIgPSBmdW5jdGlvbihzcGVjaWZpY0l0ZW0pe1xuXHRcdGNvbnNvbGUubG9nKCdnb3QgaW50byB0aGUgZnVuY3Rpb24nKTsgLy9wYXJ0IG9uZSBhbHdheXMgYWRkIGl0IHRvIHRoZSBjb29raWVcblx0XHR2YXIgb3JkZXIgPSAkY29va2llU3RvcmUuZ2V0KCdPcmRlcicpO1xuXHRcdHZhciByZXNvbHZlZCA9IGZhbHNlO1xuXHRcdHZhciBsaW5lID0ge2l0ZW1JZDogc3BlY2lmaWNJdGVtLl9pZCwgcXVhbnRpdHk6IDF9O1xuXHRcdC8vIGNvbnNvbGUubG9nKCdSZXF1ZXN0IHRvIGFkZCBpdGVtIHRvIG9yZGVyJyk7XG5cdFx0XHRpZihvcmRlcil7IC8vaWYgdXNlciBoYXMgYW4gb3JkZXIgb24gYSBjb29raWVcblx0XHRcdFx0b3JkZXIuZm9yRWFjaChmdW5jdGlvbihpdGVtTGluZSl7XG5cdFx0XHRcdFx0aWYoaXRlbUxpbmUuaXRlbUlkID09PSBzcGVjaWZpY0l0ZW0uaXRlbUlkKXtcblx0XHRcdFx0XHRcdGl0ZW1MaW5lLnF0eSsrO1xuXHRcdFx0XHRcdFx0cmVzb2x2ZWQgPSB0cnVlO1xuXHRcdFx0XHRcdH1cdFxuXHRcdFx0XHR9KTtcblx0XHRcdFx0aWYoIXJlc29sdmVkKXtcblx0XHRcdFx0XHRvcmRlci5wdXNoKGxpbmUpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRlbHNle1xuXHRcdFx0XHRvcmRlci5wdXNoKGxpbmUpO1xuXHRcdFx0fVxuXHRcdCRjb29raWVTdG9yZS5wdXQoJ09yZGVyJywgb3JkZXIpO1xuXHRcdHZhciB1c2VyID0gQXV0aFNlcnZpY2UuZ2V0TG9nZ2VkSW5Vc2VyKCk7XG5cdFx0aWYodXNlcil7XG5cdFx0XHQvL09yZGVyRmFjdG9yeS5nZXRPcmRlcnModXNlci5faWQpLy9cblx0XHR9XG5cdFx0XG5cblx0XHQvL3BhcnQgMiwgY2hlY2sgaWYgdXNlciBoYXMgbG9nZ2VkIGluLCBhbmQgc2VuZCB0byBvcmRlciBkYlxuXHR9XG59KTtcblxuXG5cbmFwcC5jb250cm9sbGVyKCdjYXRlZ29yeUNvbnRyb2xsZXInLCBmdW5jdGlvbiAoJHNjb3BlLCBHZXRJdGVtc0ZhY3RvcnksICRzdGF0ZSwgJHN0YXRlUGFyYW1zKSB7XG5cblx0JHNjb3BlLmdldENhdGVnb3J5ID0gZnVuY3Rpb24gKGNhdGVnb3J5KXtcblx0XHRjb25zb2xlLmxvZyhcIm1lbiBjb250cm9sbGVyXCIsIGNhdGVnb3J5KTtcblx0XHRcdEdldEl0ZW1GYWN0b3J5LmdldENhdGVnb3J5SXRlbXMoKS50aGVuKGZ1bmN0aW9uKGl0ZW1zLCBlcnIpe1xuXHRcdFx0XHRcdGlmKGVycikgdGhyb3cgZXJyO1xuXHRcdFx0XHRcdFx0ZWxzZXtcblx0XHRcdFx0XHRcdFx0JHNjb3BlLml0ZW1zID0gaXRlbXM7XG5cdFx0XHRcdFx0fTtcblx0XHRcdH0pO1xuXHR9O1xufSk7XG5cblxuPT09PT09PVxuXG59KTtcbj4+Pj4+Pj4gMzAtZ2xlbm4tVUljaGFuZ2VzLWRyb3Bkb3dubWVudVxuIiwiJ3VzZSBzdHJpY3QnO1xuYXBwLmNvbmZpZyhmdW5jdGlvbiAoJHN0YXRlUHJvdmlkZXIpIHtcblxuICAgIFxuICAgICRzdGF0ZVByb3ZpZGVyLnN0YXRlKCdhZG1pbicsIHtcbiAgICAgICAgdXJsOiAnL2FkbWluJyxcbiAgICAgICAgdGVtcGxhdGVVcmw6ICdqcy9hZG1pbi9hZG1pbi5odG1sJ1xuICAgIH0pO1xuXG59KTtcblxuIiwiJ3VzZSBzdHJpY3QnO1xuYXBwLmNvbnRyb2xsZXIoJ0FkbWluQ29udHJvbGxlcicsIGZ1bmN0aW9uICgkc2NvcGUpIHtcblxuICAgIC8vIEdpdmVuIHRvIHRoZSA8bmF2YmFyPiBkaXJlY3RpdmUgdG8gc2hvdyB0aGUgbWVudS5cbiAgICAkc2NvcGUubWVudUl0ZW1zID0gW1xuICAgICAgICB7IGxhYmVsOiAnSG9tZScsIHN0YXRlOiAnaG9tZScgfSxcbiAgICAgICAgeyBsYWJlbDogJ0NyZWF0ZSBJdGVtJywgc3RhdGU6ICdpdGVtQ3JlYXRlJyB9LFxuICAgICAgICB7IGxhYmVsOiAnTW9kaWZ5IFVzZXInLCBzdGF0ZTogJ3VzZXJNb2RpZnknIH1cbiAgICBdO1xuXG59KTtcblxuYXBwLmRpcmVjdGl2ZSgnYWRtaW5OYXZiYXInLCBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgcmVzdHJpY3Q6ICdFJyxcbiAgICAgICAgc2NvcGU6IHtcbiAgICAgICAgICBpdGVtczogJz0nXG4gICAgICAgIH0sXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnanMvY29tbW9uL2RpcmVjdGl2ZXMvbmF2YmFyL25hdmJhci5odG1sJ1xuICAgIH07XG59KTsiLCIoZnVuY3Rpb24gKCkge1xuXG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgLy8gSG9wZSB5b3UgZGlkbid0IGZvcmdldCBBbmd1bGFyISBEdWgtZG95LlxuICAgIGlmICghd2luZG93LmFuZ3VsYXIpIHRocm93IG5ldyBFcnJvcignSSBjYW5cXCd0IGZpbmQgQW5ndWxhciEnKTtcblxuICAgIHZhciBhcHAgPSBhbmd1bGFyLm1vZHVsZSgnZnNhUHJlQnVpbHQnLCBbXSk7XG5cbiAgICBhcHAuZmFjdG9yeSgnU29ja2V0JywgZnVuY3Rpb24gKCRsb2NhdGlvbikge1xuXG4gICAgICAgIGlmICghd2luZG93LmlvKSB0aHJvdyBuZXcgRXJyb3IoJ3NvY2tldC5pbyBub3QgZm91bmQhJyk7XG5cbiAgICAgICAgdmFyIHNvY2tldDtcblxuICAgICAgICBpZiAoJGxvY2F0aW9uLiQkcG9ydCkge1xuICAgICAgICAgICAgc29ja2V0ID0gaW8oJ2h0dHA6Ly9sb2NhbGhvc3Q6MTMzNycpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgc29ja2V0ID0gaW8oJy8nKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBzb2NrZXQ7XG5cbiAgICB9KTtcblxuICAgIGFwcC5jb25zdGFudCgnQVVUSF9FVkVOVFMnLCB7XG4gICAgICAgIGxvZ2luU3VjY2VzczogJ2F1dGgtbG9naW4tc3VjY2VzcycsXG4gICAgICAgIGxvZ2luRmFpbGVkOiAnYXV0aC1sb2dpbi1mYWlsZWQnLFxuICAgICAgICBsb2dvdXRTdWNjZXNzOiAnYXV0aC1sb2dvdXQtc3VjY2VzcycsXG4gICAgICAgIHNlc3Npb25UaW1lb3V0OiAnYXV0aC1zZXNzaW9uLXRpbWVvdXQnLFxuICAgICAgICBub3RBdXRoZW50aWNhdGVkOiAnYXV0aC1ub3QtYXV0aGVudGljYXRlZCcsXG4gICAgICAgIG5vdEF1dGhvcml6ZWQ6ICdhdXRoLW5vdC1hdXRob3JpemVkJ1xuICAgIH0pO1xuXG4gICAgYXBwLmNvbmZpZyhmdW5jdGlvbiAoJGh0dHBQcm92aWRlcikge1xuICAgICAgICAkaHR0cFByb3ZpZGVyLmludGVyY2VwdG9ycy5wdXNoKFtcbiAgICAgICAgICAgICckaW5qZWN0b3InLFxuICAgICAgICAgICAgZnVuY3Rpb24gKCRpbmplY3Rvcikge1xuICAgICAgICAgICAgICAgIHJldHVybiAkaW5qZWN0b3IuZ2V0KCdBdXRoSW50ZXJjZXB0b3InKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgXSk7XG4gICAgfSk7XG5cbiAgICBhcHAuZmFjdG9yeSgnQXV0aEludGVyY2VwdG9yJywgZnVuY3Rpb24gKCRyb290U2NvcGUsICRxLCBBVVRIX0VWRU5UUykge1xuICAgICAgICB2YXIgc3RhdHVzRGljdCA9IHtcbiAgICAgICAgICAgIDQwMTogQVVUSF9FVkVOVFMubm90QXV0aGVudGljYXRlZCxcbiAgICAgICAgICAgIDQwMzogQVVUSF9FVkVOVFMubm90QXV0aG9yaXplZCxcbiAgICAgICAgICAgIDQxOTogQVVUSF9FVkVOVFMuc2Vzc2lvblRpbWVvdXQsXG4gICAgICAgICAgICA0NDA6IEFVVEhfRVZFTlRTLnNlc3Npb25UaW1lb3V0XG4gICAgICAgIH07XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICByZXNwb25zZUVycm9yOiBmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgICAgICAgICAgICAgICAkcm9vdFNjb3BlLiRicm9hZGNhc3Qoc3RhdHVzRGljdFtyZXNwb25zZS5zdGF0dXNdLCByZXNwb25zZSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuICRxLnJlamVjdChyZXNwb25zZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgfSk7XG5cbiAgICBhcHAuc2VydmljZSgnQXV0aFNlcnZpY2UnLCBmdW5jdGlvbiAoJGh0dHAsIFNlc3Npb24sICRyb290U2NvcGUsIEFVVEhfRVZFTlRTLCAkcSkge1xuXG4gICAgICAgIHZhciBvblN1Y2Nlc3NmdWxMb2dpbiA9IGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICAgICAgICAgICAgdmFyIGRhdGEgPSByZXNwb25zZS5kYXRhO1xuICAgICAgICAgICAgU2Vzc2lvbi5jcmVhdGUoZGF0YS5pZCwgZGF0YS51c2VyKTtcbiAgICAgICAgICAgICRyb290U2NvcGUuJGJyb2FkY2FzdChBVVRIX0VWRU5UUy5sb2dpblN1Y2Nlc3MpO1xuICAgICAgICAgICAgcmV0dXJuIGRhdGEudXNlcjtcbiAgICAgICAgfTtcblxuICAgICAgICB0aGlzLmdldExvZ2dlZEluVXNlciA9IGZ1bmN0aW9uICgpIHtcblxuICAgICAgICAgICAgaWYgKHRoaXMuaXNBdXRoZW50aWNhdGVkKCkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gJHEud2hlbih7IHVzZXI6IFNlc3Npb24udXNlciB9KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuICRodHRwLmdldCgnL3Nlc3Npb24nKS50aGVuKG9uU3VjY2Vzc2Z1bExvZ2luKS5jYXRjaChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICB9O1xuXG4gICAgICAgIHRoaXMubG9naW4gPSBmdW5jdGlvbiAoY3JlZGVudGlhbHMpIHtcbiAgICAgICAgICAgIHJldHVybiAkaHR0cC5wb3N0KCcvbG9naW4nLCBjcmVkZW50aWFscykudGhlbihvblN1Y2Nlc3NmdWxMb2dpbik7XG4gICAgICAgIH07XG5cbiAgICAgICAgdGhpcy5sb2dvdXQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KCcvbG9nb3V0JykudGhlbihmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgU2Vzc2lvbi5kZXN0cm95KCk7XG4gICAgICAgICAgICAgICAgJHJvb3RTY29wZS4kYnJvYWRjYXN0KEFVVEhfRVZFTlRTLmxvZ291dFN1Y2Nlc3MpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgdGhpcy5pc0F1dGhlbnRpY2F0ZWQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gISFTZXNzaW9uLnVzZXI7XG4gICAgICAgIH07XG5cbiAgICB9KTtcblxuICAgIGFwcC5zZXJ2aWNlKCdTZXNzaW9uJywgZnVuY3Rpb24gKCRyb290U2NvcGUsIEFVVEhfRVZFTlRTKSB7XG5cbiAgICAgICAgJHJvb3RTY29wZS4kb24oQVVUSF9FVkVOVFMubm90QXV0aGVudGljYXRlZCwgdGhpcy5kZXN0cm95KTtcbiAgICAgICAgJHJvb3RTY29wZS4kb24oQVVUSF9FVkVOVFMuc2Vzc2lvblRpbWVvdXQsIHRoaXMuZGVzdHJveSk7XG5cbiAgICAgICAgdGhpcy5jcmVhdGUgPSBmdW5jdGlvbiAoc2Vzc2lvbklkLCB1c2VyKSB7XG4gICAgICAgICAgICB0aGlzLmlkID0gc2Vzc2lvbklkO1xuICAgICAgICAgICAgdGhpcy51c2VyID0gdXNlcjtcbiAgICAgICAgfTtcblxuICAgICAgICB0aGlzLmRlc3Ryb3kgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB0aGlzLmlkID0gbnVsbDtcbiAgICAgICAgICAgIHRoaXMudXNlciA9IG51bGw7XG4gICAgICAgIH07XG5cbiAgICB9KTtcblxufSkoKTsiLCIndXNlIHN0cmljdCc7XG5hcHAuY29uZmlnKGZ1bmN0aW9uICgkc3RhdGVQcm92aWRlcikge1xuXG4gICAgJHN0YXRlUHJvdmlkZXIuc3RhdGUoJ2hvbWUnLCB7XG4gICAgICAgIHVybDogJy8nLFxuICAgICAgICBjb250cm9sbGVyOiAnSG9tZUN0cmwnLFxuICAgICAgICB0ZW1wbGF0ZVVybDogJ2pzL2hvbWUvaG9tZS5odG1sJ1xuICAgIH0pO1xuXG59KTtcblxuYXBwLmNvbnRyb2xsZXIoJ0hvbWVDdHJsJywgZnVuY3Rpb24gKCRzY29wZSkge1xufSk7IiwiYXBwLmNvbnRyb2xsZXIoJ3Byb2R1Y3RyZXZpZXdzY29udHJvbGxlcicsIGZ1bmN0aW9uKCRzY29wZSl7XG4gICAgJHNjb3BlLnJhdGUxID0gMDtcblxuICAgICRzY29wZS5yYXRlMiA9IDY7XG5cbiAgICAkc2NvcGUucmV2aWV3c2xpc3QgPSBbXG4gICAgICAgIHtcbiAgICAgICAgICAgIHJhdGluZzogNSxcbiAgICAgICAgICAgIHRleHQ6IFwiVGhlc2UgYXJlIHF1aXRlIHNpbXBseSB0aGUgYmVzdCBnbGFzc2VzLCBuYXkgdGhlIGJlc3QgQU5ZVEhJTkcgSSd2ZSBldmVyIG93bmVkISBcIiArXG4gICAgICAgICAgICBcIldoZW4gSSBwdXQgdGhlbSBvbiwgYW4gZW5lcmd5IGJlYW0gc2hvb3RzIG91dCBvZiBteSBleWViYWxscyB0aGF0IG1ha2VzIGV2ZXJ5dGhpbmcgSSBsb29rIGF0IFwiICtcbiAgICAgICAgICAgIFwiYnVyc3QgaW50byBmbGFtZXMhISBNeSBnaXJsZnJpZW5kIGRvZXNuJ3QgYXBwcmVjaWF0ZSBpdCwgdGhvdWdoLlwiXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIHJhdGluZzogMSxcbiAgICAgICAgICAgIHRleHQ6IFwiVGhlc2UgZ2xhc3NlcyBhcmUgdGhlIHdvcnN0ISBXaG8gbWFkZSB0aGVzZT8gV2hlbiBJIG9wZW5lZCB0aGUgcGFja2FnZSB0aGV5IHNwcnVuZyBvdXQgYW5kIHN1Y2tlZCBcIiArXG4gICAgICAgICAgICBcIm9udG8gbXkgZmFjZSBsaWtlIHRoZSBtb25zdGVyIGluIEFMSUVOISBJIGhhZCB0byBiZWF0IG15c2VsZiBpbiB0aGUgaGVhZCB3aXRoIGEgc2hvdmVsIHRvIGdldCB0aGVtIG9mZiEgXCIgK1xuICAgICAgICAgICAgXCJXaG8gQVJFIHlvdSBwZW9wbGU/IFdoYXQgaXMgd3Jvbmcgd2l0aCB5b3U/IEhhdmUgeW91IG5vIGRpZ25pdHk/IERvbid0IHlvdSB1bmRlcnN0YW5kIHdoYXQgZXllZ2xhc3NlcyBhcmUgXCIgK1xuICAgICAgICAgICAgXCJGT1I/XCJcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgcmF0aW5nOiA0LFxuICAgICAgICAgICAgdGV4dDogXCJUaGUgZ2xhc3NlcyBhcmUganVzdCBPSyDigJQgdG8gc3BpY2UgdGhpbmdzIHVwIEkgY2hvcHBlZCB1cCBzb21lIHNjYWxsaW9ucyBhbmQgYWRkZWQgc29tZSBoZWF2eSBjcmVhbSwgYSBwaW5jaCBvZiB0YXJ0YXIsIFwiICtcbiAgICAgICAgICAgIFwic29tZSBhbmNob3Z5IHBhc3RlLCBiYXNpbCBhbmQgYSBoYWxmIHBpbnQgb2YgbWFwbGUgc3lydXAuIFRoZSBnbGFzcyBpbiB0aGUgZ2xhc3NlcyBzdGlsbCBjYW1lIG91dCBjcnVuY2h5IHRob3VnaC4gXCIgK1xuICAgICAgICAgICAgXCJJJ20gdGhpbmtpbmcgb2YgcnVubmluZyB0aGVtIHRocm91Z2ggYSBtaXhtdWxjaGVyIG5leHQgdGltZSBiZWZvcmUgdGhyb3dpbmcgZXZlcnl0aGluZyBpbiB0aGUgb3Zlbi5cIlxuICAgICAgICB9XG4gICAgXVxufSkiLCJhcHBcblxuICAgIC5jb25zdGFudCgncmF0aW5nQ29uZmlnJywge1xuICAgICAgICBtYXg6IDUsXG4gICAgfSlcblxuICAgIC5kaXJlY3RpdmUoJ3Jldmlld3N0YXInLCBbJ3JhdGluZ0NvbmZpZycsIGZ1bmN0aW9uKHJhdGluZ0NvbmZpZykge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgcmVzdHJpY3Q6ICdFQScsXG4gICAgICAgICAgICByZXBsYWNlOiB0cnVlLFxuICAgICAgICAgICAgc2NvcGU6IHtcbiAgICAgICAgICAgICAgICB2YWx1ZTogJz0nXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgY29udHJvbGxlcjogXCJwcm9kdWN0cmV2aWV3c2NvbnRyb2xsZXJcIixcbiAgICAgICAgICAgIHRlbXBsYXRlOiAnPGRpdiBpZD1cInNob3dtZVwiIG5nLW1vdXNlbGVhdmU9XCJyZXNldCgpXCI+PGkgaWQ9XCJzaG93bWVcIiBuZy1yZXBlYXQ9XCJudW1iZXIgaW4gcmFuZ2VcIiAnICtcbiAgICAgICAgICAgICAgICAnbmctbW91c2VlbnRlcj1cImVudGVyKG51bWJlcilcIiBuZy1jbGljaz1cImFzc2lnbihudW1iZXIpXCIgJyArXG4gICAgICAgICAgICAgICAgJ25nLWNsYXNzPVwie1xcJ2dseXBoaWNvbiBnbHlwaGljb24tc3RhciBpY29uLWdvbGRcXCc6IG51bWJlciA8PSB2YWwsICcgK1xuICAgICAgICAgICAgICAgICdcXCdnbHlwaGljb24gZ2x5cGhpY29uLXN0YXIgaWNvbi1ncmF5XFwnOiBudW1iZXIgPiB2YWx9XCI+PC9pPjwvZGl2PicsXG4gICAgICAgICAgICBsaW5rOiBmdW5jdGlvbihzY29wZSwgZWxlbWVudCwgYXR0cnMsIGluZGV4KSB7XG4gICAgICAgICAgICAgICAgdmFyIG1heFJhbmdlID0gYW5ndWxhci5pc0RlZmluZWQoYXR0cnMubWF4KSA/IHNjb3BlLiRldmFsKGF0dHJzLm1heCkgOiByYXRpbmdDb25maWcubWF4O1xuICAgICAgICAgICAgICAgIHNjb3BlLnJhbmdlID0gW107XG4gICAgICAgICAgICAgICAgZm9yKHZhciBpID0gMTsgaSA8PSBtYXhSYW5nZTsgaSsrICkge1xuICAgICAgICAgICAgICAgICAgICBzY29wZS5yYW5nZS5wdXNoKGkpO1xuICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICAgICBzY29wZS52YWwgPSBzY29wZS52YWx1ZTtcblxuICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2coc2NvcGUpO1xuXG5cbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICB9XSk7XG5cbmFwcC5jb250cm9sbGVyKCdwcm9kdWN0c3RhcicsIGZ1bmN0aW9uKCRzY29wZSkge1xuXG4gICAgJHNjb3BlLnJhdGUxID0gMDtcblxuICAgICRzY29wZS5yYXRlMiA9IDY7XG5cbiAgICAkc2NvcGUudmFsID0gJHNjb3BlLnJhdGluZztcblxufSk7IiwiJ3VzZSBzdHJpY3QnO1xuXG5hcHAucnVuKGZ1bmN0aW9uICgkY29va2llcywgJGNvb2tpZVN0b3JlKSB7XG5cblx0dmFyIGluaXQgPSAkY29va2llU3RvcmUuZ2V0KCdPcmRlcicpO1xuXHRpZighaW5pdCl7XG5cdFx0JGNvb2tpZVN0b3JlLnB1dCgnT3JkZXInLCBbXSk7XG5cdFx0Y29uc29sZS5sb2coJ3N0YXJ0aW5nIGNvb2tpZTogJywgJGNvb2tpZVN0b3JlLmdldCgnT3JkZXInKSk7XG5cdH1cblxufSk7XG5cbmFwcC5jb25maWcoZnVuY3Rpb24gKCRzdGF0ZVByb3ZpZGVyKSB7XG5cbiAgICAvLyBSZWdpc3RlciBvdXIgKml0ZW0qIHN0YXRlLlxuICAgICRzdGF0ZVByb3ZpZGVyLnN0YXRlKCdpdGVtJywge1xuICAgICAgICB1cmw6ICcvaXRlbS86bmFtZScsXG4gICAgICAgIGNvbnRyb2xsZXI6ICdpdGVtQ29udHJvbGxlcicsXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnanMvaXRlbS9pdGVtLmh0bWwnXG4gICAgfSk7XG5cbn0pO1xuXG5hcHAuY29udHJvbGxlcignaXRlbUNvbnRyb2xsZXInLCBmdW5jdGlvbiAoJHNjb3BlLCBHZXRJdGVtRmFjdG9yeSwgJHN0YXRlLCAkc3RhdGVQYXJhbXMsICRjb29raWVTdG9yZSwgQXV0aFNlcnZpY2UsIE9yZGVyRmFjdG9yeSApIHtcblxuXHQvL2dldCBpbnB1dCBmcm9tIHVzZXIgYWJvdXQgaXRlbSAoaWQgZnJvbSB1cmwgKVxuXHQvL2NoZWNrIGlkIHZzIGRhdGFiYXNlXG5cdC8vaWYgbm90IGZvdW5kLCByZWRpcmVjdCB0byBzZWFyY2ggcGFnZVxuXHQvL2lmIGZvdW5kIHNlbmQgdGVtcGFsYXRlVXJsXG5cblx0R2V0SXRlbUZhY3RvcnkuZ2V0SXRlbSgkc3RhdGVQYXJhbXMubmFtZSkudGhlbihmdW5jdGlvbihpdGVtLCBlcnIpe1xuXHRcdGlmKGVycikgJHN0YXRlLmdvKCdob21lJyk7XG5cdFx0ZWxzZXtcblx0XHRcdCRzY29wZS5pdGVtID0gaXRlbVswXTtcblx0XHRcdH1cblx0fSk7XG5cblx0JHNjb3BlLmFkZFRvT3JkZXIgPSBmdW5jdGlvbigpe1xuXHRcdFxuXHRcdEF1dGhTZXJ2aWNlLmlzQXV0aGVudGljYXRlZCgpLnRoZW4oZnVuY3Rpb24oYW5zd2VyKXtcblx0XHRcdHZhciBvcmRlciA9ICRjb29raWVzLmdldCgnT3JkZXInKTtcblx0XHRcdHZhciBsaW5lID0ge2l0ZW06ICRzY29wZS5pdGVtLCBxdWFudGl0eTogMX07XG5cdFx0XHRpZighb3JkZXIpe1xuXHRcdFx0XHQkY29va2llcy5wdXQoJ09yZGVyJywgbGluZSk7XG5cdFx0XHR9XG5cdFx0XHRlbHNle1xuXHRcdFx0XHRvcmRlci5wdXNoKGxpbmUpO1xuXHRcdFx0XHQkY29va2llcy5wdXQoJ09yZGVyJywgb3JkZXIpO1xuXHRcdFx0fVxuXG5cdFx0XHRpZihhbnN3ZXIpe1xuXHRcdFx0XHRPcmRlckZhY3RvcnkuYWRkSXRlbSgpXG5cdFx0XHR9XG5cdFx0fSlcblx0fVxufSk7IiwiJ3VzZSBzdHJpY3QnO1xuYXBwLmNvbmZpZyhmdW5jdGlvbiAoJHN0YXRlUHJvdmlkZXIpIHtcblxuICAgIC8vIFJlZ2lzdGVyIG91ciAqaXRlbUNyZWF0ZSogc3RhdGUuXG4gICAgJHN0YXRlUHJvdmlkZXIuc3RhdGUoJ2FkbWluLml0ZW1DcmVhdGUnLCB7XG4gICAgICAgIHVybDogJy9pdGVtQ3JlYXRlJyxcbiAgICAgICAgY29udHJvbGxlcjogJ2l0ZW1DcmVhdGVDb250cm9sbGVyJyxcbiAgICAgICAgdGVtcGxhdGVVcmw6ICdqcy9pdGVtQ3JlYXRlL2l0ZW1DcmVhdGUuaHRtbCdcbiAgICB9KTtcblxufSk7XG5cbmFwcC5jb250cm9sbGVyKCdpdGVtQ3JlYXRlQ29udHJvbGxlcicsIGZ1bmN0aW9uICgkc2NvcGUsIENyZWF0ZUl0ZW1GYWN0b3J5LCAkc3RhdGUsICRzdGF0ZVBhcmFtcykge1xuXG5cdCRzY29wZS5pdGVtID0ge1xuXHRcdGNhdGVnb3JpZXM6IFtdIH07XG5cdCRzY29wZS5zdWNjZXNzO1xuXG5cdCRzY29wZS5zdWJtaXRJdGVtID0gZnVuY3Rpb24oKSB7XG5cdFx0Ly8kc2NvcGUuaXRlbS5jYXRlZ29yaWVzID0gJHNjb3BlLml0ZW0uY2F0ZWdvcmllcy5zcGxpdCgnICcpO1xuXHRcdGNvbnNvbGUubG9nKCdwcm9jZXNzIHN0YXJ0ZWQnKTtcblx0XHRjb25zb2xlLmxvZygkc2NvcGUuaXRlbSk7XG5cdFx0Q3JlYXRlSXRlbUZhY3RvcnkucG9zdEl0ZW0oJHNjb3BlLml0ZW0pLnRoZW4oZnVuY3Rpb24oaXRlbSwgZXJyKXtcblx0XHRcdGlmKGVycikgJHNjb3BlLnN1Y2Nlc3M9IGZhbHNlO1xuXHRcdFx0ZWxzZXtcblx0XHRcdFx0Y29uc29sZS5sb2coaXRlbSk7XG5cdFx0XHRcdCRzY29wZS5zdWNjZXNzID0gdHJ1ZTtcblx0XHRcdFx0XG5cdFx0XHR9XG5cdFx0fSk7XG5cdH1cbn0pOyIsImFwcC5jb25maWcoZnVuY3Rpb24gKCRzdGF0ZVByb3ZpZGVyKSB7XG5cbiAgICAvLyBSZWdpc3RlciBvdXIgKkpvaW4gTm93KiBzdGF0ZS5cbiAgICAkc3RhdGVQcm92aWRlci5zdGF0ZSgnam9pbicsIHtcbiAgICAgICAgdXJsOiAnL2pvaW4nLFxuICAgICAgICBjb250cm9sbGVyOiAnam9pbkNvbnRyb2xsZXInLFxuXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnanMvam9pbm5vdy9qb2lubm93Lmh0bWwnIFxuXG4gICAgfSk7XG5cbn0pO1xuXG5cblxuYXBwLmNvbnRyb2xsZXIoJ2pvaW5Db250cm9sbGVyJywgZnVuY3Rpb24oJHNjb3BlLCAkd2luZG93LCBDcmVhdGVVc2VyRmFjdG9yeSwgQXV0aFNlcnZpY2UpIHtcblxuICAgICRzY29wZS5sb2dpbm9hdXRoID0gZnVuY3Rpb24gKHByb3ZpZGVyKSB7XG4gICAgICAgIHZhciBsb2NhdGlvbiA9ICdhdXRoLycgKyBwcm92aWRlcjtcbiAgICAgICAgJHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gbG9jYXRpb247XG4gICAgfVxuXG4gICAgJHNjb3BlLnN1Y2Nlc3M7XG5cblxuICAgICRzY29wZS5zdWJtaXRVc2VyID0gZnVuY3Rpb24oKSB7XG4gICAgXHRjb25zb2xlLmxvZyhcInVzZXIgc3VibWl0IHByb2Nlc3Mgc3RhcnRlZFwiKTtcbiAgICBcdGNvbnNvbGUubG9nKCRzY29wZS51c2VyKTtcblx0ICAgIENyZWF0ZVVzZXJGYWN0b3J5LnBvc3RVc2VyKCRzY29wZS51c2VyKS50aGVuKGZ1bmN0aW9uKHVzZXIsIGVycil7XG5cdCAgICBcdGlmIChlcnIpICRzY29wZS5zdWNjZXNzPWZhbHNlO1xuXHQgICAgXHRlbHNle1xuICAgICAgICAgICAgICAgIEF1dGhTZXJ2aWNlLmxvZ2luKHVzZXIpLnRoZW4oZnVuY3Rpb24oY29uY2x1c2lvbil7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHVzZXIpO1xuICAgICAgICAgICAgICAgICAgICAkc2NvcGUuc3VjY2VzcyA9IHRydWU7XG4gICAgICAgICAgICAgICAgfSk7XG5cdCAgICBcdH1cblx0ICAgIH0pO1xuXHQgIH1cblxuICAgICAgZnVuY3Rpb24gdmFsaWRhdGVQYXNzd29yZCAoZW1haWwpe1xuICAgICAgICByZWdleCA9IC9eKFtcXHctXFwuXStAKD8hZ21haWwuY29tKSg/IXlhaG9vLmNvbSkoPyFob3RtYWlsLmNvbSkoW1xcdy1dK1xcLikrW1xcdy1dezIsNH0pPyQvO1xuICAgICAgICByZXR1cm4gcmVnZXgudGVzdChlbWFpbCk7XG4gICAgICB9XG5cbn0pO1xuXG4iLCJhcHAuY29uZmlnKGZ1bmN0aW9uICgkc3RhdGVQcm92aWRlcikge1xuXG4gICAgLy8gUmVnaXN0ZXIgb3VyICpMb2dpbiogc3RhdGUuXG4gICAgJHN0YXRlUHJvdmlkZXIuc3RhdGUoJ2xvZ2luJywge1xuICAgICAgICB1cmw6ICcvbG9naW4nLFxuICAgICAgICBjb250cm9sbGVyOiAnbG9naW5Db250cm9sbGVyJyxcbiAgICAgICAgdGVtcGxhdGVVcmw6ICdqcy9sb2dpbi9sb2dpbi5odG1sJyBcbiAgICB9KTtcblxufSk7XG5cblxuYXBwLmNvbnRyb2xsZXIoJ2xvZ2luQ29udHJvbGxlcicsIGZ1bmN0aW9uICgkc2NvcGUsICR3aW5kb3csIEF1dGhTZXJ2aWNlLCAkc3RhdGUsIFNlc3Npb24sICRyb290U2NvcGUpIHtcbiAgICAkc2NvcGUubG9naW5vYXV0aCA9IGZ1bmN0aW9uIChwcm92aWRlcikge1xuICAgICAgICB2YXIgbG9jYXRpb24gPSAnYXV0aC8nICsgcHJvdmlkZXI7XG4gICAgICAgICR3aW5kb3cubG9jYXRpb24uaHJlZiA9IGxvY2F0aW9uO1xuICAgIH1cbiAgICAkc2NvcGUuc3VjY2VzcztcbiAgICAkc2NvcGUuc3VibWl0VXNlciA9IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgaW5mbyA9ICRzY29wZS51c2VyO1xuICAgICAgICBjb25zb2xlLmxvZyhcInVzZXIgbG9naW4gcHJvY2VzcyBzdGFydGVkIHdpdGg6IFwiLCBpbmZvKTtcbiAgICAgICAgQXV0aFNlcnZpY2UubG9naW4oaW5mbykudGhlbihmdW5jdGlvbihpbmZvKXtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiY29udHJvbGxlclwiLCBpbmZvKTtcbiAgICAgICAgICAgICAgICBpZiAoaW5mby5hZG1pbikge1xuICAgICAgICAgICAgICAgICAgICAkc3RhdGUuZ28oJ2FkbWluJylcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAkc3RhdGUuZ28oJ3Byb2R1Y3RzJylcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIC8vIHRoaXMgaXMganVzdCB0ZXN0aW5nIHNlc3Npb25zIHN0YXJ0ZWRcbiAgICAkc2NvcGUuaXNMb2dnZWRJbiA9IEF1dGhTZXJ2aWNlLmlzQXV0aGVudGljYXRlZCgpO1xuICAgIC8vIGVuZCB0ZXN0XG5cblxuXG4gICAgICAgIC8vIEdldFVzZXJGYWN0b3J5LmF1dGhVc2VyKGluZm8pLnRoZW4oZnVuY3Rpb24odXNlciwgZXJyKXtcbiAgICAgICAgLy8gICAgIGlmKGVycikgJHNjb3BlLnN1Y2Nlc3MgPSBmYWxzZTtcbiAgICAgICAgLy8gICAgIGVsc2Uge1xuICAgICAgICAvLyAgICAgICAgICRyb290U2NvcGUuc3VjY2VzcyA9IGZhbHNlO1xuICAgICAgICAvLyAgICAgICAgIGNvbnNvbGUubG9nKCRyb290U2NvcGUuY3VycmVudFVzZXIpXG4gICAgICAgIC8vICAgICAgICAgaWYgKHVzZXJbMF0uYWRtaW4pIHtcbiAgICAgICAgLy8gICAgICAgICAgICAgJHN0YXRlLmdvKCdhZG1pbicpXG4gICAgICAgIC8vICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gICAgICAgICAgICAgJHN0YXRlLmdvKCdob21lJylcbiAgICAgICAgLy8gICAgICAgICB9XG4gICAgICAgIC8vICAgICB9XG4gICAgICAgIC8vIH0pXHQgICBcblxuXHR9O1xufSk7XG4iLCIndXNlIHN0cmljdCc7XG5hcHAuY29uZmlnKGZ1bmN0aW9uICgkc3RhdGVQcm92aWRlcikge1xuXG4gICAgLy8gUmVnaXN0ZXIgb3VyICpvcmRlcnMqIHN0YXRlLlxuICAgICRzdGF0ZVByb3ZpZGVyLnN0YXRlKCdvcmRlcnMnLCB7XG4gICAgICAgIHVybDogJy9vcmRlci86bmFtZScsXG4gICAgICAgIGNvbnRyb2xsZXI6ICdvcmRlckNvbnRyb2xsZXInLFxuICAgICAgICB0ZW1wbGF0ZVVybDogJ2pzL29yZGVyL29yZGVyLmh0bWwnXG4gICAgfSk7XG5cbn0pO1xuXG5hcHAuY29udHJvbGxlcignb3JkZXJDb250cm9sbGVyJywgZnVuY3Rpb24gKCRzY29wZSwgT3JkZXJGYWN0b3J5LCAkc3RhdGUsICRzdGF0ZVBhcmFtcywgJGNvb2tpZVN0b3JlLCBBdXRoU2VydmljZSkge1xuXG5cdC8vcHJvdmlkZXMgZ2VuZXJhbCBmdW5jdGlvbmFsaXR5IHdpdGggYW4gb3JkZXJcblx0Ly92aWV3cyBjdXJyZW50IHVzZXIgb3JkZXJcblx0XHQvL29yZGVyIGlzIHNob3duIGJ5IGxpbmUgaXRlbVxuXHRcdC8vaGFzIGFiaWxpdHkgdG8gZWRpdCBvcmRlciwgb3IgcHJvY2VlZCB0byBjaGVja291dFxuXHQkc2NvcGUuYWN0aXZlb3JkZXJzPVtdO1xuXHQkc2NvcGUucGFzdG9yZGVycz1bXTtcblx0JHNjb3BlLnVzZXI7XG5cdCRzY29wZS5zdW0gPSAwO1xuXHQkc2NvcGUudG90YWxRdHkgPSAwOyBcblx0JHNjb3BlLnRlbXBWYWw7XG5cdCRzY29wZS5vcmRlcklkO1xuXHQkc2NvcGUudXNlcklkO1xuXHQkc2NvcGUuYXV0aDtcblxuXHRmdW5jdGlvbiBmaXJzdFVwZGF0ZSAoKXtcblx0Ly9jaGVjayBpZiB1c2VyIGlzIGF1dGhlbnRpY2F0ZWQsIHBvcHVsYXRlIG9yZGVyIGZyb20gZGIsIHNldCBvcmRlciB0byBjb29raWVcblx0XHRpZiggQXV0aFNlcnZpY2UuaXNBdXRoZW50aWNhdGVkKCkgKXtcblx0XHQvLyBpZiggNSApeyAvL2ZvcmNlIHVzZXIgaXMgYXV0aGVudGljYXRlZFxuXHRcdFx0QXV0aFNlcnZpY2UuZ2V0TG9nZ2VkSW5Vc2VyKCkudGhlbihmdW5jdGlvbih1c2VyKXtcblx0XHRcdCRzY29wZS51c2VySWQgPSB1c2VyLl9pZDtcblx0XHRcdC8vICRzY29wZS51c2VySWQgPSAnNTRmYjcyMmQ5NWM0MjhjMDQ2MTJiMWE1Jztcblx0XHRcdCRzY29wZS51c2VyID0gdXNlci5maXJzdF9uYW1lO1xuXHRcdFx0Ly8gJHNjb3BlLnVzZXIgPSAnRXZhbidcblx0XHRcdCRzY29wZS5hdXRoID0gdHJ1ZTtcblx0XHRcdFx0T3JkZXJGYWN0b3J5LmdldE9yZGVycygkc2NvcGUudXNlcklkKS50aGVuKGZ1bmN0aW9uKGl0ZW1zLCBlcnIpe1xuXHRcdFx0XHRcdGNvbnNvbGUubG9nKCdpdGVtcycsIGl0ZW1zKTtcblx0XHRcdFx0XHRpZiAoZXJyKSBjb25zb2xlLmxvZygnRXJyb3I6ICcsIGVycik7XG5cdFx0XHRcdFx0ZWxzZSBpZighaXRlbXMpIHsgLy9ubyBpdGVtcyBpbiBkQiwgZ2V0IGNvb2tpZXMsIHNldCBvcmRlclxuXHRcdFx0XHRcdFx0Ly9jb25zb2xlLmxvZygnTm8gY3VycmVudCBvcmRlciBpbiBEQicpOyAvL25vdCBzdXJlIHdoYXQgZWxzZSBuZWVkcyB0byBiZSBkZWNsYXJlZC5cblx0XHRcdFx0XHRcdCRzY29wZS5hY3RpdmVvcmRlcnMgPSAkY29va2llU3RvcmUuZ2V0KCdPcmRlcicpO1xuXHRcdFx0XHRcdFx0Ly9jb25zb2xlLmxvZygnY3VycmVudCBpdGVtcycsICRzY29wZS5hY3RpdmVvcmRlcnMpO1xuXHRcdFx0XHRcdFx0T3JkZXJGYWN0b3J5LmNyZWF0ZU9yZGVyKHt1c2VySWQ6ICRzY29wZS51c2VySWQsIGl0ZW1zOiAkc2NvcGUuYWN0aXZlb3JkZXJzfSwgZnVuY3Rpb24ocmVzcG9uc2Upe1xuXHRcdFx0XHRcdFx0XHQkc2NvcGUuYWN0aXZlb3JkZXJzID0gcmVzcG9uc2UubGluZWl0ZW1zO1xuXHRcdFx0XHRcdFx0XHRzdW0oKTtcblx0XHRcdFx0XHRcdFx0dG90YWxRdHkoKTtcblx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRlbHNlIHsgLy9pdGVtcyBpbiBkYiwgbWFrZSBzdXJlIGNvb2tpZXMgYXJlIGFkZGVkIHRvIGRiXG5cdFx0XHRcdFx0XHQkc2NvcGUuYWN0aXZlb3JkZXJzID0gaXRlbXMubGluZWl0ZW1zLmxpbmVJdGVtO1xuXHRcdFx0XHRcdFx0JHNjb3BlLm9yZGVySWQgPSBpdGVtcy5vcmRlcklkO1xuXHRcdFx0XHRcdFx0c3VtKCk7XG5cdFx0XHRcdFx0XHR0b3RhbFF0eSgpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSk7XG5cdFx0XHR9KTtcblx0XHR9XG5cdFx0ZWxzZSB7XG5cdFx0XHQkc2NvcGUuYWN0aXZlb3JkZXJzID0gJGNvb2tpZVN0b3JlLmdldCgnT3JkZXInKTtcblx0XHRcdCRzY29wZS51c2VyID0gJ1VzZXInO1xuXHRcdFx0JHNjb3BlLmF1dGggPSBmYWxzZTtcblx0XHRcdHN1bSgpO1xuXHRcdFx0dG90YWxRdHkoKTtcblx0XHR9XG5cdH07XG5cblx0Zmlyc3RVcGRhdGUoKTtcblxuXG5cdGZ1bmN0aW9uIHNlcnZlclVwZGF0ZSgpe1xuXG5cdH1cblxuXHRmdW5jdGlvbiB0b3RhbFF0eSAoKXtcblx0XHR2YXIgdG90YWxRID0gMDtcblx0XHRjb25zb2xlLmxvZygnZ290IHRvIHN1bScpO1xuXHRcdCRzY29wZS5hY3RpdmVvcmRlcnMuZm9yRWFjaChmdW5jdGlvbihsaW5lSXRlbSl7XG5cdFx0XHR0b3RhbFE9IHRvdGFsUSArIGxpbmVJdGVtLnF1YW50aXR5O1xuXHRcdH0pXG5cdFx0JHNjb3BlLnRvdGFsUXR5ID0gdG90YWxRO1xuXHR9O1xuXG5cdCRzY29wZS5yZW1vdmVJdGVtID0gZnVuY3Rpb24oaXRlbSl7XG5cdFx0Ly9yZW1vdmUgaXRlbSBmcm9tIGRiLCByZW1vdmUgaXRlbSBmcm9tIGNvb2tpZSwgcmVtb3ZlIGl0ZW0gZnJvbSBzY29wZVxuXHRcdC8vaWYgYXV0aGVudGljYXRlZCwgcmVtb3ZlIGl0ZW0gZnJvbSBvcmRlclxuXHRcdHZhciBteU9yZGVyQ29va2llID0gJGNvb2tpZVN0b3JlLmdldCgnT3JkZXInKTtcblx0XHR2YXIgbG9jYXRpb24gPSBnZXRMb2NJbkNvb2tpZShteU9yZGVyQ29va2llLCBpdGVtLl9pZCk7XG5cdFx0Ly92YXIgcmVtb3ZlZEl0ZW0gPSBteU9yZGVyQ29va2llLnNwbGljZShsb2NhdGlvbiwgMSk7XG5cdFx0Ly8kY29va2llU3RvcmUucHV0KCdPcmRlcicsIG15T3JkZXJDb29raWUpO1xuXHRcdC8vJHNjb3BlLmFjdGl2ZW9yZGVycyA9IG15T3JkZXJDb29raWU7XG5cdFx0Ly9zdW0oKTtcblx0XHQvL3RvdGFsUXR5KCk7XG5cblx0XHRpZihBdXRoU2VydmljZS5pc0F1dGhlbnRpY2F0ZWQoKSl7XG5cdFx0XHRPcmRlckZhY3RvcnkudXBkYXRlT3JkZXIoe29yZGVySWQ6ICRzY29wZS5vcmRlcklkLCBxdWFudGl0eTogMCwgaXRlbUlkOiBJdGVtLl9pZH0pLnRoZW4oZnVuY3Rpb24oZXJyLCBkYXRhKXtcblx0XHRcdFx0aWYoZXJyKSBjb25zb2xlLmxvZyhlcnIpO1xuXG5cdFx0XHR9KTtcblx0XHRcdCRzY29wZS5hdXRoID0gdHJ1ZTtcblx0XHR9XG5cdH1cblxuXHRmdW5jdGlvbiBnZXRMb2NJbkNvb2tpZSAoY29va2llLCBpZCl7XG5cdFx0dmFyIGxvYztcblx0XHRjb29raWUuZm9yRWFjaChmdW5jdGlvbihlbGVtZW50LCBpbmRleCl7XG5cdFx0XHRpZihlbGVtZW50Lml0ZW0uX2lkID09PSBpZCl7XG5cdFx0XHRcdGNvbnNvbGUubG9nKGVsZW1lbnQuaXRlbS5faWQsIFwiIGlzIHRoZSBjb3JyZWN0IGtleVwiKTtcblx0XHRcdFx0bG9jID0gaW5kZXg7XG5cdFx0XHR9XG5cdFx0fSk7XG5cdFx0cmV0dXJuIGxvYztcblx0fVxuXG5cdCRzY29wZS51cGRhdGVPcmRlciA9IGZ1bmN0aW9uKGl0ZW0sIHZhbCl7XG5cdFx0Ly90YWtlcyBpbiBpbmZvcm1hdGlvbiBhYm91dCB0aGUgdXNlciwgXG5cdFx0aWYodmFsID09IDApe1xuXHRcdFx0JHNjb3BlLnJlbW92ZUl0ZW0oaXRlbS5pdGVtKTtcblx0XHR9XG5cdFx0ZWxzZXtcblx0XHRcdGlmKCRzY29wZS51c2VySWQpe1xuXHRcdFx0XHRPcmRlckZhY3RvcnkudXBkYXRlT3JkZXIoe29yZGVySWQ6ICRzY29wZX0pO1xuXHRcdFx0fVxuXHRcdFx0dmFyIG9yZGVyQ29va2llID0gJGNvb2tpZVN0b3JlLmdldCgnT3JkZXInKTtcblx0XHRcdHZhciBpbmRleCA9IGdldExvY0luQ29va2llKG9yZGVyQ29va2llLCBpdGVtLml0ZW0uX2lkKTtcblx0XHRcdG9yZGVyQ29va2llW2luZGV4XS5xdWFudGl0eSA9IE51bWJlcih2YWwpO1xuXHRcdFx0JGNvb2tpZVN0b3JlLnB1dCgnT3JkZXInLCBvcmRlckNvb2tpZSk7XG5cdFx0XHQkc2NvcGUuYWN0aXZlb3JkZXJzID0gb3JkZXJDb29raWU7XG5cdFx0XHRzdW0oKTtcblx0XHRcdHRvdGFsUXR5KCk7XG5cdFx0fVxuXHRcdFxuXHR9OyBcblx0JHNjb3BlLm5ld051bWJlciA9IGZ1bmN0aW9uKGl0ZW0sIHZhbCl7XG5cdFx0Y29uc29sZS5sb2coJ2l0ZW0nLCBpdGVtLCAndmFsJywgdmFsKTtcblx0fVxuXHQvL2dldCB1c2VyIGluZm9ybWF0aW9uIGFuZCBzZW5kIElkXG5cblx0JHNjb3BlLnNob3dDb29raWUgPSBmdW5jdGlvbigpe1xuXHRcdGNvbnNvbGUubG9nKCRjb29raWVTdG9yZS5nZXQoJ09yZGVyJykpO1xuXHRcdCRzY29wZS5hY3RpdmVvcmRlcnMgPSAkY29va2llU3RvcmUuZ2V0KCdPcmRlcicpO1xuXHR9XG5cblx0JHNjb3BlLmRlbGV0ZUNvb2tpZSA9IGZ1bmN0aW9uKCl7XG5cdFx0JGNvb2tpZVN0b3JlLnJlbW92ZSgnT3JkZXInKTtcblx0XHRjb25zb2xlLmxvZygkY29va2llU3RvcmUuZ2V0KCdPcmRlcicpKTtcblx0fVxuXHQkc2NvcGUuc2hvd09yZGVyRnJvbURiID0gZnVuY3Rpb24oKXtcblx0XHQvL2NvbnNvbGUubG9nKEF1dGhTZXJ2aWNlLmlzQXV0aGVudGljYXRlZCgpKTtcblx0XHRpZigkc2NvcGUudXNlcklkKXtcblx0XHRcdE9yZGVyRmFjdG9yeS5nZXRPcmRlcnMoJHNjb3BlLnVzZXJJZCkudGhlbihmdW5jdGlvbihyZXN1bHQsIGVycil7XG5cdFx0XHRcdGNvbnNvbGUubG9nKCdyZXN1bHRzJywgcmVzdWx0LCdFcnJvcicsIGVycik7XG5cdFx0XHR9KVxuXHRcdH1cblx0XHRlbHNlIHtcblx0XHRcdGNvbnNvbGUubG9nKCdObyB1c2VyIGV4aXN0cycpO1xuXHRcdH1cblx0XHRcblx0fVxuXG5cdGZ1bmN0aW9uIHN1bSAoKXtcblx0XHR2YXIgdG90YWwgPSAwO1xuXHRcdGNvbnNvbGUubG9nKCdnb3QgdG8gc3VtJyk7XG5cdFx0JHNjb3BlLmFjdGl2ZW9yZGVycy5mb3JFYWNoKGZ1bmN0aW9uKGxpbmVJdGVtKXtcblx0XHRcdHRvdGFsPSB0b3RhbCArIGxpbmVJdGVtLml0ZW0ucHJpY2UgKiBsaW5lSXRlbS5xdWFudGl0eTtcblx0XHR9KVxuXHRcdCRzY29wZS5zdW0gPSB0b3RhbDtcblx0fTtcblx0XG59KTsiLCIndXNlIHN0cmljdCc7XG5hcHAuY29uZmlnKGZ1bmN0aW9uICgkc3RhdGVQcm92aWRlcikge1xuXG4gICAgXG4gICAgJHN0YXRlUHJvdmlkZXIuc3RhdGUoJ2FkbWluLm9yZGVyTW9kaWZ5Jywge1xuICAgICAgICB1cmw6ICcvb3JkZXJNb2RpZnknLFxuICAgICAgICB0ZW1wbGF0ZVVybDogJ2pzL29yZGVyTW9kaWZ5L29yZGVyTW9kaWZ5Lmh0bWwnLFxuICAgICAgICBjb250cm9sbGVyOiAnb3JkZXJNb2RpZnlDb250cm9sbGVyJ1xuICAgIH0pO1xuXG59KTtcblxuYXBwLmNvbnRyb2xsZXIoJ29yZGVyTW9kaWZ5Q29udHJvbGxlcicsIGZ1bmN0aW9uICgkc2NvcGUsIG9yZGVyTW9kaWZ5RmFjdG9yeSwgJHN0YXRlLCAkc3RhdGVQYXJhbXMsICRyb290U2NvcGUpIHtcblxuXHQkc2NvcGUuaXRlbSA9IHtcblx0XHRjYXRlZ29yaWVzOiBbXSB9O1xuXHQkc2NvcGUuc3VjY2VzcztcblxuXHQkc2NvcGUubWVudUl0ZW1zID0gW1xuXHRcdHsgbGFiZWw6ICdhbGwgb3JkZXJzJ30sXG4gICAgICAgIHsgbGFiZWw6ICdvcGVuJ30sXG4gICAgICAgIHsgbGFiZWw6ICdwbGFjZWQnfSxcbiAgICAgICAgeyBsYWJlbDogJ3NoaXBwZWQnfSxcbiAgICAgICAgeyBsYWJlbDogJ2NvbXBsZXRlJ31cbiAgICBdO1xuXG5cdCRzY29wZS5nZXRBbGxPcmRlcnMgPSBmdW5jdGlvbigpIHtcblx0XHQvLyRzY29wZS5pdGVtLmNhdGVnb3JpZXMgPSAkc2NvcGUuaXRlbS5jYXRlZ29yaWVzLnNwbGl0KCcgJyk7XG5cdFx0Y29uc29sZS5sb2coJ3Byb2Nlc3Mgc3RhcnRlZCcpO1xuXHRcdG9yZGVyTW9kaWZ5RmFjdG9yeS5nZXRBbGxPcmRlcnMoKS50aGVuKGZ1bmN0aW9uKGl0ZW0sIGVycil7XG5cdFx0XHRpZihlcnIpICRzY29wZS5zdWNjZXNzPSBmYWxzZTtcblx0XHRcdGVsc2V7XG5cdFx0XHRcdGNvbnNvbGUubG9nKGl0ZW0pO1xuXHRcdFx0XHQkc2NvcGUuaXRlbSA9IGl0ZW1cblx0XHRcdFx0JHNjb3BlLnN1Y2Nlc3MgPSB0cnVlO1xuXHRcdFx0XHRcblx0XHRcdH1cblx0XHR9KTtcblx0fVxuXHQkc2NvcGUuY2hhbmdlU3RhdHVzID0gZnVuY3Rpb24gKCkge1xuXG5cdH1cbn0pOyIsIid1c2Ugc3RyaWN0JztcbmFwcC5jb25maWcoZnVuY3Rpb24gKCRzdGF0ZVByb3ZpZGVyKSB7XG5cbiAgICAkc3RhdGVQcm92aWRlci5zdGF0ZSgnYWRtaW4ucHJvZHVjdENhdENyZWF0ZScsIHtcbiAgICAgICAgdXJsOiAnL3Byb2R1Y3RDYXRDcmVhdGUnLFxuICAgICAgICB0ZW1wbGF0ZVVybDogJ2pzL3Byb2R1Y3RDYXRDcmVhdGUvcHJvZHVjdENhdENyZWF0ZS5odG1sJ1xuICAgIH0pO1xuXG59KTsiLCJhcHAuY29uZmlnKGZ1bmN0aW9uICgkc3RhdGVQcm92aWRlcikge1xuXG4gICAgLy8gUmVnaXN0ZXIgb3VyICpSZXZpZXcgRW50cnkqIHN0YXRlLlxuICAgICRzdGF0ZVByb3ZpZGVyLnN0YXRlKCdyZXZpZXctZW50cnknLCB7XG4gICAgICAgIHVybDogJzpuYW1lLzp1cmwvcmV2aWV3LWVudHJ5JyxcbiAgICAgICAgY29udHJvbGxlcjogZnVuY3Rpb24oJHNjb3BlLCBDcmVhdGVSZXZpZXcsICRzdGF0ZSwgJHN0YXRlUGFyYW1zKSB7XG4gICAgICAgICAgICAkc2NvcGUucHJvZHVjdG5hbWUgPSAkc3RhdGVQYXJhbXMubmFtZTtcbiAgICAgICAgICAgICRzY29wZS5wcm9kdWN0dXJsID0gJHN0YXRlUGFyYW1zLnVybDtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiaW4gY29ucm9sbGVyXCIsICRzY29wZSk7XG5cbiAgICAgICAgICAgICRzY29wZS5uZXdSZXZpZXcgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBcdGNvbnNvbGUubG9nKFwiaW5zaWRlIG5ld1Jldmlld1wiLCAkc2NvcGUucHJvZHVjdG5hbWUpO1xuICAgICAgICAgICAgXHR2YXIgaW5mbyA9ICRzY29wZS5wcm9kdWN0bmFtZTtcbiAgICAgICAgICAgIFx0Q3JlYXRlUmV2aWV3LnN1Ym1pdFJldmlldyhpbmZvKS50aGVuKGZ1bmN0aW9uKHVzZXIsIGVycil7XG5cdCAgICBcdFx0XHRcdFx0aWYgKGVycikgJHNjb3BlLnN1Y2Nlc3MgPSBmYWxzZTtcblx0ICAgIFx0XHRcdFx0XHRcdGVsc2V7XG4gICAgICAgICAgICAgICAgICAgICRzdGF0ZS5nbygncHJvZHVjdHMnKTtcbiAgICAgICAgICAgICAgXHR9XG5cdCAgICBcdFx0XHRcdH0pXG5cdCAgIFx0XHRcdFx0fTtcbiAgICAgICAgIH0sXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnanMvcmV2aWV3LWVudHJ5L3Jldmlldy1lbnRyeS5odG1sJ1xuICAgIH0pXG5cbn0pO1xuXG5cbiIsImFwcFxuXG4gICAgLmNvbnN0YW50KCdyYXRpbmdDb25maWcnLCB7XG4gICAgICAgIG1heDogNSxcbiAgICB9KVxuXG4gICAgLmRpcmVjdGl2ZSgncmF0aW5nJywgWydyYXRpbmdDb25maWcnLCBmdW5jdGlvbihyYXRpbmdDb25maWcpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHJlc3RyaWN0OiAnRUEnLFxuICAgICAgICAgICAgcmVwbGFjZTogdHJ1ZSxcbiAgICAgICAgICAgIHNjb3BlOiB7XG4gICAgICAgICAgICAgICAgdmFsdWU6ICc9JyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB0ZW1wbGF0ZTogJzxzcGFuIG5nLW1vdXNlbGVhdmU9XCJyZXNldCgpXCI+PGkgbmctcmVwZWF0PVwibnVtYmVyIGluIHJhbmdlXCIgbmctbW91c2VlbnRlcj1cImVudGVyKG51bWJlcilcIiBuZy1jbGljaz1cImFzc2lnbihudW1iZXIpXCIgbmctY2xhc3M9XCJ7XFwnZ2x5cGhpY29uIGdseXBoaWNvbi1zdGFyIGljb24tZ29sZFxcJzogbnVtYmVyIDw9IHZhbCwgXFwnZ2x5cGhpY29uIGdseXBoaWNvbi1zdGFyIGljb24tZ3JheVxcJzogbnVtYmVyID4gdmFsfVwiPjwvaT48L3NwYW4+JyxcbiAgICAgICAgICAgIGxpbms6IGZ1bmN0aW9uKHNjb3BlLCBlbGVtZW50LCBhdHRycykge1xuICAgICAgICAgICAgICAgIHZhciBtYXhSYW5nZSA9IGFuZ3VsYXIuaXNEZWZpbmVkKGF0dHJzLm1heCkgPyBzY29wZS4kZXZhbChhdHRycy5tYXgpIDogcmF0aW5nQ29uZmlnLm1heDtcblxuICAgICAgICAgICAgICAgIHNjb3BlLnJhbmdlID0gW107XG4gICAgICAgICAgICAgICAgZm9yKHZhciBpID0gMTsgaSA8PSBtYXhSYW5nZTsgaSsrICkge1xuICAgICAgICAgICAgICAgICAgICBzY29wZS5yYW5nZS5wdXNoKGkpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHNjb3BlLiR3YXRjaCgndmFsdWUnLCBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICBzY29wZS52YWwgPSB2YWx1ZTtcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIHNjb3BlLmFzc2lnbiA9IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgIHNjb3BlLnZhbHVlID0gdmFsdWU7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgc2NvcGUuZW50ZXIgPSBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICBzY29wZS52YWwgPSB2YWx1ZTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBzY29wZS5yZXNldCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICBzY29wZS52YWwgPSBhbmd1bGFyLmNvcHkoc2NvcGUudmFsdWUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBzY29wZS5yZXNldCgpO1xuXG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgfV0pO1xuXG5hcHAuY29udHJvbGxlcignU3RhckN0cmwnLCBmdW5jdGlvbigkc2NvcGUpIHtcblxuICAgICRzY29wZS5yYXRlMSA9IDA7XG5cbiAgICAkc2NvcGUucmF0ZTIgPSA2O1xuXG59KTsiLCIndXNlIHN0cmljdCc7XG5hcHAuY29uZmlnKGZ1bmN0aW9uICgkc3RhdGVQcm92aWRlcikge1xuXG4gICAgLy8gUmVnaXN0ZXIgb3VyICphYm91dCogc3RhdGUuXG4gICAgJHN0YXRlUHJvdmlkZXIuc3RhdGUoJ3N0cmlwZScsIHtcbiAgICAgICAgdXJsOiAnL3N0cmlwZScsXG4gICAgICAgIGNvbnRyb2xsZXI6ICdTdHJpcGVDb250cm9sbGVyJyxcbiAgICAgICAgdGVtcGxhdGVVcmw6ICdqcy90ZXN0U3RyaXBlL3N0cmlwZS5odG1sJ1xuICAgIH0pO1xuXG59KTtcblxuYXBwLmNvbnRyb2xsZXIoJ1N0cmlwZUNvbnRyb2xsZXInLCBmdW5jdGlvbiAoJHNjb3BlKSB7XG5cbn0pOyIsIid1c2Ugc3RyaWN0JztcbmFwcC5jb25maWcoZnVuY3Rpb24gKCRzdGF0ZVByb3ZpZGVyKSB7XG5cbiAgICAkc3RhdGVQcm92aWRlci5zdGF0ZSgndHV0b3JpYWwnLCB7XG4gICAgICAgIHVybDogJy90dXRvcmlhbCcsXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnanMvdHV0b3JpYWwvdHV0b3JpYWwuaHRtbCcsXG4gICAgICAgIGNvbnRyb2xsZXI6ICdUdXRvcmlhbEN0cmwnLFxuICAgICAgICByZXNvbHZlOiB7XG4gICAgICAgICAgICB0dXRvcmlhbEluZm86IGZ1bmN0aW9uIChUdXRvcmlhbEZhY3RvcnkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gVHV0b3JpYWxGYWN0b3J5LmdldFR1dG9yaWFsVmlkZW9zKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9KTtcblxufSk7XG5cbmFwcC5mYWN0b3J5KCdUdXRvcmlhbEZhY3RvcnknLCBmdW5jdGlvbiAoJGh0dHApIHtcblxuICAgIHJldHVybiB7XG4gICAgICAgIGdldFR1dG9yaWFsVmlkZW9zOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KCcvYXBpL3R1dG9yaWFsL3ZpZGVvcycpLnRoZW4oZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlLmRhdGE7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH07XG5cbn0pO1xuXG5hcHAuY29udHJvbGxlcignVHV0b3JpYWxDdHJsJywgZnVuY3Rpb24gKCRzY29wZSwgdHV0b3JpYWxJbmZvKSB7XG5cbiAgICAkc2NvcGUuc2VjdGlvbnMgPSB0dXRvcmlhbEluZm8uc2VjdGlvbnM7XG4gICAgJHNjb3BlLnZpZGVvcyA9IF8uZ3JvdXBCeSh0dXRvcmlhbEluZm8udmlkZW9zLCAnc2VjdGlvbicpO1xuXG4gICAgJHNjb3BlLmN1cnJlbnRTZWN0aW9uID0geyBzZWN0aW9uOiBudWxsIH07XG5cbiAgICAkc2NvcGUuY29sb3JzID0gW1xuICAgICAgICAncmdiYSgzNCwgMTA3LCAyNTUsIDAuMTApJyxcbiAgICAgICAgJ3JnYmEoMjM4LCAyNTUsIDY4LCAwLjExKScsXG4gICAgICAgICdyZ2JhKDIzNCwgNTEsIDI1NSwgMC4xMSknLFxuICAgICAgICAncmdiYSgyNTUsIDE5MywgNzMsIDAuMTEpJyxcbiAgICAgICAgJ3JnYmEoMjIsIDI1NSwgMSwgMC4xMSknXG4gICAgXTtcblxuICAgICRzY29wZS5nZXRWaWRlb3NCeVNlY3Rpb24gPSBmdW5jdGlvbiAoc2VjdGlvbiwgdmlkZW9zKSB7XG4gICAgICAgIHJldHVybiB2aWRlb3MuZmlsdGVyKGZ1bmN0aW9uICh2aWRlbykge1xuICAgICAgICAgICAgcmV0dXJuIHZpZGVvLnNlY3Rpb24gPT09IHNlY3Rpb247XG4gICAgICAgIH0pO1xuICAgIH07XG5cbn0pOyIsIid1c2Ugc3RyaWN0JztcbmFwcC5jb25maWcoZnVuY3Rpb24gKCRzdGF0ZVByb3ZpZGVyKSB7XG5cdCRzdGF0ZVByb3ZpZGVyLnN0YXRlKCdhZG1pbi51c2VyTW9kaWZ5Jywge1xuICAgICAgICB1cmw6ICcvdXNlck1vZGlmeScsXG4gICAgICAgIGNvbnRyb2xsZXI6ICd1c2VyTW9kaWZ5Q29udHJvbGxlcicsXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnanMvdXNlck1vZGlmeS91c2VyTW9kaWZ5Lmh0bWwnXG4gICAgfSk7XG59KVxuXG5hcHAuY29udHJvbGxlcigndXNlck1vZGlmeUNvbnRyb2xsZXInLCBmdW5jdGlvbiAoJHNjb3BlLCB1c2VyTW9kaWZ5RmFjdG9yeSwgJHN0YXRlLCAkc3RhdGVQYXJhbXMsIEF1dGhTZXJ2aWNlKSB7XG5cbiAgICBcbiAgICAkc2NvcGUuc3VibWl0ID0ge1xuICAgICAgICBwYXNzd29yZDogJycsXG4gICAgICAgIGVtYWlsOiAnJyxcbiAgICAgICAgbWFrZUFkbWluOiBmYWxzZVxuICAgIH1cbiAgICAkc2NvcGUuc3VjY2VzcztcblxuXG4gICAgJHNjb3BlLmNoYW5nZVBXID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHVzZXJNb2RpZnlGYWN0b3J5LnBvc3RQVygkc2NvcGUuc3VibWl0KS50aGVuKGZ1bmN0aW9uKHVzZXIsIGVycil7XG4gICAgICAgICAgICAkc2NvcGUuc3VibWl0ID0ge31cbiAgICAgICAgICAgIGlmKGVycikge1xuICAgICAgICAgICAgICAgICRzY29wZS5zdWNjZXNzPSBmYWxzZTtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnY2hhbmdpbmcgc3RhdGUnKVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZXtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygkc2NvcGUuc3VibWl0KTtcbiAgICAgICAgICAgICAgICAkc2NvcGUuc3VjY2VzcyA9IHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH0gIFxufSk7IiwiJ3VzZSBzdHJpY3QnO1xuYXBwLmZhY3RvcnkoJ0NyZWF0ZUl0ZW1GYWN0b3J5JywgZnVuY3Rpb24oJGh0dHApe1xuXHRcblx0cmV0dXJuIHtcblx0XHRwb3N0SXRlbTogZnVuY3Rpb24oZGF0YSl7XG5cdFx0XHRjb25zb2xlLmxvZygnaW50byB0aGUgZmFjdG9yeScsIGRhdGEpO1xuXHRcdFx0Ly8gcmV0dXJuICRodHRwLnBvc3QoJy9hcGkvaXRlbScsIGRhdGEpO1xuXG5cdFx0XHRyZXR1cm4gJGh0dHAucG9zdCgnL2FwaS9hZG1pbi9pdGVtQ3JlYXRlJywgZGF0YSkudGhlbihmdW5jdGlvbihyZXNwb25zZSl7XG5cdFx0XHRcdHJldHVybiByZXNwb25zZS5kYXRhO1xuXHRcdFx0fSlcblx0XHR9XG5cdH1cblxufSkiLCIndXNlIHN0cmljdCc7XG5hcHAuZmFjdG9yeSgnQ3JlYXRlUmV2aWV3JywgZnVuY3Rpb24oJGh0dHApe1xuXHRcblx0cmV0dXJuIHtcblx0XHRzdWJtaXRSZXZpZXc6IGZ1bmN0aW9uKGRhdGEpe1xuXHRcdFx0Y29uc29sZS5sb2coJ2ludG8gcmV2aWV3IGZhY3RvcnknLCBkYXRhKTtcblx0XHRcdHJldHVybiAkaHR0cC5wb3N0KCcvYXBpL3Jldmlld3MvJysgZGF0YSkudGhlbihmdW5jdGlvbihyZXNwb25zZSl7XG5cdFx0XHRcdHJldHVybiByZXNwb25zZS5kYXRhO1xuXHRcdFx0fSlcblx0XHR9XG5cdH1cbn0pIiwiJ3VzZSBzdHJpY3QnO1xuYXBwLmZhY3RvcnkoJ0NyZWF0ZVVzZXJGYWN0b3J5JywgZnVuY3Rpb24oJGh0dHApe1xuXHRcblx0cmV0dXJuIHtcblx0XHRwb3N0VXNlcjogZnVuY3Rpb24oZGF0YSl7XG5cdFx0XHRjb25zb2xlLmxvZygnaW50byB1c2VyIGZhY3RvcnknLCBkYXRhKTtcblx0XHRcdHJldHVybiAkaHR0cC5wb3N0KCdhcGkvam9pbicsIGRhdGEpLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2Upe1xuXHRcdFx0XHRyZXR1cm4gcmVzcG9uc2UuZGF0YTtcblx0XHRcdH0pXG5cdFx0fVxuXHR9XG59KVxuXG4vLyAnL2FwaS9sb2dpbiciLCIndXNlIHN0cmljdCc7XG5hcHAuZmFjdG9yeSgnR2V0SXRlbUZhY3RvcnknLCBmdW5jdGlvbigkaHR0cCl7XG5cdFxuXHRyZXR1cm4ge1xuXHRcdGdldEl0ZW06IGZ1bmN0aW9uKGlkKXtcblx0XHRcdC8vdmFyIG9wdGlvbnMgPSB7ZW1haWw6IGVtYWlsfTtcblx0XHRcdGNvbnNvbGUubG9nKGlkKTtcblx0XHRcdHJldHVybiAkaHR0cC5nZXQoJy9hcGkvaXRlbS8nK2lkKS50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKXtcblx0XHRcdFx0cmV0dXJuIHJlc3BvbnNlLmRhdGE7XG5cdFx0XHR9KVxuXHRcdH0sXG5cblx0XHQvLyBnZXRDYXRlZ29yeUl0ZW1zOiBmdW5jdGlvbiAoKSB7XG5cdFx0Ly8gXHRjb25zb2xlLmxvZyhcIkdldEl0ZW1GYWN0b3J5OiBnZXRDYXRlZ29yeUl0ZW1zXCIsIGNhdGVnb3J5KTtcblx0XHQvLyBcdHJldHVybiAkaHR0cC5nZXQoJy9hcGkvaXRlbS8nKyBjYXRlZ29yeSkudGhlbihmdW5jdGlvbihyZXNwb25zZSl7XG5cdFx0Ly8gXHRcdHJldHVybiByZXNwb25zZS5kYXRhO1xuXHRcdC8vIFx0fSk7XG5cdFx0Ly8gfSxcblxuXHR9XG59KSIsIid1c2Ugc3RyaWN0JztcbmFwcC5mYWN0b3J5KCdHZXRJdGVtc0ZhY3RvcnknLCBmdW5jdGlvbigkaHR0cCl7XG5cbiAgICByZXR1cm4ge1xuICAgICAgICBnZXRJdGVtczogZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIHJldHVybiAkaHR0cC5nZXQoJy9hcGkvaXRlbWxpc3QnKS50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKXtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzcG9uc2UuZGF0YTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgIH1cblxuICAgIH1cbn0pIiwiJ3VzZSBzdHJpY3QnO1xuYXBwLmZhY3RvcnkoJ0dldFVzZXJGYWN0b3J5JywgZnVuY3Rpb24oJGh0dHApe1xuXHRcblx0cmV0dXJuIHtcblx0XHRnZXRVc2VyOiBmdW5jdGlvbih1c2VyKXtcblx0XHRcdGNvbnNvbGUubG9nKCdpbnNpZGUgZmFjdG9yIHdpdGg6ICcsIGVtYWlsKTtcblx0XHRcdC8vdmFyIG9wdGlvbnMgPSB7ZW1haWw6IGVtYWlsfTtcblx0XHRcdHJldHVybiAkaHR0cC5nZXQoJy9hcGkvbG9naW4vJyArIHVzZXIuZW1haWwpLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2Upe1xuXHRcdFx0XHRyZXR1cm4gcmVzcG9uc2UuZGF0YTtcblx0XHRcdH0pXG5cdFx0fSxcblx0XHRhdXRoVXNlcjogZnVuY3Rpb24oZGF0YSl7XG5cdFx0XHRyZXR1cm4gJGh0dHAucG9zdCgnL2xvZ2luJywgZGF0YSkudGhlbihmdW5jdGlvbihyZXNwb25zZSl7XG5cdFx0XHRcdGNvbnNvbGUubG9nKFwiZmFjdG9yeSBkb25lXCIpXG5cdFx0XHRcdHJldHVybiByZXNwb25zZS5kYXRhO1xuXHRcdFx0fSlcblx0XHR9XG5cdH1cbn0pXG5cbi8vICcvYXBpL2xvZ2luLycgKyBlbWFpbCIsIid1c2Ugc3RyaWN0JztcbmFwcC5mYWN0b3J5KCdPcmRlckZhY3RvcnknLCBmdW5jdGlvbigkaHR0cCl7XG5cdFxuXHRyZXR1cm4ge1xuXHRcdGNyZWF0ZU9yZGVyOiBmdW5jdGlvbihkYXRhKXsvLyBkYXRhIHNob3VsZCBiZSBpbiBmb3JtIHt1c2VySWQ6IHVzZXIuX2lkLCBpdGVtczogW2l0ZW06IGl0ZW0uX2lkLCBxdHk6IHF0eV19XG5cdFx0XHRjb25zb2xlLmxvZygnc2VuZGluZyBhIHJlcXVlc3QgZm9yIGEgbmV3IG9yZGVyIGZyb20gZmFjdG9yeScpO1xuXHRcdFx0cmV0dXJuICRodHRwLnBvc3QoJy9hcGkvb3JkZXInLCBkYXRhKS50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKXtcblx0XHRcdC8vY29uc29sZS5sb2coJ3Jlc3BvbnNlIGZyb20gY3JlYXRlT3JkZXIgZmFjdG9yeSByZXF1ZXN0JywgcmVzcG9uc2UpO1xuXHRcdFx0XHRyZXR1cm4gcmVzcG9uc2UuZGF0YTtcblx0XHRcdH0pXG5cdFx0fSxcblx0XHR1cGRhdGVPcmRlcjogZnVuY3Rpb24oZGF0YSl7IC8vZXhwZWN0cyBvcmRlcklkLCBpdGVtSWQsIGFuZCBxdWFudGl0eSAoY2FzZSBzZW5zYXRpdmUpXG5cdFx0XHRyZXR1cm4gJGh0dHAucG9zdCgnL2FwaS9vcmRlci9saW5laXRlbScsIGRhdGEpLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2Upe1xuXHRcdFx0XHRyZXR1cm4gcmVzcG9uc2UuZGF0YTtcblx0XHRcdH0pXG5cdFx0fSxcblx0XHRnZXRPcmRlcnM6IGZ1bmN0aW9uKHVzZXJJZCl7XG5cdFx0XHRyZXR1cm4gJGh0dHAuZ2V0KCcvYXBpL29yZGVyLycrdXNlcklkKS50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKXtcblx0XHRcdFx0Ly9jb25zb2xlLmxvZygncmVzcG9uc2UgZnJvbSBnZXRPcmRlcnMgZmFjdG9yeSByZXF1ZXN0JywgcmVzcG9uc2UpO1xuXHRcdFx0XHRyZXR1cm4gcmVzcG9uc2UuZGF0YTtcblx0XHRcdH0pO1xuXHRcdH1cblxufX0pOyIsIid1c2Ugc3RyaWN0JztcbmFwcC5mYWN0b3J5KCdSYW5kb21HcmVldGluZ3MnLCBmdW5jdGlvbiAoKSB7XG5cbiAgICB2YXIgZ2V0UmFuZG9tRnJvbUFycmF5ID0gZnVuY3Rpb24gKGFycikge1xuICAgICAgICByZXR1cm4gYXJyW01hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIGFyci5sZW5ndGgpXTtcbiAgICB9O1xuXG4gICAgdmFyIGdyZWV0aW5ncyA9IFtcbiAgICAgICAgJ0hlbGxvLCB3b3JsZCEnLFxuICAgICAgICAnQXQgbG9uZyBsYXN0LCBJIGxpdmUhJyxcbiAgICAgICAgJ0hlbGxvLCBzaW1wbGUgaHVtYW4uJyxcbiAgICAgICAgJ1doYXQgYSBiZWF1dGlmdWwgZGF5IScsXG4gICAgICAgICdJXFwnbSBsaWtlIGFueSBvdGhlciBwcm9qZWN0LCBleGNlcHQgdGhhdCBJIGFtIHlvdXJzLiA6KScsXG4gICAgICAgICdUaGlzIGVtcHR5IHN0cmluZyBpcyBmb3IgTGluZHNheSBMZXZpbmUuJ1xuICAgIF07XG5cbiAgICByZXR1cm4ge1xuICAgICAgICBncmVldGluZ3M6IGdyZWV0aW5ncyxcbiAgICAgICAgZ2V0UmFuZG9tR3JlZXRpbmc6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiBnZXRSYW5kb21Gcm9tQXJyYXkoZ3JlZXRpbmdzKTtcbiAgICAgICAgfVxuICAgIH07XG5cbn0pOyIsIid1c2Ugc3RyaWN0JztcbiIsImFwcC5mYWN0b3J5KCdhZG1pbk5hdmJhckZhY3RvcnknLCBmdW5jdGlvbiAobmF2YmFyTWVudSkge1xuXHRcdHZhciBuYXZiYXJNZW51SXRlbXMgPSBbXG4gICAgICAgIHsgbGFiZWw6ICdIb21lJywgc3RhdGU6ICdob21lJyB9LFxuICAgICAgICB7IGxhYmVsOiAnQ3JlYXRlIEl0ZW0nLCBzdGF0ZTogJ2l0ZW1DcmVhdGUnIH0sXG4gICAgICAgIHsgbGFiZWw6ICdNb2RpZnkgVXNlcicsIHN0YXRlOiAndXNlck1vZGlmeScgfVxuICAgIF07XG5cblx0cmV0dXJuIHtcblxuXHR9XG59KSIsIid1c2Ugc3RyaWN0J1xuYXBwLmZhY3RvcnkoJ2FkbWluUG9zdFVzZXInLCBmdW5jdGlvbiAoJGh0dHApIHtcblxuXHRyZXR1cm4ge1xuXHRcdHBvc3RJbmZvOiBmdW5jdGlvbiAoaW5wdXRzKSB7XG5cdFx0XHRyZXR1cm4gJGh0dHAucG9zdCgnYWRtaW4nLCBpbnB1dHMpXG5cdFx0fVxuXHR9XG59KSAiLCIndXNlIHN0cmljdCc7XG5hcHAuZmFjdG9yeSgnb3JkZXJNb2RpZnlGYWN0b3J5JywgZnVuY3Rpb24oJGh0dHApe1xuXHRcblx0cmV0dXJuIHtcblx0XHRtb2RpZnlPcmRlcjogZnVuY3Rpb24oZGF0YSl7XG5cdFx0XHRjb25zb2xlLmxvZygnaW50byB0aGUgZmFjdG9yeScsIGRhdGEpO1xuXHRcdFx0Ly8gcmV0dXJuICRodHRwLnBvc3QoJy9hcGkvaXRlbScsIGRhdGEpO1xuXG5cdFx0XHRyZXR1cm4gJGh0dHAucHV0KCcvYXBpL2FkbWluL29yZGVyJywgZGF0YSkudGhlbihmdW5jdGlvbihyZXNwb25zZSl7XG5cdFx0XHRcdHJldHVybiByZXNwb25zZS5kYXRhO1xuXHRcdFx0fSlcblx0XHR9LFxuXHRcdGdldEFsbE9yZGVyczogZnVuY3Rpb24oKXtcblx0XHRcdGNvbnNvbGUubG9nKCdpbnRvIHRoZSBmYWN0b3J5Jyk7XG5cdFx0XHQvLyByZXR1cm4gJGh0dHAucG9zdCgnL2FwaS9pdGVtJywgZGF0YSk7XG5cblx0XHRcdHJldHVybiAkaHR0cC5nZXQoJy9hcGkvYWRtaW4vb3JkZXInKS50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKXtcblx0XHRcdFx0cmV0dXJuIHJlc3BvbnNlLmRhdGE7XG5cdFx0XHR9KVxuXHRcdH0sXG5cdFx0Y2hhbmdlT3JkZXJTdGF0dXM6IGZ1bmN0aW9uICggKSB7XG5cdFx0XHRyZXR1cm4gJGh0dHAucHV0KCcvYXBpL2FkbWluL29yZGVyJykudGhlbihmdW5jdGlvbihyZXNwb25zZSl7XG5cdFx0XHRcdHJldHVybiByZXNwb25zZS5kYXRhO1xuXHRcdFx0fSlcdFxuXHRcdH1cblx0XHQvLyBnZXRVc2VyT3JkZXJzQnlFbWFpbDogZnVuY3Rpb24gKCkge1xuXHRcdC8vIFx0cmV0dXJuICRodHRwLnBvc3QoJy9hcGkvYWRtaW4vb3JkZXInKS50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKXtcblx0XHQvLyBcdFx0cmV0dXJuIHJlc3BvbnNlLmRhdGE7XG5cdFx0Ly8gXHR9KVxuXHRcdC8vIH1cblx0fVxuXG59KSIsIid1c2Ugc3RyaWN0JztcbmFwcC5mYWN0b3J5KCd1c2VyTW9kaWZ5RmFjdG9yeScsIGZ1bmN0aW9uKCRodHRwKXtcblx0XG5cdHJldHVybiB7XG5cdFx0cG9zdFBXOiBmdW5jdGlvbihkYXRhKXtcblx0XHRcdGNvbnNvbGUubG9nKCdpbnRvIHRoZSBmYWN0b3J5JywgZGF0YSk7XG5cdFx0XHQvLyByZXR1cm4gJGh0dHAucG9zdCgnL2FwaS9pdGVtJywgZGF0YSk7XG5cblx0XHRcdHJldHVybiAkaHR0cC5wb3N0KCcvYXBpL2FkbWluL3VzZXJNb2RpZnknLCBkYXRhKS50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKXtcblx0XHRcdFx0cmV0dXJuIHJlc3BvbnNlLmRhdGE7XG5cdFx0XHR9KVxuXHRcdH1cblx0fVxuXG59KSIsIid1c2Ugc3RyaWN0JztcblxuYXBwLmRpcmVjdGl2ZSgndHV0b3JpYWxTZWN0aW9uJywgZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB7XG4gICAgICAgIHJlc3RyaWN0OiAnRScsXG4gICAgICAgIHNjb3BlOiB7XG4gICAgICAgICAgICBuYW1lOiAnQCcsXG4gICAgICAgICAgICB2aWRlb3M6ICc9JyxcbiAgICAgICAgICAgIGJhY2tncm91bmQ6ICdAJ1xuICAgICAgICB9LFxuICAgICAgICB0ZW1wbGF0ZVVybDogJ2pzL3R1dG9yaWFsL3R1dG9yaWFsLXNlY3Rpb24vdHV0b3JpYWwtc2VjdGlvbi5odG1sJyxcbiAgICAgICAgbGluazogZnVuY3Rpb24gKHNjb3BlLCBlbGVtZW50KSB7XG4gICAgICAgICAgICBlbGVtZW50LmNzcyh7IGJhY2tncm91bmQ6IHNjb3BlLmJhY2tncm91bmQgfSk7XG4gICAgICAgIH1cbiAgICB9O1xufSk7IiwiJ3VzZSBzdHJpY3QnO1xuYXBwLmRpcmVjdGl2ZSgndHV0b3JpYWxTZWN0aW9uTWVudScsIGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgICByZXN0cmljdDogJ0UnLFxuICAgICAgICByZXF1aXJlOiAnbmdNb2RlbCcsXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnanMvdHV0b3JpYWwvdHV0b3JpYWwtc2VjdGlvbi1tZW51L3R1dG9yaWFsLXNlY3Rpb24tbWVudS5odG1sJyxcbiAgICAgICAgc2NvcGU6IHtcbiAgICAgICAgICAgIHNlY3Rpb25zOiAnPSdcbiAgICAgICAgfSxcbiAgICAgICAgbGluazogZnVuY3Rpb24gKHNjb3BlLCBlbGVtZW50LCBhdHRycywgbmdNb2RlbEN0cmwpIHtcblxuICAgICAgICAgICAgc2NvcGUuY3VycmVudFNlY3Rpb24gPSBzY29wZS5zZWN0aW9uc1swXTtcbiAgICAgICAgICAgIG5nTW9kZWxDdHJsLiRzZXRWaWV3VmFsdWUoc2NvcGUuY3VycmVudFNlY3Rpb24pO1xuXG4gICAgICAgICAgICBzY29wZS5zZXRTZWN0aW9uID0gZnVuY3Rpb24gKHNlY3Rpb24pIHtcbiAgICAgICAgICAgICAgICBzY29wZS5jdXJyZW50U2VjdGlvbiA9IHNlY3Rpb247XG4gICAgICAgICAgICAgICAgbmdNb2RlbEN0cmwuJHNldFZpZXdWYWx1ZShzZWN0aW9uKTtcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgfVxuICAgIH07XG59KTsiLCIndXNlIHN0cmljdCc7XG5hcHAuZGlyZWN0aXZlKCd0dXRvcmlhbFZpZGVvJywgZnVuY3Rpb24gKCRzY2UpIHtcblxuICAgIHZhciBmb3JtWW91dHViZVVSTCA9IGZ1bmN0aW9uIChpZCkge1xuICAgICAgICByZXR1cm4gJ2h0dHBzOi8vd3d3LnlvdXR1YmUuY29tL2VtYmVkLycgKyBpZDtcbiAgICB9O1xuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgcmVzdHJpY3Q6ICdFJyxcbiAgICAgICAgdGVtcGxhdGVVcmw6ICdqcy90dXRvcmlhbC90dXRvcmlhbC12aWRlby90dXRvcmlhbC12aWRlby5odG1sJyxcbiAgICAgICAgc2NvcGU6IHtcbiAgICAgICAgICAgIHZpZGVvOiAnPSdcbiAgICAgICAgfSxcbiAgICAgICAgbGluazogZnVuY3Rpb24gKHNjb3BlKSB7XG4gICAgICAgICAgICBzY29wZS50cnVzdGVkWW91dHViZVVSTCA9ICRzY2UudHJ1c3RBc1Jlc291cmNlVXJsKGZvcm1Zb3V0dWJlVVJMKHNjb3BlLnZpZGVvLnlvdXR1YmVJRCkpO1xuICAgICAgICB9XG4gICAgfTtcblxufSk7IiwiJ3VzZSBzdHJpY3QnO1xuYXBwLmRpcmVjdGl2ZSgncmFuZG9HcmVldGluZycsIGZ1bmN0aW9uIChSYW5kb21HcmVldGluZ3MpIHtcblxuICAgIHJldHVybiB7XG4gICAgICAgIHJlc3RyaWN0OiAnRScsXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnanMvY29tbW9uL2RpcmVjdGl2ZXMvcmFuZG8tZ3JlZXRpbmcvcmFuZG8tZ3JlZXRpbmcuaHRtbCcsXG4gICAgICAgIGxpbms6IGZ1bmN0aW9uIChzY29wZSkge1xuICAgICAgICAgICAgc2NvcGUuZ3JlZXRpbmcgPSBSYW5kb21HcmVldGluZ3MuZ2V0UmFuZG9tR3JlZXRpbmcoKTtcbiAgICAgICAgfVxuICAgIH07XG5cbn0pOyIsIid1c2Ugc3RyaWN0JztcbmFwcC5kaXJlY3RpdmUoJ25hdkRyb3Bkb3duJywgZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB7XG4gICAgICAgIHJlc3RyaWN0OiAnRScsXG4gICAgICAgIC8vc2NvcGU6IHtcbiAgICAgICAgLy8gICAgaXRlbXM6ICc9J1xuICAgICAgICAvL30sXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnanMvY29tbW9uL2RpcmVjdGl2ZXMvbmF2YmFyL25hdi1kcm9wZG93bi5odG1sJ1xuICAgICAgICAvL2NvbnRyb2xsZXI6ICdkcm9wZG93bkNvbnRyb2xsZXInXG4gICAgfTtcbn0pO1xuXG5hcHAuZGlyZWN0aXZlKCduYXZEcm9wZG93bldvbWVuJywgZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB7XG4gICAgICAgIHJlc3RyaWN0OiAnRScsXG4gICAgICAgIC8vc2NvcGU6IHtcbiAgICAgICAgLy8gICAgaXRlbXM6ICc9J1xuICAgICAgICAvL30sXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnanMvY29tbW9uL2RpcmVjdGl2ZXMvbmF2YmFyL25hdi1kcm9wZG93bi13b21lbi5odG1sJ1xuICAgICAgICAvL2NvbnRyb2xsZXI6ICdkcm9wZG93bkNvbnRyb2xsZXInXG4gICAgfTtcbn0pO1xuXG5hcHAuY29udHJvbGxlcignZHJvcGRvd25Db250cm9sbGVyJywgZnVuY3Rpb24gKCRzY29wZSwgR2V0SXRlbXNGYWN0b3J5LCAkc3RhdGUsICRzdGF0ZVBhcmFtcykge1xuXG4gICAgR2V0SXRlbXNGYWN0b3J5LmdldEl0ZW1zKCkudGhlbihmdW5jdGlvbihpdGVtcywgZXJyKXtcbiAgICAgICAgaWYoZXJyKSB0aHJvdyBlcnI7XG4gICAgICAgIGVsc2V7XG4gICAgICAgICAgICB2YXIgYWxsSXRlbXMgPSBpdGVtcztcbiAgICAgICAgICAgIC8vY29uc29sZS5sb2coYWxsSXRlbXMpO1xuICAgICAgICAgICAgdmFyIGRyb3BEb3duU29ydGVyID0gZnVuY3Rpb24gKGdlbmRlcikge1xuICAgICAgICAgICAgICAgIHZhciBzb3J0ZWRBcnJheSA9IFtdO1xuICAgICAgICAgICAgICAgIHZhciBzZWxlY3RlZE5hbWVzID0gW107XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgb2JqIGluIGFsbEl0ZW1zKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChzZWxlY3RlZE5hbWVzLmluZGV4T2YoYWxsSXRlbXNbb2JqXS5uYW1lKSA9PT0gLTEgJiYgYWxsSXRlbXNbb2JqXS5nZW5kZXIgPT0gZ2VuZGVyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLy8vY29uc29sZS5sb2coYWxsSXRlbXNbb2JqXS5uYW1lKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGVjdGVkTmFtZXMucHVzaChhbGxJdGVtc1tvYmpdLm5hbWUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgc29ydGVkQXJyYXkucHVzaChhbGxJdGVtc1tvYmpdKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gc29ydGVkQXJyYXk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAkc2NvcGUubWVuUHJvZHVjdHMxID0gZHJvcERvd25Tb3J0ZXIoJ21lbicpLnNsaWNlKDAsMyk7XG4gICAgICAgICAgICAkc2NvcGUubWVuUHJvZHVjdHMyID0gZHJvcERvd25Tb3J0ZXIoJ21lbicpLnNsaWNlKDMsNik7XG5cbiAgICAgICAgICAgICRzY29wZS53b21lblByb2R1Y3RzMSA9IGRyb3BEb3duU29ydGVyKCd3b21lbicpLnNsaWNlKDAsMyk7XG4gICAgICAgICAgICAkc2NvcGUud29tZW5Qcm9kdWN0czIgPSBkcm9wRG93blNvcnRlcignd29tZW4nKS5zbGljZSgzLDYpO1xuICAgICAgICAgICAgLy9jb25zb2xlLmxvZygkc2NvcGUubWVuUHJvZHVjdHMxLCAkc2NvcGUubWVuUHJvZHVjdHMyKTtcbiAgICAgICAgICAgIC8vY29uc29sZS5sb2coJHNjb3BlLndvbWVuUHJvZHVjdHMpO1xuXG4gICAgICAgICAgICAvLyBEcm9wZG93biBjb250cm9sc1xuICAgICAgICAgICAgJHNjb3BlLm1lblZpc2libGUgPSBmYWxzZTtcbiAgICAgICAgICAgICRzY29wZS53b21lblZpc2libGUgPSBmYWxzZTtcblxuICAgICAgICAgICAgJHNjb3BlLmhlbGxvID0gXCJ3ZWxsIGhlbGxvXCI7XG5cbiAgICAgICAgICAgICRzY29wZS50b2dnbGVNZW5WaXNpYmxlID0gZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygkc2NvcGUubWVuVmlzaWJsZSk7XG4gICAgICAgICAgICAgICAgaWYgKCRzY29wZS5tZW5WaXNpYmxlID09PSBmYWxzZSkge1xuICAgICAgICAgICAgICAgICAgICAkc2NvcGUubWVuVmlzaWJsZSA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2coXCJXYWhvb1wiKVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGVsc2UgJHNjb3BlLm1lblZpc2libGUgPSBmYWxzZTtcblxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAkc2NvcGUudG9nZ2xlV29tZW5WaXNpYmxlID0gZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKCRzY29wZS5tZW5WaXNpYmxlKTtcbiAgICAgICAgICAgICAgICBpZiAoJHNjb3BlLndvbWVuVmlzaWJsZSA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgJHNjb3BlLndvbWVuVmlzaWJsZSA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2coXCJXYWhvb1wiKVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGVsc2UgJHNjb3BlLndvbWVuVmlzaWJsZSA9IGZhbHNlO1xuXG4gICAgICAgICAgICB9XG5cblxuXG4gICAgICAgIH1cbiAgICB9KTtcblxufSk7IiwiJ3VzZSBzdHJpY3QnO1xuYXBwLmRpcmVjdGl2ZSgnbmF2YmFyJywgZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB7XG4gICAgICAgIHJlc3RyaWN0OiAnRScsXG5cbiAgICAgICAgLy9zY29wZToge1xuICAgICAgICAvLyAgaXRlbXM6ICc9J1xuICAgICAgICAvL30sXG5cbiAgICAgICAgdGVtcGxhdGVVcmw6ICdqcy9jb21tb24vZGlyZWN0aXZlcy9uYXZiYXIvbmF2YmFyLmh0bWwnXG4gICAgfTtcbn0pO1xuXG4vL2FwcC5kaXJlY3RpdmUoJ2hvdmVyZHJvcCcsIGZ1bmN0aW9uKCkge1xuLy9cbi8vICAgIHJldHVybiB7XG4vLyAgICAgICAgcmVzdHJpY3Q6ICdBJyxcbi8vICAgICAgICBsaW5rOiBmdW5jdGlvbiAoc2NvcGUsIGVsZW0sIGF0dHIpIHtcbi8vICAgICAgICAgICAgZWxlbS5vbignY2xpY2snLCBmdW5jdGlvbihsYWJlbCkge1xuLy8gICAgICAgICAgICAgICAgY29uc29sZS5sb2cobGFiZWwpXG4vLyAgICAgICAgICAgIH0pXG4vLyAgICAgICAgfVxuLy8gICAgfVxuLy99KVxuIiwiJ3VzZSBzdHJpY3QnO1xuYXBwLmRpcmVjdGl2ZSgnc3BlY3N0YWNrdWxhckxvZ28nLCBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgcmVzdHJpY3Q6ICdFJyxcbiAgICAgICAgdGVtcGxhdGVVcmw6ICdqcy9jb21tb24vZGlyZWN0aXZlcy9zcGVjc3RhY2t1bGFyLWxvZ28vc3BlY3N0YWNrdWxhci1sb2dvLmh0bWwnXG4gICAgfTtcbn0pOyJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==