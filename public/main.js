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
app.config(function ($stateProvider) {

    $stateProvider.state('products', {
        url: '/products',
        controller: 'allItemsController',
        templateUrl: 'js/allitems/allitems.html'
    })

});

app.controller('allItemsController', function ($scope, GetItemsFactory, $state, $stateParams) {

	GetItemsFactory.getItems().then(function(items, err){
		if(err) throw err;
		else{
			$scope.items = items;
		}
	});


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
app.config(function ($stateProvider) {

    // Register our *about* state.
    $stateProvider.state('item', {
        url: '/item/:name',
        controller: 'itemController',
        templateUrl: 'js/item/item.html'
    });

});

app.controller('itemController', function ($scope, GetItemFactory, $state, $stateParams, $cookiestore) {

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
		var order = $cookiestore.get('Order');
		var line = {item: $scope.item, qty: 1};
			if(!order){
				$cookiestore.put('Order', line);
			}
			else{
				order.push(line);
				$cookiestore.put('Order', order);
			}
	}
});
'use strict';
app.config(function ($stateProvider) {

    // Register our *about* state.
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



app.controller('joinController', function($scope, $window, CreateUserFactory) {

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
	    		console.log(user);
	    		$scope.success = true;
	    	}
	    });
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


app.controller('loginController', function ($scope, $window, GetUserFactory, $state, AuthService, Session, $rootScope) {
    $scope.loginoauth = function (provider) {
        var location = 'auth/' + provider;
        $window.location.href = location;
    }
    $scope.success;
    $scope.submitUser = function() {
        var info = $scope.user.email;
        console.log("user login process started with: ", info);
	    GetUserFactory.getUser(info).then(function(user, err){
	    	if (err) $scope.success = false;
	    	else{
                $rootScope.currentUser = user[0];
                console.log($rootScope.currentUser)
	    		if (user[0].admin) {
                    $state.go('admin')
                } else {
                    $state.go('home')
                }
	    	}
	    });
	}
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
	//
		if(AuthService.isAuthenticated()){
			AuthService.getLoggedInUser().then(function(user){
			$scope.userId = user._id;
			$scope.user = user.first_name;
			$scope.auth = true;
				OrderFactory.getOrders(user._id).then(function(items, err){
					if (err) console.log('Error: ', err);
					else if(!items) {
						console.log('No current order in DB'); //not sure what else needs to be declared.
						$scope.activeorders = $cookieStore.get('Order');
						$scope.prof = 'User';
					}
					else {
						$scope.activeorders = items.lineitems;
						$scope.orderId = items.orderId;

						var cookie = $cookieStore.get('Order');
						if(cookie){
							cookie.forEach(function(newItem){
								$scope.activeorders.push(newItem);
							});
						}
					}
				});
			});
		}
		else{
			$scope.activeorders = $cookieStore.get('Order');
			$scope.user = 'User';
			$scope.auth = false;
			sum();
			totalQty();
		}
	}

	firstUpdate();


	function serverUpdate(){

	}

	function totalQty (){
		var totalQ = 0;
		console.log('got to sum');
		$scope.activeorders.forEach(function(lineItem){
			totalQ= totalQ + lineItem.qty;
		})
		$scope.totalQty = totalQ;
	};

	$scope.removeItem = function(item){
		//remove item from db, remove item from cookie, remove item from scope
		//if authenticated, remove item from order
		var myOrderCookie = $cookieStore.get('Order');
		var location
		myOrderCookie.forEach(function(element, index){
			if(element.item.name === item.name){
				location = index;
			}
		});
		var removedItem = myOrderCookie.splice(location, 1);
		$cookieStore.put('Order', myOrderCookie);
		$scope.activeorders = myOrderCookie;
		sum();
		totalQty();

		if(AuthService.isAuthenticated()){
			OrderFactory.updateOrder({orderId: $scope.orderId, quantity: 0, itemId: Item._id}).then(function(err, data){
				if(err) console.log(err);

			});
			$scope.auth = true;
		}
	}

	$scope.updateOrder = function(){
		//takes in information about the user, 
		OrderFactory.updateOrder();

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
	

	function sum (){
		var total = 0;
		console.log('got to sum');
		$scope.activeorders.forEach(function(lineItem){
			total= total + lineItem.item.price * lineItem.qty;
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
        controller: function($scope, $state, $stateParams) {
            $scope.productname = $stateParams.name;
            $scope.producturl = $stateParams.url;
        },
        templateUrl: 'js/review-entry/review-entry.html'
    });

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
app.factory('CreateUserFactory', function($http){
	
	return {
		postUser: function(data){
			console.log('into user factory', data);
			return $http.post('/api/join', data).then(function(response){
				return response.data;
			})
		}
	}
})
'use strict';
app.factory('GetItemFactory', function($http){
	
	return {
		getItem: function(id){
			//var options = {email: email};
			return $http.get('/api/item/'+id).then(function(response){
				return response.data;
			})
		}
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
		getUser: function(email){
			console.log('inside factor with: ', email);
			//var options = {email: email};
			return $http.get('/api/login/' + email).then(function(response){
				return response.data;
			})
		}
	}
})
'use strict';
app.factory('OrderFactory', function($http){
	
	return {
		addItem: function(data){
			console.log('into the factory', data);
			// data should be in form {item: itemId, quantity: quantity, }

			return $http.post('/api/item/addToOrder', data).then(function(response){
				return response.data;
			})
		},
		updateOrder: function(data){
			return $http.post('/api/order/lineitem', data).then(function(response){
				return response.data;
			})
		},
		getOrders: function(){
			//if user is authenticated, check the server
			//if(req.session.user)
			if( 1 >= 6 ){
				return $http.get('/api/order').then(function(response){
					return response.data;
				})
			}
			else{
				return false; //get data from session
			}
		}



	};

})
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyIsImFib3V0L2Fib3V0LmpzIiwiYWRtaW4vYWRtaW4uanMiLCJhZG1pbi9pbmRleC5qcyIsImFsbEl0ZW1zL2FsbEl0ZW1zLmpzIiwiZnNhL2ZzYS1wcmUtYnVpbHQuanMiLCJob21lL2hvbWUuanMiLCJob21lL3Byb2R1Y3RyZXZpZXdzY29udHJvbGxlci5qcyIsImhvbWUvcmV2aWV3c3Rhci5qcyIsIml0ZW0vaXRlbS5qcyIsIml0ZW1DcmVhdGUvaXRlbUNyZWF0ZS5qcyIsImpvaW5ub3cvam9pbm5vdy5qcyIsImxvZ2luL2xvZ2luLmpzIiwib3JkZXIvb3JkZXIuanMiLCJvcmRlck1vZGlmeS9vcmRlck1vZGlmeS5qcyIsInByb2R1Y3RDYXRDcmVhdGUvcHJvZHVjdENhdENyZWF0ZS5qcyIsInJldmlldy1lbnRyeS9yZXZpZXctZW50cnkuanMiLCJyZXZpZXctZW50cnkvc3RhcnMuanMiLCJ0ZXN0U3RyaXBlL3N0cmlwZS5qcyIsInR1dG9yaWFsL3R1dG9yaWFsLmpzIiwidXNlck1vZGlmeS91c2VyTW9kaWZ5LmpzIiwiY29tbW9uL2ZhY3Rvcmllcy9DcmVhdGVJdGVtRmFjdG9yeS5qcyIsImNvbW1vbi9mYWN0b3JpZXMvQ3JlYXRlVXNlckZhY3RvcnkuanMiLCJjb21tb24vZmFjdG9yaWVzL0dldEl0ZW1GYWN0b3J5LmpzIiwiY29tbW9uL2ZhY3Rvcmllcy9HZXRJdGVtc0ZhY3RvcnkuanMiLCJjb21tb24vZmFjdG9yaWVzL0dldFVzZXJGYWN0b3J5LmpzIiwiY29tbW9uL2ZhY3Rvcmllcy9PcmRlckZhY3RvcnkuanMiLCJjb21tb24vZmFjdG9yaWVzL1JhbmRvbUdyZWV0aW5ncy5qcyIsImNvbW1vbi9mYWN0b3JpZXMvU29ja2V0LmpzIiwiY29tbW9uL2ZhY3Rvcmllcy9hZG1pbk5hdmJhckZhY3RvcnkuanMiLCJjb21tb24vZmFjdG9yaWVzL2FkbWluUG9zdFVzZXIuanMiLCJjb21tb24vZmFjdG9yaWVzL29yZGVyTW9kaWZ5RmFjdG9yeS5qcyIsImNvbW1vbi9mYWN0b3JpZXMvdXNlck1vZGlmeUZhY3RvcnkuanMiLCJ0dXRvcmlhbC90dXRvcmlhbC1zZWN0aW9uL3R1dG9yaWFsLXNlY3Rpb24uanMiLCJ0dXRvcmlhbC90dXRvcmlhbC1zZWN0aW9uLW1lbnUvdHV0b3JpYWwtc2VjdGlvbi1tZW51LmpzIiwidHV0b3JpYWwvdHV0b3JpYWwtdmlkZW8vdHV0b3JpYWwtdmlkZW8uanMiLCJjb21tb24vZGlyZWN0aXZlcy9uYXZiYXIvbmF2LWRyb3Bkb3duLmpzIiwiY29tbW9uL2RpcmVjdGl2ZXMvbmF2YmFyL25hdmJhci5qcyIsImNvbW1vbi9kaXJlY3RpdmVzL3JhbmRvLWdyZWV0aW5nL3JhbmRvLWdyZWV0aW5nLmpzIiwiY29tbW9uL2RpcmVjdGl2ZXMvc3BlY3N0YWNrdWxhci1sb2dvL3NwZWNzdGFja3VsYXItbG9nby5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDeEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3BCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3JCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNqSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNaQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMxQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMxQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3JDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDL0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3RDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNuQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDeklBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDMUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNqREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDZEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2pEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2pDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNkQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNYQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDWkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2xDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN2QkE7QUFDQTtBQ0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNWQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDaENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDZkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNyQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNsQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNyRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDaENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6Im1haW4uanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHN0cmljdCc7XG4vLyB2YXIgYXBwID0gYW5ndWxhci5tb2R1bGUoJ0Z1bGxzdGFja0dlbmVyYXRlZEFwcCcsIFsndWkucm91dGVyJywgJ2ZzYVByZUJ1aWx0J10pO1xudmFyIGFwcCA9IGFuZ3VsYXIubW9kdWxlKCdzcGVjU3RhY2t1bGFyJywgWyd1aS5yb3V0ZXInLCAnZnNhUHJlQnVpbHQnLCAnbmdDb29raWVzJ10pO1xuYXBwLmNvbnRyb2xsZXIoJ01haW5Db250cm9sbGVyJywgZnVuY3Rpb24gKCRzY29wZSwgJHJvb3RTY29wZSkge1xuXG4gICAgLy8gR2l2ZW4gdG8gdGhlIDxuYXZiYXI+IGRpcmVjdGl2ZSB0byBzaG93IHRoZSBtZW51LlxuICAgICRzY29wZS5tZW51SXRlbXMgPSBbXG4gICAgICAgIHsgbGFiZWw6ICdNZW4nLCBzdGF0ZTogJ21lbicgfSxcbiAgICAgICAgeyBsYWJlbDogJ1dvbWVuJywgc3RhdGU6ICd3b21lbicgfSxcbiAgICAgICAgeyBsYWJlbDogJ0pvaW4gdXMnLCBzdGF0ZTogJ2pvaW4nIH0sXG4gICAgICAgIHsgbGFiZWw6ICdMb2cgSW4nLCBzdGF0ZTogJ2xvZ2luJ30sXG4gICAgICAgIHsgbGFiZWw6ICdQcm9kdWN0IGxpc3QnLCBzdGF0ZTogJ3Byb2R1Y3RzJyB9LFxuICAgICAgICB7IGxhYmVsOiAnTXkgT3JkZXJzJywgc3RhdGU6ICdvcmRlcnMnfVxuICAgIF07XG4gICAgJHNjb3BlLmFkbWluSXRlbXM9IFtcbiAgICAgICAgeyBsYWJlbDogJ0NyZWF0ZSBwcm9kdWN0Jywgc3RhdGU6ICdhZG1pbi5pdGVtQ3JlYXRlJyB9LFxuICAgICAgICB7IGxhYmVsOiAnTW9kaWZ5IFVzZXInLCBzdGF0ZTogJ2FkbWluLnVzZXJNb2RpZnknfSxcbiAgICAgICAgeyBsYWJlbDogJ01vZGlmeSBPcmRlcicsIHN0YXRlOiAnYWRtaW4ub3JkZXJNb2RpZnknfSxcbiAgICAgICAgeyBsYWJlbDogJ0NyZWF0ZSBQcm9kdWN0IENhdCBQZycsIHN0YXRlOiAnYWRtaW4ucHJvZHVjdENhdENyZWF0ZSd9XG4gICAgXVxuXG5cblxuXG5cbn0pO1xuXG5cbmFwcC5jb25maWcoZnVuY3Rpb24gKCR1cmxSb3V0ZXJQcm92aWRlciwgJGxvY2F0aW9uUHJvdmlkZXIpIHtcbiAgICAvLyBUaGlzIHR1cm5zIG9mZiBoYXNoYmFuZyB1cmxzICgvI2Fib3V0KSBhbmQgY2hhbmdlcyBpdCB0byBzb21ldGhpbmcgbm9ybWFsICgvYWJvdXQpXG4gICAgJGxvY2F0aW9uUHJvdmlkZXIuaHRtbDVNb2RlKHRydWUpO1xuICAgIC8vIElmIHdlIGdvIHRvIGEgVVJMIHRoYXQgdWktcm91dGVyIGRvZXNuJ3QgaGF2ZSByZWdpc3RlcmVkLCBnbyB0byB0aGUgXCIvXCIgdXJsLlxuICAgICR1cmxSb3V0ZXJQcm92aWRlci5vdGhlcndpc2UoJy8nKTtcbn0pO1xuIiwiJ3VzZSBzdHJpY3QnO1xuYXBwLmNvbmZpZyhmdW5jdGlvbiAoJHN0YXRlUHJvdmlkZXIpIHtcblxuICAgIC8vIFJlZ2lzdGVyIG91ciAqYWJvdXQqIHN0YXRlLlxuICAgICRzdGF0ZVByb3ZpZGVyLnN0YXRlKCdhYm91dCcsIHtcbiAgICAgICAgdXJsOiAnL2Fib3V0JyxcbiAgICAgICAgY29udHJvbGxlcjogJ0Fib3V0Q29udHJvbGxlcicsXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnanMvYWJvdXQvYWJvdXQuaHRtbCdcbiAgICB9KTtcblxufSk7XG5cbmFwcC5jb250cm9sbGVyKCdBYm91dENvbnRyb2xsZXInLCBmdW5jdGlvbiAoJHNjb3BlKSB7XG5cbiAgICAvLyBJbWFnZXMgb2YgYmVhdXRpZnVsIEZ1bGxzdGFjayBwZW9wbGUuXG4gICAgJHNjb3BlLmltYWdlcyA9IFtcbiAgICAgICAgJ2h0dHBzOi8vcGJzLnR3aW1nLmNvbS9tZWRpYS9CN2dCWHVsQ0FBQVhRY0UuanBnOmxhcmdlJyxcbiAgICAgICAgJ2h0dHBzOi8vZmJjZG4tc3Bob3Rvcy1jLWEuYWthbWFpaGQubmV0L2hwaG90b3MtYWsteGFwMS90MzEuMC04LzEwODYyNDUxXzEwMjA1NjIyOTkwMzU5MjQxXzgwMjcxNjg4NDMzMTI4NDExMzdfby5qcGcnLFxuICAgICAgICAnaHR0cHM6Ly9wYnMudHdpbWcuY29tL21lZGlhL0ItTEtVc2hJZ0FFeTlTSy5qcGcnLFxuICAgICAgICAnaHR0cHM6Ly9wYnMudHdpbWcuY29tL21lZGlhL0I3OS1YN29DTUFBa3c3eS5qcGcnLFxuICAgICAgICAnaHR0cHM6Ly9wYnMudHdpbWcuY29tL21lZGlhL0ItVWo5Q09JSUFJRkFoMC5qcGc6bGFyZ2UnLFxuICAgICAgICAnaHR0cHM6Ly9wYnMudHdpbWcuY29tL21lZGlhL0I2eUl5RmlDRUFBcWwxMi5qcGc6bGFyZ2UnXG4gICAgXTtcblxufSk7IiwiJ3VzZSBzdHJpY3QnO1xuYXBwLmNvbmZpZyhmdW5jdGlvbiAoJHN0YXRlUHJvdmlkZXIpIHtcblxuICAgIFxuICAgICRzdGF0ZVByb3ZpZGVyLnN0YXRlKCdhZG1pbicsIHtcbiAgICAgICAgdXJsOiAnL2FkbWluJyxcbiAgICAgICAgdGVtcGxhdGVVcmw6ICdqcy9hZG1pbi9hZG1pbi5odG1sJ1xuICAgIH0pO1xuXG59KTtcblxuIiwiJ3VzZSBzdHJpY3QnO1xuYXBwLmNvbnRyb2xsZXIoJ0FkbWluQ29udHJvbGxlcicsIGZ1bmN0aW9uICgkc2NvcGUpIHtcblxuICAgIC8vIEdpdmVuIHRvIHRoZSA8bmF2YmFyPiBkaXJlY3RpdmUgdG8gc2hvdyB0aGUgbWVudS5cbiAgICAkc2NvcGUubWVudUl0ZW1zID0gW1xuICAgICAgICB7IGxhYmVsOiAnSG9tZScsIHN0YXRlOiAnaG9tZScgfSxcbiAgICAgICAgeyBsYWJlbDogJ0NyZWF0ZSBJdGVtJywgc3RhdGU6ICdpdGVtQ3JlYXRlJyB9LFxuICAgICAgICB7IGxhYmVsOiAnTW9kaWZ5IFVzZXInLCBzdGF0ZTogJ3VzZXJNb2RpZnknIH1cbiAgICBdO1xuXG59KTtcblxuYXBwLmRpcmVjdGl2ZSgnYWRtaW5OYXZiYXInLCBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgcmVzdHJpY3Q6ICdFJyxcbiAgICAgICAgc2NvcGU6IHtcbiAgICAgICAgICBpdGVtczogJz0nXG4gICAgICAgIH0sXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnanMvY29tbW9uL2RpcmVjdGl2ZXMvbmF2YmFyL25hdmJhci5odG1sJ1xuICAgIH07XG59KTsiLCIndXNlIHN0cmljdCc7XG5hcHAuY29uZmlnKGZ1bmN0aW9uICgkc3RhdGVQcm92aWRlcikge1xuXG4gICAgJHN0YXRlUHJvdmlkZXIuc3RhdGUoJ3Byb2R1Y3RzJywge1xuICAgICAgICB1cmw6ICcvcHJvZHVjdHMnLFxuICAgICAgICBjb250cm9sbGVyOiAnYWxsSXRlbXNDb250cm9sbGVyJyxcbiAgICAgICAgdGVtcGxhdGVVcmw6ICdqcy9hbGxpdGVtcy9hbGxpdGVtcy5odG1sJ1xuICAgIH0pXG5cbn0pO1xuXG5hcHAuY29udHJvbGxlcignYWxsSXRlbXNDb250cm9sbGVyJywgZnVuY3Rpb24gKCRzY29wZSwgR2V0SXRlbXNGYWN0b3J5LCAkc3RhdGUsICRzdGF0ZVBhcmFtcykge1xuXG5cdEdldEl0ZW1zRmFjdG9yeS5nZXRJdGVtcygpLnRoZW4oZnVuY3Rpb24oaXRlbXMsIGVycil7XG5cdFx0aWYoZXJyKSB0aHJvdyBlcnI7XG5cdFx0ZWxzZXtcblx0XHRcdCRzY29wZS5pdGVtcyA9IGl0ZW1zO1xuXHRcdH1cblx0fSk7XG5cblxufSk7IiwiKGZ1bmN0aW9uICgpIHtcblxuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIC8vIEhvcGUgeW91IGRpZG4ndCBmb3JnZXQgQW5ndWxhciEgRHVoLWRveS5cbiAgICBpZiAoIXdpbmRvdy5hbmd1bGFyKSB0aHJvdyBuZXcgRXJyb3IoJ0kgY2FuXFwndCBmaW5kIEFuZ3VsYXIhJyk7XG5cbiAgICB2YXIgYXBwID0gYW5ndWxhci5tb2R1bGUoJ2ZzYVByZUJ1aWx0JywgW10pO1xuXG4gICAgYXBwLmZhY3RvcnkoJ1NvY2tldCcsIGZ1bmN0aW9uICgkbG9jYXRpb24pIHtcblxuICAgICAgICBpZiAoIXdpbmRvdy5pbykgdGhyb3cgbmV3IEVycm9yKCdzb2NrZXQuaW8gbm90IGZvdW5kIScpO1xuXG4gICAgICAgIHZhciBzb2NrZXQ7XG5cbiAgICAgICAgaWYgKCRsb2NhdGlvbi4kJHBvcnQpIHtcbiAgICAgICAgICAgIHNvY2tldCA9IGlvKCdodHRwOi8vbG9jYWxob3N0OjEzMzcnKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHNvY2tldCA9IGlvKCcvJyk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gc29ja2V0O1xuXG4gICAgfSk7XG5cbiAgICBhcHAuY29uc3RhbnQoJ0FVVEhfRVZFTlRTJywge1xuICAgICAgICBsb2dpblN1Y2Nlc3M6ICdhdXRoLWxvZ2luLXN1Y2Nlc3MnLFxuICAgICAgICBsb2dpbkZhaWxlZDogJ2F1dGgtbG9naW4tZmFpbGVkJyxcbiAgICAgICAgbG9nb3V0U3VjY2VzczogJ2F1dGgtbG9nb3V0LXN1Y2Nlc3MnLFxuICAgICAgICBzZXNzaW9uVGltZW91dDogJ2F1dGgtc2Vzc2lvbi10aW1lb3V0JyxcbiAgICAgICAgbm90QXV0aGVudGljYXRlZDogJ2F1dGgtbm90LWF1dGhlbnRpY2F0ZWQnLFxuICAgICAgICBub3RBdXRob3JpemVkOiAnYXV0aC1ub3QtYXV0aG9yaXplZCdcbiAgICB9KTtcblxuICAgIGFwcC5jb25maWcoZnVuY3Rpb24gKCRodHRwUHJvdmlkZXIpIHtcbiAgICAgICAgJGh0dHBQcm92aWRlci5pbnRlcmNlcHRvcnMucHVzaChbXG4gICAgICAgICAgICAnJGluamVjdG9yJyxcbiAgICAgICAgICAgIGZ1bmN0aW9uICgkaW5qZWN0b3IpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gJGluamVjdG9yLmdldCgnQXV0aEludGVyY2VwdG9yJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIF0pO1xuICAgIH0pO1xuXG4gICAgYXBwLmZhY3RvcnkoJ0F1dGhJbnRlcmNlcHRvcicsIGZ1bmN0aW9uICgkcm9vdFNjb3BlLCAkcSwgQVVUSF9FVkVOVFMpIHtcbiAgICAgICAgdmFyIHN0YXR1c0RpY3QgPSB7XG4gICAgICAgICAgICA0MDE6IEFVVEhfRVZFTlRTLm5vdEF1dGhlbnRpY2F0ZWQsXG4gICAgICAgICAgICA0MDM6IEFVVEhfRVZFTlRTLm5vdEF1dGhvcml6ZWQsXG4gICAgICAgICAgICA0MTk6IEFVVEhfRVZFTlRTLnNlc3Npb25UaW1lb3V0LFxuICAgICAgICAgICAgNDQwOiBBVVRIX0VWRU5UUy5zZXNzaW9uVGltZW91dFxuICAgICAgICB9O1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgcmVzcG9uc2VFcnJvcjogZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICAgICAgJHJvb3RTY29wZS4kYnJvYWRjYXN0KHN0YXR1c0RpY3RbcmVzcG9uc2Uuc3RhdHVzXSwgcmVzcG9uc2UpO1xuICAgICAgICAgICAgICAgIHJldHVybiAkcS5yZWplY3QocmVzcG9uc2UpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgIH0pO1xuXG4gICAgYXBwLnNlcnZpY2UoJ0F1dGhTZXJ2aWNlJywgZnVuY3Rpb24gKCRodHRwLCBTZXNzaW9uLCAkcm9vdFNjb3BlLCBBVVRIX0VWRU5UUywgJHEpIHtcblxuICAgICAgICB2YXIgb25TdWNjZXNzZnVsTG9naW4gPSBmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgICAgICAgICAgIHZhciBkYXRhID0gcmVzcG9uc2UuZGF0YTtcbiAgICAgICAgICAgIFNlc3Npb24uY3JlYXRlKGRhdGEuaWQsIGRhdGEudXNlcik7XG4gICAgICAgICAgICAkcm9vdFNjb3BlLiRicm9hZGNhc3QoQVVUSF9FVkVOVFMubG9naW5TdWNjZXNzKTtcbiAgICAgICAgICAgIHJldHVybiBkYXRhLnVzZXI7XG4gICAgICAgIH07XG5cbiAgICAgICAgdGhpcy5nZXRMb2dnZWRJblVzZXIgPSBmdW5jdGlvbiAoKSB7XG5cbiAgICAgICAgICAgIGlmICh0aGlzLmlzQXV0aGVudGljYXRlZCgpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuICRxLndoZW4oeyB1c2VyOiBTZXNzaW9uLnVzZXIgfSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiAkaHR0cC5nZXQoJy9zZXNzaW9uJykudGhlbihvblN1Y2Nlc3NmdWxMb2dpbikuY2F0Y2goZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgfTtcblxuICAgICAgICB0aGlzLmxvZ2luID0gZnVuY3Rpb24gKGNyZWRlbnRpYWxzKSB7XG4gICAgICAgICAgICByZXR1cm4gJGh0dHAucG9zdCgnL2xvZ2luJywgY3JlZGVudGlhbHMpLnRoZW4ob25TdWNjZXNzZnVsTG9naW4pO1xuICAgICAgICB9O1xuXG4gICAgICAgIHRoaXMubG9nb3V0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuICRodHRwLmdldCgnL2xvZ291dCcpLnRoZW4oZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIFNlc3Npb24uZGVzdHJveSgpO1xuICAgICAgICAgICAgICAgICRyb290U2NvcGUuJGJyb2FkY2FzdChBVVRIX0VWRU5UUy5sb2dvdXRTdWNjZXNzKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuXG4gICAgICAgIHRoaXMuaXNBdXRoZW50aWNhdGVkID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuICEhU2Vzc2lvbi51c2VyO1xuICAgICAgICB9O1xuXG4gICAgfSk7XG5cbiAgICBhcHAuc2VydmljZSgnU2Vzc2lvbicsIGZ1bmN0aW9uICgkcm9vdFNjb3BlLCBBVVRIX0VWRU5UUykge1xuXG4gICAgICAgICRyb290U2NvcGUuJG9uKEFVVEhfRVZFTlRTLm5vdEF1dGhlbnRpY2F0ZWQsIHRoaXMuZGVzdHJveSk7XG4gICAgICAgICRyb290U2NvcGUuJG9uKEFVVEhfRVZFTlRTLnNlc3Npb25UaW1lb3V0LCB0aGlzLmRlc3Ryb3kpO1xuXG4gICAgICAgIHRoaXMuY3JlYXRlID0gZnVuY3Rpb24gKHNlc3Npb25JZCwgdXNlcikge1xuICAgICAgICAgICAgdGhpcy5pZCA9IHNlc3Npb25JZDtcbiAgICAgICAgICAgIHRoaXMudXNlciA9IHVzZXI7XG4gICAgICAgIH07XG5cbiAgICAgICAgdGhpcy5kZXN0cm95ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdGhpcy5pZCA9IG51bGw7XG4gICAgICAgICAgICB0aGlzLnVzZXIgPSBudWxsO1xuICAgICAgICB9O1xuXG4gICAgfSk7XG5cbn0pKCk7IiwiJ3VzZSBzdHJpY3QnO1xuYXBwLmNvbmZpZyhmdW5jdGlvbiAoJHN0YXRlUHJvdmlkZXIpIHtcblxuICAgICRzdGF0ZVByb3ZpZGVyLnN0YXRlKCdob21lJywge1xuICAgICAgICB1cmw6ICcvJyxcbiAgICAgICAgY29udHJvbGxlcjogJ0hvbWVDdHJsJyxcbiAgICAgICAgdGVtcGxhdGVVcmw6ICdqcy9ob21lL2hvbWUuaHRtbCdcbiAgICB9KTtcblxufSk7XG5cbmFwcC5jb250cm9sbGVyKCdIb21lQ3RybCcsIGZ1bmN0aW9uICgkc2NvcGUpIHtcbn0pOyIsImFwcC5jb250cm9sbGVyKCdwcm9kdWN0cmV2aWV3c2NvbnRyb2xsZXInLCBmdW5jdGlvbigkc2NvcGUpe1xuICAgICRzY29wZS5yYXRlMSA9IDA7XG5cbiAgICAkc2NvcGUucmF0ZTIgPSA2O1xuXG4gICAgJHNjb3BlLnJldmlld3NsaXN0ID0gW1xuICAgICAgICB7XG4gICAgICAgICAgICByYXRpbmc6IDUsXG4gICAgICAgICAgICB0ZXh0OiBcIlRoZXNlIGFyZSBxdWl0ZSBzaW1wbHkgdGhlIGJlc3QgZ2xhc3NlcywgbmF5IHRoZSBiZXN0IEFOWVRISU5HIEkndmUgZXZlciBvd25lZCEgXCIgK1xuICAgICAgICAgICAgXCJXaGVuIEkgcHV0IHRoZW0gb24sIGFuIGVuZXJneSBiZWFtIHNob290cyBvdXQgb2YgbXkgZXllYmFsbHMgdGhhdCBtYWtlcyBldmVyeXRoaW5nIEkgbG9vayBhdCBcIiArXG4gICAgICAgICAgICBcImJ1cnN0IGludG8gZmxhbWVzISEgTXkgZ2lybGZyaWVuZCBkb2Vzbid0IGFwcHJlY2lhdGUgaXQsIHRob3VnaC5cIlxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICByYXRpbmc6IDEsXG4gICAgICAgICAgICB0ZXh0OiBcIlRoZXNlIGdsYXNzZXMgYXJlIHRoZSB3b3JzdCEgV2hvIG1hZGUgdGhlc2U/IFdoZW4gSSBvcGVuZWQgdGhlIHBhY2thZ2UgdGhleSBzcHJ1bmcgb3V0IGFuZCBzdWNrZWQgXCIgK1xuICAgICAgICAgICAgXCJvbnRvIG15IGZhY2UgbGlrZSB0aGUgbW9uc3RlciBpbiBBTElFTiEgSSBoYWQgdG8gYmVhdCBteXNlbGYgaW4gdGhlIGhlYWQgd2l0aCBhIHNob3ZlbCB0byBnZXQgdGhlbSBvZmYhIFwiICtcbiAgICAgICAgICAgIFwiV2hvIEFSRSB5b3UgcGVvcGxlPyBXaGF0IGlzIHdyb25nIHdpdGggeW91PyBIYXZlIHlvdSBubyBkaWduaXR5PyBEb24ndCB5b3UgdW5kZXJzdGFuZCB3aGF0IGV5ZWdsYXNzZXMgYXJlIFwiICtcbiAgICAgICAgICAgIFwiRk9SP1wiXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIHJhdGluZzogNCxcbiAgICAgICAgICAgIHRleHQ6IFwiVGhlIGdsYXNzZXMgYXJlIGp1c3QgT0sg4oCUIHRvIHNwaWNlIHRoaW5ncyB1cCBJIGNob3BwZWQgdXAgc29tZSBzY2FsbGlvbnMgYW5kIGFkZGVkIHNvbWUgaGVhdnkgY3JlYW0sIGEgcGluY2ggb2YgdGFydGFyLCBcIiArXG4gICAgICAgICAgICBcInNvbWUgYW5jaG92eSBwYXN0ZSwgYmFzaWwgYW5kIGEgaGFsZiBwaW50IG9mIG1hcGxlIHN5cnVwLiBUaGUgZ2xhc3MgaW4gdGhlIGdsYXNzZXMgc3RpbGwgY2FtZSBvdXQgY3J1bmNoeSB0aG91Z2guIFwiICtcbiAgICAgICAgICAgIFwiSSdtIHRoaW5raW5nIG9mIHJ1bm5pbmcgdGhlbSB0aHJvdWdoIGEgbWl4bXVsY2hlciBuZXh0IHRpbWUgYmVmb3JlIHRocm93aW5nIGV2ZXJ5dGhpbmcgaW4gdGhlIG92ZW4uXCJcbiAgICAgICAgfVxuICAgIF1cbn0pIiwiYXBwXG5cbiAgICAuY29uc3RhbnQoJ3JhdGluZ0NvbmZpZycsIHtcbiAgICAgICAgbWF4OiA1LFxuICAgIH0pXG5cbiAgICAuZGlyZWN0aXZlKCdyZXZpZXdzdGFyJywgWydyYXRpbmdDb25maWcnLCBmdW5jdGlvbihyYXRpbmdDb25maWcpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHJlc3RyaWN0OiAnRUEnLFxuICAgICAgICAgICAgcmVwbGFjZTogdHJ1ZSxcbiAgICAgICAgICAgIHNjb3BlOiB7XG4gICAgICAgICAgICAgICAgdmFsdWU6ICc9J1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGNvbnRyb2xsZXI6IFwicHJvZHVjdHJldmlld3Njb250cm9sbGVyXCIsXG4gICAgICAgICAgICB0ZW1wbGF0ZTogJzxkaXYgaWQ9XCJzaG93bWVcIiBuZy1tb3VzZWxlYXZlPVwicmVzZXQoKVwiPjxpIGlkPVwic2hvd21lXCIgbmctcmVwZWF0PVwibnVtYmVyIGluIHJhbmdlXCIgJyArXG4gICAgICAgICAgICAgICAgJ25nLW1vdXNlZW50ZXI9XCJlbnRlcihudW1iZXIpXCIgbmctY2xpY2s9XCJhc3NpZ24obnVtYmVyKVwiICcgK1xuICAgICAgICAgICAgICAgICduZy1jbGFzcz1cIntcXCdnbHlwaGljb24gZ2x5cGhpY29uLXN0YXIgaWNvbi1nb2xkXFwnOiBudW1iZXIgPD0gdmFsLCAnICtcbiAgICAgICAgICAgICAgICAnXFwnZ2x5cGhpY29uIGdseXBoaWNvbi1zdGFyIGljb24tZ3JheVxcJzogbnVtYmVyID4gdmFsfVwiPjwvaT48L2Rpdj4nLFxuICAgICAgICAgICAgbGluazogZnVuY3Rpb24oc2NvcGUsIGVsZW1lbnQsIGF0dHJzLCBpbmRleCkge1xuICAgICAgICAgICAgICAgIHZhciBtYXhSYW5nZSA9IGFuZ3VsYXIuaXNEZWZpbmVkKGF0dHJzLm1heCkgPyBzY29wZS4kZXZhbChhdHRycy5tYXgpIDogcmF0aW5nQ29uZmlnLm1heDtcbiAgICAgICAgICAgICAgICBzY29wZS5yYW5nZSA9IFtdO1xuICAgICAgICAgICAgICAgIGZvcih2YXIgaSA9IDE7IGkgPD0gbWF4UmFuZ2U7IGkrKyApIHtcbiAgICAgICAgICAgICAgICAgICAgc2NvcGUucmFuZ2UucHVzaChpKTtcbiAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAgICAgc2NvcGUudmFsID0gc2NvcGUudmFsdWU7XG5cbiAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKHNjb3BlKTtcblxuXG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgfV0pO1xuXG5hcHAuY29udHJvbGxlcigncHJvZHVjdHN0YXInLCBmdW5jdGlvbigkc2NvcGUpIHtcblxuICAgICRzY29wZS5yYXRlMSA9IDA7XG5cbiAgICAkc2NvcGUucmF0ZTIgPSA2O1xuXG4gICAgJHNjb3BlLnZhbCA9ICRzY29wZS5yYXRpbmc7XG5cbn0pOyIsIid1c2Ugc3RyaWN0JztcbmFwcC5jb25maWcoZnVuY3Rpb24gKCRzdGF0ZVByb3ZpZGVyKSB7XG5cbiAgICAvLyBSZWdpc3RlciBvdXIgKmFib3V0KiBzdGF0ZS5cbiAgICAkc3RhdGVQcm92aWRlci5zdGF0ZSgnaXRlbScsIHtcbiAgICAgICAgdXJsOiAnL2l0ZW0vOm5hbWUnLFxuICAgICAgICBjb250cm9sbGVyOiAnaXRlbUNvbnRyb2xsZXInLFxuICAgICAgICB0ZW1wbGF0ZVVybDogJ2pzL2l0ZW0vaXRlbS5odG1sJ1xuICAgIH0pO1xuXG59KTtcblxuYXBwLmNvbnRyb2xsZXIoJ2l0ZW1Db250cm9sbGVyJywgZnVuY3Rpb24gKCRzY29wZSwgR2V0SXRlbUZhY3RvcnksICRzdGF0ZSwgJHN0YXRlUGFyYW1zLCAkY29va2llc3RvcmUpIHtcblxuXHQvL2dldCBpbnB1dCBmcm9tIHVzZXIgYWJvdXQgaXRlbSAoaWQgZnJvbSB1cmwgKVxuXHQvL2NoZWNrIGlkIHZzIGRhdGFiYXNlXG5cdC8vaWYgbm90IGZvdW5kLCByZWRpcmVjdCB0byBzZWFyY2ggcGFnZVxuXHQvL2lmIGZvdW5kIHNlbmQgdGVtcGFsYXRlVXJsXG5cblx0R2V0SXRlbUZhY3RvcnkuZ2V0SXRlbSgkc3RhdGVQYXJhbXMubmFtZSkudGhlbihmdW5jdGlvbihpdGVtLCBlcnIpe1xuXHRcdGlmKGVycikgJHN0YXRlLmdvKCdob21lJyk7XG5cdFx0ZWxzZXtcblx0XHRcdCRzY29wZS5pdGVtID0gaXRlbVswXTtcblx0XHRcdH1cblx0fSk7XG5cblx0JHNjb3BlLmFkZFRvT3JkZXIgPSBmdW5jdGlvbigpe1xuXHRcdHZhciBvcmRlciA9ICRjb29raWVzdG9yZS5nZXQoJ09yZGVyJyk7XG5cdFx0dmFyIGxpbmUgPSB7aXRlbTogJHNjb3BlLml0ZW0sIHF0eTogMX07XG5cdFx0XHRpZighb3JkZXIpe1xuXHRcdFx0XHQkY29va2llc3RvcmUucHV0KCdPcmRlcicsIGxpbmUpO1xuXHRcdFx0fVxuXHRcdFx0ZWxzZXtcblx0XHRcdFx0b3JkZXIucHVzaChsaW5lKTtcblx0XHRcdFx0JGNvb2tpZXN0b3JlLnB1dCgnT3JkZXInLCBvcmRlcik7XG5cdFx0XHR9XG5cdH1cbn0pOyIsIid1c2Ugc3RyaWN0JztcbmFwcC5jb25maWcoZnVuY3Rpb24gKCRzdGF0ZVByb3ZpZGVyKSB7XG5cbiAgICAvLyBSZWdpc3RlciBvdXIgKmFib3V0KiBzdGF0ZS5cbiAgICAkc3RhdGVQcm92aWRlci5zdGF0ZSgnYWRtaW4uaXRlbUNyZWF0ZScsIHtcbiAgICAgICAgdXJsOiAnL2l0ZW1DcmVhdGUnLFxuICAgICAgICBjb250cm9sbGVyOiAnaXRlbUNyZWF0ZUNvbnRyb2xsZXInLFxuICAgICAgICB0ZW1wbGF0ZVVybDogJ2pzL2l0ZW1DcmVhdGUvaXRlbUNyZWF0ZS5odG1sJ1xuICAgIH0pO1xuXG59KTtcblxuYXBwLmNvbnRyb2xsZXIoJ2l0ZW1DcmVhdGVDb250cm9sbGVyJywgZnVuY3Rpb24gKCRzY29wZSwgQ3JlYXRlSXRlbUZhY3RvcnksICRzdGF0ZSwgJHN0YXRlUGFyYW1zKSB7XG5cblx0JHNjb3BlLml0ZW0gPSB7XG5cdFx0Y2F0ZWdvcmllczogW10gfTtcblx0JHNjb3BlLnN1Y2Nlc3M7XG5cblx0JHNjb3BlLnN1Ym1pdEl0ZW0gPSBmdW5jdGlvbigpIHtcblx0XHQvLyRzY29wZS5pdGVtLmNhdGVnb3JpZXMgPSAkc2NvcGUuaXRlbS5jYXRlZ29yaWVzLnNwbGl0KCcgJyk7XG5cdFx0Y29uc29sZS5sb2coJ3Byb2Nlc3Mgc3RhcnRlZCcpO1xuXHRcdGNvbnNvbGUubG9nKCRzY29wZS5pdGVtKTtcblx0XHRDcmVhdGVJdGVtRmFjdG9yeS5wb3N0SXRlbSgkc2NvcGUuaXRlbSkudGhlbihmdW5jdGlvbihpdGVtLCBlcnIpe1xuXHRcdFx0aWYoZXJyKSAkc2NvcGUuc3VjY2Vzcz0gZmFsc2U7XG5cdFx0XHRlbHNle1xuXHRcdFx0XHRjb25zb2xlLmxvZyhpdGVtKTtcblx0XHRcdFx0JHNjb3BlLnN1Y2Nlc3MgPSB0cnVlO1xuXHRcdFx0XHRcblx0XHRcdH1cblx0XHR9KTtcblx0fVxufSk7IiwiYXBwLmNvbmZpZyhmdW5jdGlvbiAoJHN0YXRlUHJvdmlkZXIpIHtcblxuICAgIC8vIFJlZ2lzdGVyIG91ciAqSm9pbiBOb3cqIHN0YXRlLlxuICAgICRzdGF0ZVByb3ZpZGVyLnN0YXRlKCdqb2luJywge1xuICAgICAgICB1cmw6ICcvam9pbicsXG4gICAgICAgIGNvbnRyb2xsZXI6ICdqb2luQ29udHJvbGxlcicsXG5cbiAgICAgICAgdGVtcGxhdGVVcmw6ICdqcy9qb2lubm93L2pvaW5ub3cuaHRtbCcgXG5cbiAgICB9KTtcblxufSk7XG5cblxuXG5hcHAuY29udHJvbGxlcignam9pbkNvbnRyb2xsZXInLCBmdW5jdGlvbigkc2NvcGUsICR3aW5kb3csIENyZWF0ZVVzZXJGYWN0b3J5KSB7XG5cbiAgICAkc2NvcGUubG9naW5vYXV0aCA9IGZ1bmN0aW9uIChwcm92aWRlcikge1xuICAgICAgICB2YXIgbG9jYXRpb24gPSAnYXV0aC8nICsgcHJvdmlkZXI7XG4gICAgICAgICR3aW5kb3cubG9jYXRpb24uaHJlZiA9IGxvY2F0aW9uO1xuICAgIH1cblxuICAgICRzY29wZS5zdWNjZXNzO1xuXG5cbiAgICAkc2NvcGUuc3VibWl0VXNlciA9IGZ1bmN0aW9uKCkge1xuICAgIFx0Y29uc29sZS5sb2coXCJ1c2VyIHN1Ym1pdCBwcm9jZXNzIHN0YXJ0ZWRcIik7XG4gICAgXHRjb25zb2xlLmxvZygkc2NvcGUudXNlcik7XG5cdCAgICBDcmVhdGVVc2VyRmFjdG9yeS5wb3N0VXNlcigkc2NvcGUudXNlcikudGhlbihmdW5jdGlvbih1c2VyLCBlcnIpe1xuXHQgICAgXHRpZiAoZXJyKSAkc2NvcGUuc3VjY2Vzcz1mYWxzZTtcblx0ICAgIFx0ZWxzZXtcblx0ICAgIFx0XHRjb25zb2xlLmxvZyh1c2VyKTtcblx0ICAgIFx0XHQkc2NvcGUuc3VjY2VzcyA9IHRydWU7XG5cdCAgICBcdH1cblx0ICAgIH0pO1xuXHQgIH1cbn0pO1xuXG4iLCJhcHAuY29uZmlnKGZ1bmN0aW9uICgkc3RhdGVQcm92aWRlcikge1xuXG4gICAgLy8gUmVnaXN0ZXIgb3VyICpKb2luIE5vdyogc3RhdGUuXG4gICAgJHN0YXRlUHJvdmlkZXIuc3RhdGUoJ2xvZ2luJywge1xuICAgICAgICB1cmw6ICcvbG9naW4nLFxuICAgICAgICBjb250cm9sbGVyOiAnbG9naW5Db250cm9sbGVyJyxcbiAgICAgICAgdGVtcGxhdGVVcmw6ICdqcy9sb2dpbi9sb2dpbi5odG1sJyBcbiAgICB9KTtcblxufSk7XG5cblxuYXBwLmNvbnRyb2xsZXIoJ2xvZ2luQ29udHJvbGxlcicsIGZ1bmN0aW9uICgkc2NvcGUsICR3aW5kb3csIEdldFVzZXJGYWN0b3J5LCAkc3RhdGUsIEF1dGhTZXJ2aWNlLCBTZXNzaW9uLCAkcm9vdFNjb3BlKSB7XG4gICAgJHNjb3BlLmxvZ2lub2F1dGggPSBmdW5jdGlvbiAocHJvdmlkZXIpIHtcbiAgICAgICAgdmFyIGxvY2F0aW9uID0gJ2F1dGgvJyArIHByb3ZpZGVyO1xuICAgICAgICAkd2luZG93LmxvY2F0aW9uLmhyZWYgPSBsb2NhdGlvbjtcbiAgICB9XG4gICAgJHNjb3BlLnN1Y2Nlc3M7XG4gICAgJHNjb3BlLnN1Ym1pdFVzZXIgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGluZm8gPSAkc2NvcGUudXNlci5lbWFpbDtcbiAgICAgICAgY29uc29sZS5sb2coXCJ1c2VyIGxvZ2luIHByb2Nlc3Mgc3RhcnRlZCB3aXRoOiBcIiwgaW5mbyk7XG5cdCAgICBHZXRVc2VyRmFjdG9yeS5nZXRVc2VyKGluZm8pLnRoZW4oZnVuY3Rpb24odXNlciwgZXJyKXtcblx0ICAgIFx0aWYgKGVycikgJHNjb3BlLnN1Y2Nlc3MgPSBmYWxzZTtcblx0ICAgIFx0ZWxzZXtcbiAgICAgICAgICAgICAgICAkcm9vdFNjb3BlLmN1cnJlbnRVc2VyID0gdXNlclswXTtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygkcm9vdFNjb3BlLmN1cnJlbnRVc2VyKVxuXHQgICAgXHRcdGlmICh1c2VyWzBdLmFkbWluKSB7XG4gICAgICAgICAgICAgICAgICAgICRzdGF0ZS5nbygnYWRtaW4nKVxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICRzdGF0ZS5nbygnaG9tZScpXG4gICAgICAgICAgICAgICAgfVxuXHQgICAgXHR9XG5cdCAgICB9KTtcblx0fVxufSk7XG4iLCIndXNlIHN0cmljdCc7XG5hcHAuY29uZmlnKGZ1bmN0aW9uICgkc3RhdGVQcm92aWRlcikge1xuXG4gICAgLy8gUmVnaXN0ZXIgb3VyICpvcmRlcnMqIHN0YXRlLlxuICAgICRzdGF0ZVByb3ZpZGVyLnN0YXRlKCdvcmRlcnMnLCB7XG4gICAgICAgIHVybDogJy9vcmRlci86bmFtZScsXG4gICAgICAgIGNvbnRyb2xsZXI6ICdvcmRlckNvbnRyb2xsZXInLFxuICAgICAgICB0ZW1wbGF0ZVVybDogJ2pzL29yZGVyL29yZGVyLmh0bWwnXG4gICAgfSk7XG5cbn0pO1xuXG5hcHAuY29udHJvbGxlcignb3JkZXJDb250cm9sbGVyJywgZnVuY3Rpb24gKCRzY29wZSwgT3JkZXJGYWN0b3J5LCAkc3RhdGUsICRzdGF0ZVBhcmFtcywgJGNvb2tpZVN0b3JlLCBBdXRoU2VydmljZSkge1xuXG5cdC8vcHJvdmlkZXMgZ2VuZXJhbCBmdW5jdGlvbmFsaXR5IHdpdGggYW4gb3JkZXJcblx0Ly92aWV3cyBjdXJyZW50IHVzZXIgb3JkZXJcblx0XHQvL29yZGVyIGlzIHNob3duIGJ5IGxpbmUgaXRlbVxuXHRcdC8vaGFzIGFiaWxpdHkgdG8gZWRpdCBvcmRlciwgb3IgcHJvY2VlZCB0byBjaGVja291dFxuXHQkc2NvcGUuYWN0aXZlb3JkZXJzPVtdO1xuXHQkc2NvcGUucGFzdG9yZGVycz1bXTtcblx0JHNjb3BlLnVzZXI7XG5cdCRzY29wZS5zdW0gPSAwO1xuXHQkc2NvcGUudG90YWxRdHkgPSAwOyBcblx0JHNjb3BlLnRlbXBWYWw7XG5cdCRzY29wZS5vcmRlcklkO1xuXHQkc2NvcGUudXNlcklkO1xuXHQkc2NvcGUuYXV0aDtcblxuXHRmdW5jdGlvbiBmaXJzdFVwZGF0ZSAoKXtcblx0Ly9jaGVjayBpZiB1c2VyIGlzIGF1dGhlbnRpY2F0ZWQsIHBvcHVsYXRlIG9yZGVyIGZyb20gZGIsIHNldCBvcmRlciB0byBjb29raWVcblx0Ly9cblx0XHRpZihBdXRoU2VydmljZS5pc0F1dGhlbnRpY2F0ZWQoKSl7XG5cdFx0XHRBdXRoU2VydmljZS5nZXRMb2dnZWRJblVzZXIoKS50aGVuKGZ1bmN0aW9uKHVzZXIpe1xuXHRcdFx0JHNjb3BlLnVzZXJJZCA9IHVzZXIuX2lkO1xuXHRcdFx0JHNjb3BlLnVzZXIgPSB1c2VyLmZpcnN0X25hbWU7XG5cdFx0XHQkc2NvcGUuYXV0aCA9IHRydWU7XG5cdFx0XHRcdE9yZGVyRmFjdG9yeS5nZXRPcmRlcnModXNlci5faWQpLnRoZW4oZnVuY3Rpb24oaXRlbXMsIGVycil7XG5cdFx0XHRcdFx0aWYgKGVycikgY29uc29sZS5sb2coJ0Vycm9yOiAnLCBlcnIpO1xuXHRcdFx0XHRcdGVsc2UgaWYoIWl0ZW1zKSB7XG5cdFx0XHRcdFx0XHRjb25zb2xlLmxvZygnTm8gY3VycmVudCBvcmRlciBpbiBEQicpOyAvL25vdCBzdXJlIHdoYXQgZWxzZSBuZWVkcyB0byBiZSBkZWNsYXJlZC5cblx0XHRcdFx0XHRcdCRzY29wZS5hY3RpdmVvcmRlcnMgPSAkY29va2llU3RvcmUuZ2V0KCdPcmRlcicpO1xuXHRcdFx0XHRcdFx0JHNjb3BlLnByb2YgPSAnVXNlcic7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGVsc2Uge1xuXHRcdFx0XHRcdFx0JHNjb3BlLmFjdGl2ZW9yZGVycyA9IGl0ZW1zLmxpbmVpdGVtcztcblx0XHRcdFx0XHRcdCRzY29wZS5vcmRlcklkID0gaXRlbXMub3JkZXJJZDtcblxuXHRcdFx0XHRcdFx0dmFyIGNvb2tpZSA9ICRjb29raWVTdG9yZS5nZXQoJ09yZGVyJyk7XG5cdFx0XHRcdFx0XHRpZihjb29raWUpe1xuXHRcdFx0XHRcdFx0XHRjb29raWUuZm9yRWFjaChmdW5jdGlvbihuZXdJdGVtKXtcblx0XHRcdFx0XHRcdFx0XHQkc2NvcGUuYWN0aXZlb3JkZXJzLnB1c2gobmV3SXRlbSk7XG5cdFx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSk7XG5cdFx0XHR9KTtcblx0XHR9XG5cdFx0ZWxzZXtcblx0XHRcdCRzY29wZS5hY3RpdmVvcmRlcnMgPSAkY29va2llU3RvcmUuZ2V0KCdPcmRlcicpO1xuXHRcdFx0JHNjb3BlLnVzZXIgPSAnVXNlcic7XG5cdFx0XHQkc2NvcGUuYXV0aCA9IGZhbHNlO1xuXHRcdFx0c3VtKCk7XG5cdFx0XHR0b3RhbFF0eSgpO1xuXHRcdH1cblx0fVxuXG5cdGZpcnN0VXBkYXRlKCk7XG5cblxuXHRmdW5jdGlvbiBzZXJ2ZXJVcGRhdGUoKXtcblxuXHR9XG5cblx0ZnVuY3Rpb24gdG90YWxRdHkgKCl7XG5cdFx0dmFyIHRvdGFsUSA9IDA7XG5cdFx0Y29uc29sZS5sb2coJ2dvdCB0byBzdW0nKTtcblx0XHQkc2NvcGUuYWN0aXZlb3JkZXJzLmZvckVhY2goZnVuY3Rpb24obGluZUl0ZW0pe1xuXHRcdFx0dG90YWxRPSB0b3RhbFEgKyBsaW5lSXRlbS5xdHk7XG5cdFx0fSlcblx0XHQkc2NvcGUudG90YWxRdHkgPSB0b3RhbFE7XG5cdH07XG5cblx0JHNjb3BlLnJlbW92ZUl0ZW0gPSBmdW5jdGlvbihpdGVtKXtcblx0XHQvL3JlbW92ZSBpdGVtIGZyb20gZGIsIHJlbW92ZSBpdGVtIGZyb20gY29va2llLCByZW1vdmUgaXRlbSBmcm9tIHNjb3BlXG5cdFx0Ly9pZiBhdXRoZW50aWNhdGVkLCByZW1vdmUgaXRlbSBmcm9tIG9yZGVyXG5cdFx0dmFyIG15T3JkZXJDb29raWUgPSAkY29va2llU3RvcmUuZ2V0KCdPcmRlcicpO1xuXHRcdHZhciBsb2NhdGlvblxuXHRcdG15T3JkZXJDb29raWUuZm9yRWFjaChmdW5jdGlvbihlbGVtZW50LCBpbmRleCl7XG5cdFx0XHRpZihlbGVtZW50Lml0ZW0ubmFtZSA9PT0gaXRlbS5uYW1lKXtcblx0XHRcdFx0bG9jYXRpb24gPSBpbmRleDtcblx0XHRcdH1cblx0XHR9KTtcblx0XHR2YXIgcmVtb3ZlZEl0ZW0gPSBteU9yZGVyQ29va2llLnNwbGljZShsb2NhdGlvbiwgMSk7XG5cdFx0JGNvb2tpZVN0b3JlLnB1dCgnT3JkZXInLCBteU9yZGVyQ29va2llKTtcblx0XHQkc2NvcGUuYWN0aXZlb3JkZXJzID0gbXlPcmRlckNvb2tpZTtcblx0XHRzdW0oKTtcblx0XHR0b3RhbFF0eSgpO1xuXG5cdFx0aWYoQXV0aFNlcnZpY2UuaXNBdXRoZW50aWNhdGVkKCkpe1xuXHRcdFx0T3JkZXJGYWN0b3J5LnVwZGF0ZU9yZGVyKHtvcmRlcklkOiAkc2NvcGUub3JkZXJJZCwgcXVhbnRpdHk6IDAsIGl0ZW1JZDogSXRlbS5faWR9KS50aGVuKGZ1bmN0aW9uKGVyciwgZGF0YSl7XG5cdFx0XHRcdGlmKGVycikgY29uc29sZS5sb2coZXJyKTtcblxuXHRcdFx0fSk7XG5cdFx0XHQkc2NvcGUuYXV0aCA9IHRydWU7XG5cdFx0fVxuXHR9XG5cblx0JHNjb3BlLnVwZGF0ZU9yZGVyID0gZnVuY3Rpb24oKXtcblx0XHQvL3Rha2VzIGluIGluZm9ybWF0aW9uIGFib3V0IHRoZSB1c2VyLCBcblx0XHRPcmRlckZhY3RvcnkudXBkYXRlT3JkZXIoKTtcblxuXHR9OyBcblx0JHNjb3BlLm5ld051bWJlciA9IGZ1bmN0aW9uKGl0ZW0sIHZhbCl7XG5cdFx0Y29uc29sZS5sb2coJ2l0ZW0nLCBpdGVtLCAndmFsJywgdmFsKTtcblx0fVxuXHQvL2dldCB1c2VyIGluZm9ybWF0aW9uIGFuZCBzZW5kIElkXG5cblx0JHNjb3BlLnNob3dDb29raWUgPSBmdW5jdGlvbigpe1xuXHRcdGNvbnNvbGUubG9nKCRjb29raWVTdG9yZS5nZXQoJ09yZGVyJykpO1xuXHRcdCRzY29wZS5hY3RpdmVvcmRlcnMgPSAkY29va2llU3RvcmUuZ2V0KCdPcmRlcicpO1xuXHR9XG5cblx0JHNjb3BlLmRlbGV0ZUNvb2tpZSA9IGZ1bmN0aW9uKCl7XG5cdFx0JGNvb2tpZVN0b3JlLnJlbW92ZSgnT3JkZXInKTtcblx0XHRjb25zb2xlLmxvZygkY29va2llU3RvcmUuZ2V0KCdPcmRlcicpKTtcblx0fVxuXHRcblxuXHRmdW5jdGlvbiBzdW0gKCl7XG5cdFx0dmFyIHRvdGFsID0gMDtcblx0XHRjb25zb2xlLmxvZygnZ290IHRvIHN1bScpO1xuXHRcdCRzY29wZS5hY3RpdmVvcmRlcnMuZm9yRWFjaChmdW5jdGlvbihsaW5lSXRlbSl7XG5cdFx0XHR0b3RhbD0gdG90YWwgKyBsaW5lSXRlbS5pdGVtLnByaWNlICogbGluZUl0ZW0ucXR5O1xuXHRcdH0pXG5cdFx0JHNjb3BlLnN1bSA9IHRvdGFsO1xuXHR9O1xuXHRcbn0pOyIsIid1c2Ugc3RyaWN0JztcbmFwcC5jb25maWcoZnVuY3Rpb24gKCRzdGF0ZVByb3ZpZGVyKSB7XG5cbiAgICBcbiAgICAkc3RhdGVQcm92aWRlci5zdGF0ZSgnYWRtaW4ub3JkZXJNb2RpZnknLCB7XG4gICAgICAgIHVybDogJy9vcmRlck1vZGlmeScsXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnanMvb3JkZXJNb2RpZnkvb3JkZXJNb2RpZnkuaHRtbCcsXG4gICAgICAgIGNvbnRyb2xsZXI6ICdvcmRlck1vZGlmeUNvbnRyb2xsZXInXG4gICAgfSk7XG5cbn0pO1xuXG5hcHAuY29udHJvbGxlcignb3JkZXJNb2RpZnlDb250cm9sbGVyJywgZnVuY3Rpb24gKCRzY29wZSwgb3JkZXJNb2RpZnlGYWN0b3J5LCAkc3RhdGUsICRzdGF0ZVBhcmFtcywgJHJvb3RTY29wZSkge1xuXG5cdCRzY29wZS5pdGVtID0ge1xuXHRcdGNhdGVnb3JpZXM6IFtdIH07XG5cdCRzY29wZS5zdWNjZXNzO1xuXG5cdCRzY29wZS5tZW51SXRlbXMgPSBbXG5cdFx0eyBsYWJlbDogJ2FsbCBvcmRlcnMnfSxcbiAgICAgICAgeyBsYWJlbDogJ29wZW4nfSxcbiAgICAgICAgeyBsYWJlbDogJ3BsYWNlZCd9LFxuICAgICAgICB7IGxhYmVsOiAnc2hpcHBlZCd9LFxuICAgICAgICB7IGxhYmVsOiAnY29tcGxldGUnfVxuICAgIF07XG5cblx0JHNjb3BlLmdldEFsbE9yZGVycyA9IGZ1bmN0aW9uKCkge1xuXHRcdC8vJHNjb3BlLml0ZW0uY2F0ZWdvcmllcyA9ICRzY29wZS5pdGVtLmNhdGVnb3JpZXMuc3BsaXQoJyAnKTtcblx0XHRjb25zb2xlLmxvZygncHJvY2VzcyBzdGFydGVkJyk7XG5cdFx0b3JkZXJNb2RpZnlGYWN0b3J5LmdldEFsbE9yZGVycygpLnRoZW4oZnVuY3Rpb24oaXRlbSwgZXJyKXtcblx0XHRcdGlmKGVycikgJHNjb3BlLnN1Y2Nlc3M9IGZhbHNlO1xuXHRcdFx0ZWxzZXtcblx0XHRcdFx0Y29uc29sZS5sb2coaXRlbSk7XG5cdFx0XHRcdCRzY29wZS5pdGVtID0gaXRlbVxuXHRcdFx0XHQkc2NvcGUuc3VjY2VzcyA9IHRydWU7XG5cdFx0XHRcdFxuXHRcdFx0fVxuXHRcdH0pO1xuXHR9XG5cdCRzY29wZS5jaGFuZ2VTdGF0dXMgPSBmdW5jdGlvbiAoKSB7XG5cblx0fVxufSk7IiwiJ3VzZSBzdHJpY3QnO1xuYXBwLmNvbmZpZyhmdW5jdGlvbiAoJHN0YXRlUHJvdmlkZXIpIHtcblxuICAgICRzdGF0ZVByb3ZpZGVyLnN0YXRlKCdhZG1pbi5wcm9kdWN0Q2F0Q3JlYXRlJywge1xuICAgICAgICB1cmw6ICcvcHJvZHVjdENhdENyZWF0ZScsXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnanMvcHJvZHVjdENhdENyZWF0ZS9wcm9kdWN0Q2F0Q3JlYXRlLmh0bWwnXG4gICAgfSk7XG5cbn0pOyIsImFwcC5jb25maWcoZnVuY3Rpb24gKCRzdGF0ZVByb3ZpZGVyKSB7XG5cbiAgICAvLyBSZWdpc3RlciBvdXIgKlJldmlldyBFbnRyeSogc3RhdGUuXG4gICAgJHN0YXRlUHJvdmlkZXIuc3RhdGUoJ3Jldmlldy1lbnRyeScsIHtcbiAgICAgICAgdXJsOiAnOm5hbWUvOnVybC9yZXZpZXctZW50cnknLFxuICAgICAgICBjb250cm9sbGVyOiBmdW5jdGlvbigkc2NvcGUsICRzdGF0ZSwgJHN0YXRlUGFyYW1zKSB7XG4gICAgICAgICAgICAkc2NvcGUucHJvZHVjdG5hbWUgPSAkc3RhdGVQYXJhbXMubmFtZTtcbiAgICAgICAgICAgICRzY29wZS5wcm9kdWN0dXJsID0gJHN0YXRlUGFyYW1zLnVybDtcbiAgICAgICAgfSxcbiAgICAgICAgdGVtcGxhdGVVcmw6ICdqcy9yZXZpZXctZW50cnkvcmV2aWV3LWVudHJ5Lmh0bWwnXG4gICAgfSk7XG5cbn0pO1xuXG4iLCJhcHBcblxuICAgIC5jb25zdGFudCgncmF0aW5nQ29uZmlnJywge1xuICAgICAgICBtYXg6IDUsXG4gICAgfSlcblxuICAgIC5kaXJlY3RpdmUoJ3JhdGluZycsIFsncmF0aW5nQ29uZmlnJywgZnVuY3Rpb24ocmF0aW5nQ29uZmlnKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICByZXN0cmljdDogJ0VBJyxcbiAgICAgICAgICAgIHJlcGxhY2U6IHRydWUsXG4gICAgICAgICAgICBzY29wZToge1xuICAgICAgICAgICAgICAgIHZhbHVlOiAnPScsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgdGVtcGxhdGU6ICc8c3BhbiBuZy1tb3VzZWxlYXZlPVwicmVzZXQoKVwiPjxpIG5nLXJlcGVhdD1cIm51bWJlciBpbiByYW5nZVwiIG5nLW1vdXNlZW50ZXI9XCJlbnRlcihudW1iZXIpXCIgbmctY2xpY2s9XCJhc3NpZ24obnVtYmVyKVwiIG5nLWNsYXNzPVwie1xcJ2dseXBoaWNvbiBnbHlwaGljb24tc3RhciBpY29uLWdvbGRcXCc6IG51bWJlciA8PSB2YWwsIFxcJ2dseXBoaWNvbiBnbHlwaGljb24tc3RhciBpY29uLWdyYXlcXCc6IG51bWJlciA+IHZhbH1cIj48L2k+PC9zcGFuPicsXG4gICAgICAgICAgICBsaW5rOiBmdW5jdGlvbihzY29wZSwgZWxlbWVudCwgYXR0cnMpIHtcbiAgICAgICAgICAgICAgICB2YXIgbWF4UmFuZ2UgPSBhbmd1bGFyLmlzRGVmaW5lZChhdHRycy5tYXgpID8gc2NvcGUuJGV2YWwoYXR0cnMubWF4KSA6IHJhdGluZ0NvbmZpZy5tYXg7XG5cbiAgICAgICAgICAgICAgICBzY29wZS5yYW5nZSA9IFtdO1xuICAgICAgICAgICAgICAgIGZvcih2YXIgaSA9IDE7IGkgPD0gbWF4UmFuZ2U7IGkrKyApIHtcbiAgICAgICAgICAgICAgICAgICAgc2NvcGUucmFuZ2UucHVzaChpKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBzY29wZS4kd2F0Y2goJ3ZhbHVlJywgZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgc2NvcGUudmFsID0gdmFsdWU7XG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICBzY29wZS5hc3NpZ24gPSBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICBzY29wZS52YWx1ZSA9IHZhbHVlO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHNjb3BlLmVudGVyID0gZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgc2NvcGUudmFsID0gdmFsdWU7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgc2NvcGUucmVzZXQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgc2NvcGUudmFsID0gYW5ndWxhci5jb3B5KHNjb3BlLnZhbHVlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgc2NvcGUucmVzZXQoKTtcblxuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgIH1dKTtcblxuYXBwLmNvbnRyb2xsZXIoJ1N0YXJDdHJsJywgZnVuY3Rpb24oJHNjb3BlKSB7XG5cbiAgICAkc2NvcGUucmF0ZTEgPSAwO1xuXG4gICAgJHNjb3BlLnJhdGUyID0gNjtcblxufSk7IiwiJ3VzZSBzdHJpY3QnO1xuYXBwLmNvbmZpZyhmdW5jdGlvbiAoJHN0YXRlUHJvdmlkZXIpIHtcblxuICAgIC8vIFJlZ2lzdGVyIG91ciAqYWJvdXQqIHN0YXRlLlxuICAgICRzdGF0ZVByb3ZpZGVyLnN0YXRlKCdzdHJpcGUnLCB7XG4gICAgICAgIHVybDogJy9zdHJpcGUnLFxuICAgICAgICBjb250cm9sbGVyOiAnU3RyaXBlQ29udHJvbGxlcicsXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnanMvdGVzdFN0cmlwZS9zdHJpcGUuaHRtbCdcbiAgICB9KTtcblxufSk7XG5cbmFwcC5jb250cm9sbGVyKCdTdHJpcGVDb250cm9sbGVyJywgZnVuY3Rpb24gKCRzY29wZSkge1xuXG59KTsiLCIndXNlIHN0cmljdCc7XG5hcHAuY29uZmlnKGZ1bmN0aW9uICgkc3RhdGVQcm92aWRlcikge1xuXG4gICAgJHN0YXRlUHJvdmlkZXIuc3RhdGUoJ3R1dG9yaWFsJywge1xuICAgICAgICB1cmw6ICcvdHV0b3JpYWwnLFxuICAgICAgICB0ZW1wbGF0ZVVybDogJ2pzL3R1dG9yaWFsL3R1dG9yaWFsLmh0bWwnLFxuICAgICAgICBjb250cm9sbGVyOiAnVHV0b3JpYWxDdHJsJyxcbiAgICAgICAgcmVzb2x2ZToge1xuICAgICAgICAgICAgdHV0b3JpYWxJbmZvOiBmdW5jdGlvbiAoVHV0b3JpYWxGYWN0b3J5KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFR1dG9yaWFsRmFjdG9yeS5nZXRUdXRvcmlhbFZpZGVvcygpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSk7XG5cbn0pO1xuXG5hcHAuZmFjdG9yeSgnVHV0b3JpYWxGYWN0b3J5JywgZnVuY3Rpb24gKCRodHRwKSB7XG5cbiAgICByZXR1cm4ge1xuICAgICAgICBnZXRUdXRvcmlhbFZpZGVvczogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuICRodHRwLmdldCgnL2FwaS90dXRvcmlhbC92aWRlb3MnKS50aGVuKGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiByZXNwb25zZS5kYXRhO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9O1xuXG59KTtcblxuYXBwLmNvbnRyb2xsZXIoJ1R1dG9yaWFsQ3RybCcsIGZ1bmN0aW9uICgkc2NvcGUsIHR1dG9yaWFsSW5mbykge1xuXG4gICAgJHNjb3BlLnNlY3Rpb25zID0gdHV0b3JpYWxJbmZvLnNlY3Rpb25zO1xuICAgICRzY29wZS52aWRlb3MgPSBfLmdyb3VwQnkodHV0b3JpYWxJbmZvLnZpZGVvcywgJ3NlY3Rpb24nKTtcblxuICAgICRzY29wZS5jdXJyZW50U2VjdGlvbiA9IHsgc2VjdGlvbjogbnVsbCB9O1xuXG4gICAgJHNjb3BlLmNvbG9ycyA9IFtcbiAgICAgICAgJ3JnYmEoMzQsIDEwNywgMjU1LCAwLjEwKScsXG4gICAgICAgICdyZ2JhKDIzOCwgMjU1LCA2OCwgMC4xMSknLFxuICAgICAgICAncmdiYSgyMzQsIDUxLCAyNTUsIDAuMTEpJyxcbiAgICAgICAgJ3JnYmEoMjU1LCAxOTMsIDczLCAwLjExKScsXG4gICAgICAgICdyZ2JhKDIyLCAyNTUsIDEsIDAuMTEpJ1xuICAgIF07XG5cbiAgICAkc2NvcGUuZ2V0VmlkZW9zQnlTZWN0aW9uID0gZnVuY3Rpb24gKHNlY3Rpb24sIHZpZGVvcykge1xuICAgICAgICByZXR1cm4gdmlkZW9zLmZpbHRlcihmdW5jdGlvbiAodmlkZW8pIHtcbiAgICAgICAgICAgIHJldHVybiB2aWRlby5zZWN0aW9uID09PSBzZWN0aW9uO1xuICAgICAgICB9KTtcbiAgICB9O1xuXG59KTsiLCIndXNlIHN0cmljdCc7XG5hcHAuY29uZmlnKGZ1bmN0aW9uICgkc3RhdGVQcm92aWRlcikge1xuXHQkc3RhdGVQcm92aWRlci5zdGF0ZSgnYWRtaW4udXNlck1vZGlmeScsIHtcbiAgICAgICAgdXJsOiAnL3VzZXJNb2RpZnknLFxuICAgICAgICBjb250cm9sbGVyOiAndXNlck1vZGlmeUNvbnRyb2xsZXInLFxuICAgICAgICB0ZW1wbGF0ZVVybDogJ2pzL3VzZXJNb2RpZnkvdXNlck1vZGlmeS5odG1sJ1xuICAgIH0pO1xufSlcblxuYXBwLmNvbnRyb2xsZXIoJ3VzZXJNb2RpZnlDb250cm9sbGVyJywgZnVuY3Rpb24gKCRzY29wZSwgdXNlck1vZGlmeUZhY3RvcnksICRzdGF0ZSwgJHN0YXRlUGFyYW1zLCBBdXRoU2VydmljZSkge1xuXG4gICAgXG4gICAgJHNjb3BlLnN1Ym1pdCA9IHtcbiAgICAgICAgcGFzc3dvcmQ6ICcnLFxuICAgICAgICBlbWFpbDogJycsXG4gICAgICAgIG1ha2VBZG1pbjogZmFsc2VcbiAgICB9XG4gICAgJHNjb3BlLnN1Y2Nlc3M7XG5cblxuICAgICRzY29wZS5jaGFuZ2VQVyA9IGZ1bmN0aW9uKCkge1xuICAgICAgICB1c2VyTW9kaWZ5RmFjdG9yeS5wb3N0UFcoJHNjb3BlLnN1Ym1pdCkudGhlbihmdW5jdGlvbih1c2VyLCBlcnIpe1xuICAgICAgICAgICAgJHNjb3BlLnN1Ym1pdCA9IHt9XG4gICAgICAgICAgICBpZihlcnIpIHtcbiAgICAgICAgICAgICAgICAkc2NvcGUuc3VjY2Vzcz0gZmFsc2U7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ2NoYW5naW5nIHN0YXRlJylcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2V7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJHNjb3BlLnN1Ym1pdCk7XG4gICAgICAgICAgICAgICAgJHNjb3BlLnN1Y2Nlc3MgPSB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9ICBcbn0pOyIsIid1c2Ugc3RyaWN0JztcbmFwcC5mYWN0b3J5KCdDcmVhdGVJdGVtRmFjdG9yeScsIGZ1bmN0aW9uKCRodHRwKXtcblx0XG5cdHJldHVybiB7XG5cdFx0cG9zdEl0ZW06IGZ1bmN0aW9uKGRhdGEpe1xuXHRcdFx0Y29uc29sZS5sb2coJ2ludG8gdGhlIGZhY3RvcnknLCBkYXRhKTtcblx0XHRcdC8vIHJldHVybiAkaHR0cC5wb3N0KCcvYXBpL2l0ZW0nLCBkYXRhKTtcblxuXHRcdFx0cmV0dXJuICRodHRwLnBvc3QoJy9hcGkvYWRtaW4vaXRlbUNyZWF0ZScsIGRhdGEpLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2Upe1xuXHRcdFx0XHRyZXR1cm4gcmVzcG9uc2UuZGF0YTtcblx0XHRcdH0pXG5cdFx0fVxuXHR9XG5cbn0pIiwiJ3VzZSBzdHJpY3QnO1xuYXBwLmZhY3RvcnkoJ0NyZWF0ZVVzZXJGYWN0b3J5JywgZnVuY3Rpb24oJGh0dHApe1xuXHRcblx0cmV0dXJuIHtcblx0XHRwb3N0VXNlcjogZnVuY3Rpb24oZGF0YSl7XG5cdFx0XHRjb25zb2xlLmxvZygnaW50byB1c2VyIGZhY3RvcnknLCBkYXRhKTtcblx0XHRcdHJldHVybiAkaHR0cC5wb3N0KCcvYXBpL2pvaW4nLCBkYXRhKS50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKXtcblx0XHRcdFx0cmV0dXJuIHJlc3BvbnNlLmRhdGE7XG5cdFx0XHR9KVxuXHRcdH1cblx0fVxufSkiLCIndXNlIHN0cmljdCc7XG5hcHAuZmFjdG9yeSgnR2V0SXRlbUZhY3RvcnknLCBmdW5jdGlvbigkaHR0cCl7XG5cdFxuXHRyZXR1cm4ge1xuXHRcdGdldEl0ZW06IGZ1bmN0aW9uKGlkKXtcblx0XHRcdC8vdmFyIG9wdGlvbnMgPSB7ZW1haWw6IGVtYWlsfTtcblx0XHRcdHJldHVybiAkaHR0cC5nZXQoJy9hcGkvaXRlbS8nK2lkKS50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKXtcblx0XHRcdFx0cmV0dXJuIHJlc3BvbnNlLmRhdGE7XG5cdFx0XHR9KVxuXHRcdH1cblx0fVxuXG59KSIsIid1c2Ugc3RyaWN0JztcbmFwcC5mYWN0b3J5KCdHZXRJdGVtc0ZhY3RvcnknLCBmdW5jdGlvbigkaHR0cCl7XG5cbiAgICByZXR1cm4ge1xuICAgICAgICBnZXRJdGVtczogZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIHJldHVybiAkaHR0cC5nZXQoJy9hcGkvaXRlbWxpc3QnKS50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKXtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzcG9uc2UuZGF0YTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgIH1cblxuICAgIH1cbn0pIiwiJ3VzZSBzdHJpY3QnO1xuYXBwLmZhY3RvcnkoJ0dldFVzZXJGYWN0b3J5JywgZnVuY3Rpb24oJGh0dHApe1xuXHRcblx0cmV0dXJuIHtcblx0XHRnZXRVc2VyOiBmdW5jdGlvbihlbWFpbCl7XG5cdFx0XHRjb25zb2xlLmxvZygnaW5zaWRlIGZhY3RvciB3aXRoOiAnLCBlbWFpbCk7XG5cdFx0XHQvL3ZhciBvcHRpb25zID0ge2VtYWlsOiBlbWFpbH07XG5cdFx0XHRyZXR1cm4gJGh0dHAuZ2V0KCcvYXBpL2xvZ2luLycgKyBlbWFpbCkudGhlbihmdW5jdGlvbihyZXNwb25zZSl7XG5cdFx0XHRcdHJldHVybiByZXNwb25zZS5kYXRhO1xuXHRcdFx0fSlcblx0XHR9XG5cdH1cbn0pIiwiJ3VzZSBzdHJpY3QnO1xuYXBwLmZhY3RvcnkoJ09yZGVyRmFjdG9yeScsIGZ1bmN0aW9uKCRodHRwKXtcblx0XG5cdHJldHVybiB7XG5cdFx0YWRkSXRlbTogZnVuY3Rpb24oZGF0YSl7XG5cdFx0XHRjb25zb2xlLmxvZygnaW50byB0aGUgZmFjdG9yeScsIGRhdGEpO1xuXHRcdFx0Ly8gZGF0YSBzaG91bGQgYmUgaW4gZm9ybSB7aXRlbTogaXRlbUlkLCBxdWFudGl0eTogcXVhbnRpdHksIH1cblxuXHRcdFx0cmV0dXJuICRodHRwLnBvc3QoJy9hcGkvaXRlbS9hZGRUb09yZGVyJywgZGF0YSkudGhlbihmdW5jdGlvbihyZXNwb25zZSl7XG5cdFx0XHRcdHJldHVybiByZXNwb25zZS5kYXRhO1xuXHRcdFx0fSlcblx0XHR9LFxuXHRcdHVwZGF0ZU9yZGVyOiBmdW5jdGlvbihkYXRhKXtcblx0XHRcdHJldHVybiAkaHR0cC5wb3N0KCcvYXBpL29yZGVyL2xpbmVpdGVtJywgZGF0YSkudGhlbihmdW5jdGlvbihyZXNwb25zZSl7XG5cdFx0XHRcdHJldHVybiByZXNwb25zZS5kYXRhO1xuXHRcdFx0fSlcblx0XHR9LFxuXHRcdGdldE9yZGVyczogZnVuY3Rpb24oKXtcblx0XHRcdC8vaWYgdXNlciBpcyBhdXRoZW50aWNhdGVkLCBjaGVjayB0aGUgc2VydmVyXG5cdFx0XHQvL2lmKHJlcS5zZXNzaW9uLnVzZXIpXG5cdFx0XHRpZiggMSA+PSA2ICl7XG5cdFx0XHRcdHJldHVybiAkaHR0cC5nZXQoJy9hcGkvb3JkZXInKS50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKXtcblx0XHRcdFx0XHRyZXR1cm4gcmVzcG9uc2UuZGF0YTtcblx0XHRcdFx0fSlcblx0XHRcdH1cblx0XHRcdGVsc2V7XG5cdFx0XHRcdHJldHVybiBmYWxzZTsgLy9nZXQgZGF0YSBmcm9tIHNlc3Npb25cblx0XHRcdH1cblx0XHR9XG5cblxuXG5cdH07XG5cbn0pIiwiJ3VzZSBzdHJpY3QnO1xuYXBwLmZhY3RvcnkoJ1JhbmRvbUdyZWV0aW5ncycsIGZ1bmN0aW9uICgpIHtcblxuICAgIHZhciBnZXRSYW5kb21Gcm9tQXJyYXkgPSBmdW5jdGlvbiAoYXJyKSB7XG4gICAgICAgIHJldHVybiBhcnJbTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogYXJyLmxlbmd0aCldO1xuICAgIH07XG5cbiAgICB2YXIgZ3JlZXRpbmdzID0gW1xuICAgICAgICAnSGVsbG8sIHdvcmxkIScsXG4gICAgICAgICdBdCBsb25nIGxhc3QsIEkgbGl2ZSEnLFxuICAgICAgICAnSGVsbG8sIHNpbXBsZSBodW1hbi4nLFxuICAgICAgICAnV2hhdCBhIGJlYXV0aWZ1bCBkYXkhJyxcbiAgICAgICAgJ0lcXCdtIGxpa2UgYW55IG90aGVyIHByb2plY3QsIGV4Y2VwdCB0aGF0IEkgYW0geW91cnMuIDopJyxcbiAgICAgICAgJ1RoaXMgZW1wdHkgc3RyaW5nIGlzIGZvciBMaW5kc2F5IExldmluZS4nXG4gICAgXTtcblxuICAgIHJldHVybiB7XG4gICAgICAgIGdyZWV0aW5nczogZ3JlZXRpbmdzLFxuICAgICAgICBnZXRSYW5kb21HcmVldGluZzogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIGdldFJhbmRvbUZyb21BcnJheShncmVldGluZ3MpO1xuICAgICAgICB9XG4gICAgfTtcblxufSk7IiwiJ3VzZSBzdHJpY3QnO1xuIiwiYXBwLmZhY3RvcnkoJ2FkbWluTmF2YmFyRmFjdG9yeScsIGZ1bmN0aW9uIChuYXZiYXJNZW51KSB7XG5cdFx0dmFyIG5hdmJhck1lbnVJdGVtcyA9IFtcbiAgICAgICAgeyBsYWJlbDogJ0hvbWUnLCBzdGF0ZTogJ2hvbWUnIH0sXG4gICAgICAgIHsgbGFiZWw6ICdDcmVhdGUgSXRlbScsIHN0YXRlOiAnaXRlbUNyZWF0ZScgfSxcbiAgICAgICAgeyBsYWJlbDogJ01vZGlmeSBVc2VyJywgc3RhdGU6ICd1c2VyTW9kaWZ5JyB9XG4gICAgXTtcblxuXHRyZXR1cm4ge1xuXG5cdH1cbn0pIiwiYXBwLmZhY3RvcnkoJ2FkbWluUG9zdFVzZXInLCBmdW5jdGlvbiAoJGh0dHApIHtcblxuXHRyZXR1cm4ge1xuXHRcdHBvc3RJbmZvOiBmdW5jdGlvbiAoaW5wdXRzKSB7XG5cdFx0XHRyZXR1cm4gJGh0dHAucG9zdCgnYWRtaW4nLCBpbnB1dHMpXG5cdFx0fVxuXHR9XG59KSAiLCIndXNlIHN0cmljdCc7XG5hcHAuZmFjdG9yeSgnb3JkZXJNb2RpZnlGYWN0b3J5JywgZnVuY3Rpb24oJGh0dHApe1xuXHRcblx0cmV0dXJuIHtcblx0XHRtb2RpZnlPcmRlcjogZnVuY3Rpb24oZGF0YSl7XG5cdFx0XHRjb25zb2xlLmxvZygnaW50byB0aGUgZmFjdG9yeScsIGRhdGEpO1xuXHRcdFx0Ly8gcmV0dXJuICRodHRwLnBvc3QoJy9hcGkvaXRlbScsIGRhdGEpO1xuXG5cdFx0XHRyZXR1cm4gJGh0dHAucHV0KCcvYXBpL2FkbWluL29yZGVyJywgZGF0YSkudGhlbihmdW5jdGlvbihyZXNwb25zZSl7XG5cdFx0XHRcdHJldHVybiByZXNwb25zZS5kYXRhO1xuXHRcdFx0fSlcblx0XHR9LFxuXHRcdGdldEFsbE9yZGVyczogZnVuY3Rpb24oKXtcblx0XHRcdGNvbnNvbGUubG9nKCdpbnRvIHRoZSBmYWN0b3J5Jyk7XG5cdFx0XHQvLyByZXR1cm4gJGh0dHAucG9zdCgnL2FwaS9pdGVtJywgZGF0YSk7XG5cblx0XHRcdHJldHVybiAkaHR0cC5nZXQoJy9hcGkvYWRtaW4vb3JkZXInKS50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKXtcblx0XHRcdFx0cmV0dXJuIHJlc3BvbnNlLmRhdGE7XG5cdFx0XHR9KVxuXHRcdH0sXG5cdFx0Y2hhbmdlT3JkZXJTdGF0dXM6IGZ1bmN0aW9uICggKSB7XG5cdFx0XHRyZXR1cm4gJGh0dHAucHV0KCcvYXBpL2FkbWluL29yZGVyJykudGhlbihmdW5jdGlvbihyZXNwb25zZSl7XG5cdFx0XHRcdHJldHVybiByZXNwb25zZS5kYXRhO1xuXHRcdFx0fSlcdFxuXHRcdH1cblx0XHQvLyBnZXRVc2VyT3JkZXJzQnlFbWFpbDogZnVuY3Rpb24gKCkge1xuXHRcdC8vIFx0cmV0dXJuICRodHRwLnBvc3QoJy9hcGkvYWRtaW4vb3JkZXInKS50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKXtcblx0XHQvLyBcdFx0cmV0dXJuIHJlc3BvbnNlLmRhdGE7XG5cdFx0Ly8gXHR9KVxuXHRcdC8vIH1cblx0fVxuXG59KSIsIid1c2Ugc3RyaWN0JztcbmFwcC5mYWN0b3J5KCd1c2VyTW9kaWZ5RmFjdG9yeScsIGZ1bmN0aW9uKCRodHRwKXtcblx0XG5cdHJldHVybiB7XG5cdFx0cG9zdFBXOiBmdW5jdGlvbihkYXRhKXtcblx0XHRcdGNvbnNvbGUubG9nKCdpbnRvIHRoZSBmYWN0b3J5JywgZGF0YSk7XG5cdFx0XHQvLyByZXR1cm4gJGh0dHAucG9zdCgnL2FwaS9pdGVtJywgZGF0YSk7XG5cblx0XHRcdHJldHVybiAkaHR0cC5wb3N0KCcvYXBpL2FkbWluL3VzZXJNb2RpZnknLCBkYXRhKS50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKXtcblx0XHRcdFx0cmV0dXJuIHJlc3BvbnNlLmRhdGE7XG5cdFx0XHR9KVxuXHRcdH1cblx0fVxuXG59KSIsIid1c2Ugc3RyaWN0JztcblxuYXBwLmRpcmVjdGl2ZSgndHV0b3JpYWxTZWN0aW9uJywgZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB7XG4gICAgICAgIHJlc3RyaWN0OiAnRScsXG4gICAgICAgIHNjb3BlOiB7XG4gICAgICAgICAgICBuYW1lOiAnQCcsXG4gICAgICAgICAgICB2aWRlb3M6ICc9JyxcbiAgICAgICAgICAgIGJhY2tncm91bmQ6ICdAJ1xuICAgICAgICB9LFxuICAgICAgICB0ZW1wbGF0ZVVybDogJ2pzL3R1dG9yaWFsL3R1dG9yaWFsLXNlY3Rpb24vdHV0b3JpYWwtc2VjdGlvbi5odG1sJyxcbiAgICAgICAgbGluazogZnVuY3Rpb24gKHNjb3BlLCBlbGVtZW50KSB7XG4gICAgICAgICAgICBlbGVtZW50LmNzcyh7IGJhY2tncm91bmQ6IHNjb3BlLmJhY2tncm91bmQgfSk7XG4gICAgICAgIH1cbiAgICB9O1xufSk7IiwiJ3VzZSBzdHJpY3QnO1xuYXBwLmRpcmVjdGl2ZSgndHV0b3JpYWxTZWN0aW9uTWVudScsIGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgICByZXN0cmljdDogJ0UnLFxuICAgICAgICByZXF1aXJlOiAnbmdNb2RlbCcsXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnanMvdHV0b3JpYWwvdHV0b3JpYWwtc2VjdGlvbi1tZW51L3R1dG9yaWFsLXNlY3Rpb24tbWVudS5odG1sJyxcbiAgICAgICAgc2NvcGU6IHtcbiAgICAgICAgICAgIHNlY3Rpb25zOiAnPSdcbiAgICAgICAgfSxcbiAgICAgICAgbGluazogZnVuY3Rpb24gKHNjb3BlLCBlbGVtZW50LCBhdHRycywgbmdNb2RlbEN0cmwpIHtcblxuICAgICAgICAgICAgc2NvcGUuY3VycmVudFNlY3Rpb24gPSBzY29wZS5zZWN0aW9uc1swXTtcbiAgICAgICAgICAgIG5nTW9kZWxDdHJsLiRzZXRWaWV3VmFsdWUoc2NvcGUuY3VycmVudFNlY3Rpb24pO1xuXG4gICAgICAgICAgICBzY29wZS5zZXRTZWN0aW9uID0gZnVuY3Rpb24gKHNlY3Rpb24pIHtcbiAgICAgICAgICAgICAgICBzY29wZS5jdXJyZW50U2VjdGlvbiA9IHNlY3Rpb247XG4gICAgICAgICAgICAgICAgbmdNb2RlbEN0cmwuJHNldFZpZXdWYWx1ZShzZWN0aW9uKTtcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgfVxuICAgIH07XG59KTsiLCIndXNlIHN0cmljdCc7XG5hcHAuZGlyZWN0aXZlKCd0dXRvcmlhbFZpZGVvJywgZnVuY3Rpb24gKCRzY2UpIHtcblxuICAgIHZhciBmb3JtWW91dHViZVVSTCA9IGZ1bmN0aW9uIChpZCkge1xuICAgICAgICByZXR1cm4gJ2h0dHBzOi8vd3d3LnlvdXR1YmUuY29tL2VtYmVkLycgKyBpZDtcbiAgICB9O1xuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgcmVzdHJpY3Q6ICdFJyxcbiAgICAgICAgdGVtcGxhdGVVcmw6ICdqcy90dXRvcmlhbC90dXRvcmlhbC12aWRlby90dXRvcmlhbC12aWRlby5odG1sJyxcbiAgICAgICAgc2NvcGU6IHtcbiAgICAgICAgICAgIHZpZGVvOiAnPSdcbiAgICAgICAgfSxcbiAgICAgICAgbGluazogZnVuY3Rpb24gKHNjb3BlKSB7XG4gICAgICAgICAgICBzY29wZS50cnVzdGVkWW91dHViZVVSTCA9ICRzY2UudHJ1c3RBc1Jlc291cmNlVXJsKGZvcm1Zb3V0dWJlVVJMKHNjb3BlLnZpZGVvLnlvdXR1YmVJRCkpO1xuICAgICAgICB9XG4gICAgfTtcblxufSk7IiwiJ3VzZSBzdHJpY3QnO1xuYXBwLmRpcmVjdGl2ZSgnbmF2RHJvcGRvd24nLCBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgcmVzdHJpY3Q6ICdFJyxcbiAgICAgICAgLy9zY29wZToge1xuICAgICAgICAvLyAgICBpdGVtczogJz0nXG4gICAgICAgIC8vfSxcbiAgICAgICAgdGVtcGxhdGVVcmw6ICdqcy9jb21tb24vZGlyZWN0aXZlcy9uYXZiYXIvbmF2LWRyb3Bkb3duLmh0bWwnXG4gICAgICAgIC8vY29udHJvbGxlcjogJ2Ryb3Bkb3duQ29udHJvbGxlcidcbiAgICB9O1xufSk7XG5cbmFwcC5kaXJlY3RpdmUoJ25hdkRyb3Bkb3duV29tZW4nLCBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgcmVzdHJpY3Q6ICdFJyxcbiAgICAgICAgLy9zY29wZToge1xuICAgICAgICAvLyAgICBpdGVtczogJz0nXG4gICAgICAgIC8vfSxcbiAgICAgICAgdGVtcGxhdGVVcmw6ICdqcy9jb21tb24vZGlyZWN0aXZlcy9uYXZiYXIvbmF2LWRyb3Bkb3duLXdvbWVuLmh0bWwnXG4gICAgICAgIC8vY29udHJvbGxlcjogJ2Ryb3Bkb3duQ29udHJvbGxlcidcbiAgICB9O1xufSk7XG5cbmFwcC5jb250cm9sbGVyKCdkcm9wZG93bkNvbnRyb2xsZXInLCBmdW5jdGlvbiAoJHNjb3BlLCBHZXRJdGVtc0ZhY3RvcnksICRzdGF0ZSwgJHN0YXRlUGFyYW1zLCAkd2luZG93KSB7XG5cbiAgICBHZXRJdGVtc0ZhY3RvcnkuZ2V0SXRlbXMoKS50aGVuKGZ1bmN0aW9uKGl0ZW1zLCBlcnIpe1xuICAgICAgICBpZihlcnIpIHRocm93IGVycjtcbiAgICAgICAgZWxzZXtcbiAgICAgICAgICAgIHZhciBhbGxJdGVtcyA9IGl0ZW1zO1xuICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhhbGxJdGVtcyk7XG4gICAgICAgICAgICB2YXIgZHJvcERvd25Tb3J0ZXIgPSBmdW5jdGlvbiAoZ2VuZGVyKSB7XG4gICAgICAgICAgICAgICAgdmFyIHNvcnRlZEFycmF5ID0gW107XG4gICAgICAgICAgICAgICAgdmFyIHNlbGVjdGVkTmFtZXMgPSBbXTtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBvYmogaW4gYWxsSXRlbXMpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHNlbGVjdGVkTmFtZXMuaW5kZXhPZihhbGxJdGVtc1tvYmpdLm5hbWUpID09PSAtMSAmJiBhbGxJdGVtc1tvYmpdLmdlbmRlciA9PSBnZW5kZXIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vLy9jb25zb2xlLmxvZyhhbGxJdGVtc1tvYmpdLm5hbWUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZWN0ZWROYW1lcy5wdXNoKGFsbEl0ZW1zW29ial0ubmFtZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBzb3J0ZWRBcnJheS5wdXNoKGFsbEl0ZW1zW29ial0pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiBzb3J0ZWRBcnJheTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgICRzY29wZS5tZW5Qcm9kdWN0czEgPSBkcm9wRG93blNvcnRlcignbWVuJykuc2xpY2UoMCwzKTtcbiAgICAgICAgICAgICRzY29wZS5tZW5Qcm9kdWN0czIgPSBkcm9wRG93blNvcnRlcignbWVuJykuc2xpY2UoMyw2KTtcblxuICAgICAgICAgICAgJHNjb3BlLndvbWVuUHJvZHVjdHMxID0gZHJvcERvd25Tb3J0ZXIoJ3dvbWVuJykuc2xpY2UoMCwzKTtcbiAgICAgICAgICAgICRzY29wZS53b21lblByb2R1Y3RzMiA9IGRyb3BEb3duU29ydGVyKCd3b21lbicpLnNsaWNlKDMsNik7XG4gICAgICAgICAgICAvL2NvbnNvbGUubG9nKCRzY29wZS5tZW5Qcm9kdWN0czEsICRzY29wZS5tZW5Qcm9kdWN0czIpO1xuICAgICAgICAgICAgLy9jb25zb2xlLmxvZygkc2NvcGUud29tZW5Qcm9kdWN0cyk7XG5cbiAgICAgICAgICAgIC8vIERyb3Bkb3duIGNvbnRyb2xzXG4gICAgICAgICAgICAkc2NvcGUubWVuVmlzaWJsZSA9IGZhbHNlO1xuICAgICAgICAgICAgJHNjb3BlLndvbWVuVmlzaWJsZSA9IGZhbHNlO1xuXG4gICAgICAgICAgICAkc2NvcGUudG9nZ2xlTWVuVmlzaWJsZSA9IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgJHNjb3BlLm1lblZpc2libGUgPSAhJHNjb3BlLm1lblZpc2libGU7XG4gICAgICAgICAgICAgICAgJHNjb3BlLndvbWVuVmlzaWJsZSA9IGZhbHNlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAkc2NvcGUudG9nZ2xlV29tZW5WaXNpYmxlID0gZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICRzY29wZS53b21lblZpc2libGUgPSAhJHNjb3BlLndvbWVuVmlzaWJsZTtcbiAgICAgICAgICAgICAgICAkc2NvcGUubWVuVmlzaWJsZSA9IGZhbHNlO1xuICAgICAgICAgICAgfVxuXG5cblxuICAgICAgICB9XG4gICAgfSk7XG5cbn0pOyIsIid1c2Ugc3RyaWN0JztcbmFwcC5kaXJlY3RpdmUoJ25hdmJhcicsIGZ1bmN0aW9uICgkZG9jdW1lbnQpIHtcbiAgICByZXR1cm4ge1xuICAgICAgICByZXN0cmljdDogJ0UnLFxuICAgICAgICAvL3Njb3BlOiB7XG4gICAgICAgIC8vICBpdGVtczogJz0nXG4gICAgICAgIC8vfSxcbiAgICAgICAgdGVtcGxhdGVVcmw6ICdqcy9jb21tb24vZGlyZWN0aXZlcy9uYXZiYXIvbmF2YmFyLmh0bWwnLFxuICAgICAgICAvL2xpbms6IGZ1bmN0aW9uKHNjb3BlLCBlbGVtZW50LCBhdHRyKXtcbiAgICAgICAgLy8gICAgY29uc29sZS5sb2coc2NvcGUpO1xuICAgICAgICAvLyAgICBjb25zb2xlLmxvZyhlbGVtZW50KTtcbiAgICAgICAgLy8gICAgLy9zY29wZS5tZW5WaXNpYmxlID0gZmFsc2U7XG4gICAgICAgIC8vICAgIC8vXG4gICAgICAgIC8vICAgIC8vc2NvcGUudG9nZ2xlU2VsZWN0ID0gZnVuY3Rpb24oKXtcbiAgICAgICAgLy8gICAgLy8gICAgc2NvcGUubWVuVmlzaWJsZSA9ICFzY29wZS5tZW5WaXNpYmxlO1xuICAgICAgICAvLyAgICAvL31cbiAgICAgICAgLy8gICAgLy9cbiAgICAgICAgLy8gICAgJGRvY3VtZW50LmJpbmQoJ2NsaWNrJywgZnVuY3Rpb24oZXZlbnQpe1xuICAgICAgICAvL1xuICAgICAgICAvLyAgICAgICAgdmFyIGlzQ2xpY2tlZEVsZW1lbnRDaGlsZE9mUG9wdXAgPSBlbGVtZW50XG4gICAgICAgIC8vICAgICAgICAgICAgICAgIC5maW5kKGV2ZW50LnRhcmdldClcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgLmxlbmd0aCA+IDA7XG4gICAgICAgIC8vICAgICAgICBjb25zb2xlLmxvZygnaXMgY2xpY2tlZCcsIHNjb3BlLm1lblZpc2libGUpXG4gICAgICAgIC8vICAgICAgICBpZiAoaXNDbGlja2VkRWxlbWVudENoaWxkT2ZQb3B1cClcbiAgICAgICAgLy8gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIC8vXG4gICAgICAgIC8vICAgICAgICBzY29wZS5tZW5WaXNpYmxlID0gZmFsc2U7XG4gICAgICAgIC8vICAgICAgICBzY29wZS4kYXBwbHkoKTtcbiAgICAgICAgLy8gICAgfSk7XG4gICAgICAgIC8vfVxuXG4gICAgfTtcbn0pOyIsIid1c2Ugc3RyaWN0JztcbmFwcC5kaXJlY3RpdmUoJ3JhbmRvR3JlZXRpbmcnLCBmdW5jdGlvbiAoUmFuZG9tR3JlZXRpbmdzKSB7XG5cbiAgICByZXR1cm4ge1xuICAgICAgICByZXN0cmljdDogJ0UnLFxuICAgICAgICB0ZW1wbGF0ZVVybDogJ2pzL2NvbW1vbi9kaXJlY3RpdmVzL3JhbmRvLWdyZWV0aW5nL3JhbmRvLWdyZWV0aW5nLmh0bWwnLFxuICAgICAgICBsaW5rOiBmdW5jdGlvbiAoc2NvcGUpIHtcbiAgICAgICAgICAgIHNjb3BlLmdyZWV0aW5nID0gUmFuZG9tR3JlZXRpbmdzLmdldFJhbmRvbUdyZWV0aW5nKCk7XG4gICAgICAgIH1cbiAgICB9O1xuXG59KTsiLCIndXNlIHN0cmljdCc7XG5hcHAuZGlyZWN0aXZlKCdzcGVjc3RhY2t1bGFyTG9nbycsIGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgICByZXN0cmljdDogJ0UnLFxuICAgICAgICB0ZW1wbGF0ZVVybDogJ2pzL2NvbW1vbi9kaXJlY3RpdmVzL3NwZWNzdGFja3VsYXItbG9nby9zcGVjc3RhY2t1bGFyLWxvZ28uaHRtbCdcbiAgICB9O1xufSk7Il0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9