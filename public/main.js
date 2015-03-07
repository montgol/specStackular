'use strict';
// var app = angular.module('FullstackGeneratedApp', ['ui.router', 'fsaPreBuilt']);

var app = angular.module('specStackular', ['ui.router', 'fsaPreBuilt', 'ngCookies']);
app.controller('MainController',  function ($scope) {
// app.controller('MainController',  function ($scope,  $rootScope) {

    // Given to the <navbar> directive to show the menu.
    $scope.menuItems = [
        { label: 'Home', state: 'home' },
        { label: 'Product list', state: 'products' },
        { label: 'Register', state: 'join' },
        { label: 'Log In', state: 'login'},   
        { label: 'About', state: 'about' },
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

    // Register our *products* state.
    $stateProvider.state('products', {
        url: '/products',
        controller: 'allItemsController',
        templateUrl: 'js/allitems/allitems.html'
    })

});

app.controller('allItemsController', function ($scope, GetItemsFactory, $state, $stateParams, $cookieStore) {

	GetItemsFactory.getItems().then(function(items, err){
		if(err) throw err;
		else{
			$scope.items = items;
		}
	});

	$scope.addToOrder = function(specificItem){
		// console.log('got into the function'); //part one always add it to the cookie
		var order = $cookieStore.get('Order');
		var resolved = false;
		var line = {item: specificItem, qty: 1};
			order.forEach(function(itemLine){
				if(itemLine.item._id === specificItem._id){
					itemLine.qty++;
					resolved = true;
				}	
			});
			if(!resolved){
				order.push(line);
			}
		// console.log('added item to order');
		$cookieStore.put('Order', order);
		// console.log('Total Order: ', $cookieStore.get('Order'));

		//part 2, check if user has logged in, and send to order db
	}
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
			var line = {item: $scope.item, qty: 1};
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

    // Register our *Login* state.
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
		createOrder: function(data){// data should be in form {userId: user._id, items: [item: item._id, qty: qty]}
			return $http.post('/api/order', data).then(function(response){
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
app.factory('adminPostUser', function ($http) {

	return {
		postInfo: function (inputs) {
			return $http.post('admin', inputs)
		}
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
app.directive('fullstackLogo', function () {
    return {
        restrict: 'E',
        templateUrl: 'js/common/directives/fullstack-logo/fullstack-logo.html'
    };
});
'use strict';
app.directive('navbar', function () {
    return {
        restrict: 'E',
        scope: {
          items: '=',
          currentUserAdmin: '=',
          adminItems: '='
        },
        templateUrl: 'js/common/directives/navbar/navbar.html'
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyIsImFib3V0L2Fib3V0LmpzIiwiYWxsSXRlbXMvYWxsSXRlbXMuanMiLCJhZG1pbi9hZG1pbi5qcyIsImFkbWluL2luZGV4LmpzIiwiZnNhL2ZzYS1wcmUtYnVpbHQuanMiLCJob21lL2hvbWUuanMiLCJpdGVtL2l0ZW0uanMiLCJpdGVtQ3JlYXRlL2l0ZW1DcmVhdGUuanMiLCJqb2lubm93L2pvaW5ub3cuanMiLCJsb2dpbi9sb2dpbi5qcyIsIm9yZGVyL29yZGVyLmpzIiwicmV2aWV3LWVudHJ5L3Jldmlldy1lbnRyeS5qcyIsInJldmlldy1lbnRyeS9zdGFycy5qcyIsInRlc3RTdHJpcGUvc3RyaXBlLmpzIiwidHV0b3JpYWwvdHV0b3JpYWwuanMiLCJ1c2VyTW9kaWZ5L3VzZXJNb2RpZnkuanMiLCJjb21tb24vZmFjdG9yaWVzL0NyZWF0ZUl0ZW1GYWN0b3J5LmpzIiwiY29tbW9uL2ZhY3Rvcmllcy9DcmVhdGVVc2VyRmFjdG9yeS5qcyIsImNvbW1vbi9mYWN0b3JpZXMvR2V0SXRlbUZhY3RvcnkuanMiLCJjb21tb24vZmFjdG9yaWVzL0dldEl0ZW1zRmFjdG9yeS5qcyIsImNvbW1vbi9mYWN0b3JpZXMvR2V0VXNlckZhY3RvcnkuanMiLCJjb21tb24vZmFjdG9yaWVzL09yZGVyRmFjdG9yeS5qcyIsImNvbW1vbi9mYWN0b3JpZXMvUmFuZG9tR3JlZXRpbmdzLmpzIiwiY29tbW9uL2ZhY3Rvcmllcy9Tb2NrZXQuanMiLCJjb21tb24vZmFjdG9yaWVzL2FkbWluTmF2YmFyRmFjdG9yeS5qcyIsImNvbW1vbi9mYWN0b3JpZXMvYWRtaW5Qb3N0VXNlci5qcyIsImNvbW1vbi9mYWN0b3JpZXMvdXNlck1vZGlmeUZhY3RvcnkuanMiLCJ0dXRvcmlhbC90dXRvcmlhbC1zZWN0aW9uL3R1dG9yaWFsLXNlY3Rpb24uanMiLCJ0dXRvcmlhbC90dXRvcmlhbC1zZWN0aW9uLW1lbnUvdHV0b3JpYWwtc2VjdGlvbi1tZW51LmpzIiwidHV0b3JpYWwvdHV0b3JpYWwtdmlkZW8vdHV0b3JpYWwtdmlkZW8uanMiLCJjb21tb24vZGlyZWN0aXZlcy9hZG1pbk5hdmJhci9hZG1pbk5hdmJhci5qcyIsImNvbW1vbi9kaXJlY3RpdmVzL2Z1bGxzdGFjay1sb2dvL2Z1bGxzdGFjay1sb2dvLmpzIiwiY29tbW9uL2RpcmVjdGl2ZXMvbmF2YmFyL25hdmJhci5qcyIsImNvbW1vbi9kaXJlY3RpdmVzL3JhbmRvLWdyZWV0aW5nL3JhbmRvLWdyZWV0aW5nLmpzIiwiY29tbW9uL2RpcmVjdGl2ZXMvc3BlY3N0YWNrdWxhci1sb2dvL3NwZWNzdGFja3VsYXItbG9nby5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2pDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDcERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3BCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNqSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNaQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdkRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMvQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ25DQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN6SUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDZEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2pEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNkQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDakRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDakNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDWkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDWkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDcEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3ZCQTtBQUNBO0FDREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNkQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDckJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbEJBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNYQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNYQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJtYWluLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnO1xuLy8gdmFyIGFwcCA9IGFuZ3VsYXIubW9kdWxlKCdGdWxsc3RhY2tHZW5lcmF0ZWRBcHAnLCBbJ3VpLnJvdXRlcicsICdmc2FQcmVCdWlsdCddKTtcblxudmFyIGFwcCA9IGFuZ3VsYXIubW9kdWxlKCdzcGVjU3RhY2t1bGFyJywgWyd1aS5yb3V0ZXInLCAnZnNhUHJlQnVpbHQnLCAnbmdDb29raWVzJ10pO1xuYXBwLmNvbnRyb2xsZXIoJ01haW5Db250cm9sbGVyJywgIGZ1bmN0aW9uICgkc2NvcGUpIHtcbi8vIGFwcC5jb250cm9sbGVyKCdNYWluQ29udHJvbGxlcicsICBmdW5jdGlvbiAoJHNjb3BlLCAgJHJvb3RTY29wZSkge1xuXG4gICAgLy8gR2l2ZW4gdG8gdGhlIDxuYXZiYXI+IGRpcmVjdGl2ZSB0byBzaG93IHRoZSBtZW51LlxuICAgICRzY29wZS5tZW51SXRlbXMgPSBbXG4gICAgICAgIHsgbGFiZWw6ICdIb21lJywgc3RhdGU6ICdob21lJyB9LFxuICAgICAgICB7IGxhYmVsOiAnUHJvZHVjdCBsaXN0Jywgc3RhdGU6ICdwcm9kdWN0cycgfSxcbiAgICAgICAgeyBsYWJlbDogJ1JlZ2lzdGVyJywgc3RhdGU6ICdqb2luJyB9LFxuICAgICAgICB7IGxhYmVsOiAnTG9nIEluJywgc3RhdGU6ICdsb2dpbid9LCAgIFxuICAgICAgICB7IGxhYmVsOiAnQWJvdXQnLCBzdGF0ZTogJ2Fib3V0JyB9LFxuICAgICAgICB7IGxhYmVsOiAnTXkgT3JkZXJzJywgc3RhdGU6ICdvcmRlcnMnfVxuICAgIF07XG4gICAgJHNjb3BlLmFkbWluSXRlbXM9IFtcbiAgICAgICAgeyBsYWJlbDogJ0NyZWF0ZSBwcm9kdWN0Jywgc3RhdGU6ICdhZG1pbi5pdGVtQ3JlYXRlJyB9LFxuICAgICAgICB7IGxhYmVsOiAnTW9kaWZ5IFVzZXInLCBzdGF0ZTogJ2FkbWluLnVzZXJNb2RpZnknfSxcbiAgICAgICAgeyBsYWJlbDogJ01vZGlmeSBPcmRlcicsIHN0YXRlOiAnYWRtaW4ub3JkZXJNb2RpZnknfSxcbiAgICAgICAgeyBsYWJlbDogJ0NyZWF0ZSBQcm9kdWN0IENhdCBQZycsIHN0YXRlOiAnYWRtaW4ucHJvZHVjdENhdENyZWF0ZSd9XG4gICAgXVxuXG5cblxufSk7XG5cblxuYXBwLmNvbmZpZyhmdW5jdGlvbiAoJHVybFJvdXRlclByb3ZpZGVyLCAkbG9jYXRpb25Qcm92aWRlcikge1xuICAgIC8vIFRoaXMgdHVybnMgb2ZmIGhhc2hiYW5nIHVybHMgKC8jYWJvdXQpIGFuZCBjaGFuZ2VzIGl0IHRvIHNvbWV0aGluZyBub3JtYWwgKC9hYm91dClcbiAgICAkbG9jYXRpb25Qcm92aWRlci5odG1sNU1vZGUodHJ1ZSk7XG4gICAgLy8gSWYgd2UgZ28gdG8gYSBVUkwgdGhhdCB1aS1yb3V0ZXIgZG9lc24ndCBoYXZlIHJlZ2lzdGVyZWQsIGdvIHRvIHRoZSBcIi9cIiB1cmwuXG4gICAgJHVybFJvdXRlclByb3ZpZGVyLm90aGVyd2lzZSgnLycpO1xufSk7IiwiJ3VzZSBzdHJpY3QnO1xuYXBwLmNvbmZpZyhmdW5jdGlvbiAoJHN0YXRlUHJvdmlkZXIpIHtcblxuICAgIC8vIFJlZ2lzdGVyIG91ciAqYWJvdXQqIHN0YXRlLlxuICAgICRzdGF0ZVByb3ZpZGVyLnN0YXRlKCdhYm91dCcsIHtcbiAgICAgICAgdXJsOiAnL2Fib3V0JyxcbiAgICAgICAgY29udHJvbGxlcjogJ0Fib3V0Q29udHJvbGxlcicsXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnanMvYWJvdXQvYWJvdXQuaHRtbCdcbiAgICB9KTtcblxufSk7XG5cbmFwcC5jb250cm9sbGVyKCdBYm91dENvbnRyb2xsZXInLCBmdW5jdGlvbiAoJHNjb3BlKSB7XG5cbiAgICAvLyBJbWFnZXMgb2YgYmVhdXRpZnVsIEZ1bGxzdGFjayBwZW9wbGUuXG4gICAgJHNjb3BlLmltYWdlcyA9IFtcbiAgICAgICAgJ2h0dHBzOi8vcGJzLnR3aW1nLmNvbS9tZWRpYS9CN2dCWHVsQ0FBQVhRY0UuanBnOmxhcmdlJyxcbiAgICAgICAgJ2h0dHBzOi8vZmJjZG4tc3Bob3Rvcy1jLWEuYWthbWFpaGQubmV0L2hwaG90b3MtYWsteGFwMS90MzEuMC04LzEwODYyNDUxXzEwMjA1NjIyOTkwMzU5MjQxXzgwMjcxNjg4NDMzMTI4NDExMzdfby5qcGcnLFxuICAgICAgICAnaHR0cHM6Ly9wYnMudHdpbWcuY29tL21lZGlhL0ItTEtVc2hJZ0FFeTlTSy5qcGcnLFxuICAgICAgICAnaHR0cHM6Ly9wYnMudHdpbWcuY29tL21lZGlhL0I3OS1YN29DTUFBa3c3eS5qcGcnLFxuICAgICAgICAnaHR0cHM6Ly9wYnMudHdpbWcuY29tL21lZGlhL0ItVWo5Q09JSUFJRkFoMC5qcGc6bGFyZ2UnLFxuICAgICAgICAnaHR0cHM6Ly9wYnMudHdpbWcuY29tL21lZGlhL0I2eUl5RmlDRUFBcWwxMi5qcGc6bGFyZ2UnXG4gICAgXTtcblxufSk7IiwiJ3VzZSBzdHJpY3QnO1xuXG5hcHAucnVuKGZ1bmN0aW9uICgkY29va2llcywgJGNvb2tpZVN0b3JlKSB7XG5cblx0dmFyIGluaXQgPSAkY29va2llU3RvcmUuZ2V0KCdPcmRlcicpO1xuXHRpZighaW5pdCl7XG5cdFx0JGNvb2tpZVN0b3JlLnB1dCgnT3JkZXInLCBbXSk7XG5cdFx0Y29uc29sZS5sb2coJ3N0YXJ0aW5nIGNvb2tpZTogJywgJGNvb2tpZVN0b3JlLmdldCgnT3JkZXInKSk7XG5cdH1cblxufSk7XG5cbmFwcC5jb25maWcoZnVuY3Rpb24gKCRzdGF0ZVByb3ZpZGVyKSB7XG5cbiAgICAvLyBSZWdpc3RlciBvdXIgKnByb2R1Y3RzKiBzdGF0ZS5cbiAgICAkc3RhdGVQcm92aWRlci5zdGF0ZSgncHJvZHVjdHMnLCB7XG4gICAgICAgIHVybDogJy9wcm9kdWN0cycsXG4gICAgICAgIGNvbnRyb2xsZXI6ICdhbGxJdGVtc0NvbnRyb2xsZXInLFxuICAgICAgICB0ZW1wbGF0ZVVybDogJ2pzL2FsbGl0ZW1zL2FsbGl0ZW1zLmh0bWwnXG4gICAgfSlcblxufSk7XG5cbmFwcC5jb250cm9sbGVyKCdhbGxJdGVtc0NvbnRyb2xsZXInLCBmdW5jdGlvbiAoJHNjb3BlLCBHZXRJdGVtc0ZhY3RvcnksICRzdGF0ZSwgJHN0YXRlUGFyYW1zLCAkY29va2llU3RvcmUpIHtcblxuXHRHZXRJdGVtc0ZhY3RvcnkuZ2V0SXRlbXMoKS50aGVuKGZ1bmN0aW9uKGl0ZW1zLCBlcnIpe1xuXHRcdGlmKGVycikgdGhyb3cgZXJyO1xuXHRcdGVsc2V7XG5cdFx0XHQkc2NvcGUuaXRlbXMgPSBpdGVtcztcblx0XHR9XG5cdH0pO1xuXG5cdCRzY29wZS5hZGRUb09yZGVyID0gZnVuY3Rpb24oc3BlY2lmaWNJdGVtKXtcblx0XHQvLyBjb25zb2xlLmxvZygnZ290IGludG8gdGhlIGZ1bmN0aW9uJyk7IC8vcGFydCBvbmUgYWx3YXlzIGFkZCBpdCB0byB0aGUgY29va2llXG5cdFx0dmFyIG9yZGVyID0gJGNvb2tpZVN0b3JlLmdldCgnT3JkZXInKTtcblx0XHR2YXIgcmVzb2x2ZWQgPSBmYWxzZTtcblx0XHR2YXIgbGluZSA9IHtpdGVtOiBzcGVjaWZpY0l0ZW0sIHF0eTogMX07XG5cdFx0XHRvcmRlci5mb3JFYWNoKGZ1bmN0aW9uKGl0ZW1MaW5lKXtcblx0XHRcdFx0aWYoaXRlbUxpbmUuaXRlbS5faWQgPT09IHNwZWNpZmljSXRlbS5faWQpe1xuXHRcdFx0XHRcdGl0ZW1MaW5lLnF0eSsrO1xuXHRcdFx0XHRcdHJlc29sdmVkID0gdHJ1ZTtcblx0XHRcdFx0fVx0XG5cdFx0XHR9KTtcblx0XHRcdGlmKCFyZXNvbHZlZCl7XG5cdFx0XHRcdG9yZGVyLnB1c2gobGluZSk7XG5cdFx0XHR9XG5cdFx0Ly8gY29uc29sZS5sb2coJ2FkZGVkIGl0ZW0gdG8gb3JkZXInKTtcblx0XHQkY29va2llU3RvcmUucHV0KCdPcmRlcicsIG9yZGVyKTtcblx0XHQvLyBjb25zb2xlLmxvZygnVG90YWwgT3JkZXI6ICcsICRjb29raWVTdG9yZS5nZXQoJ09yZGVyJykpO1xuXG5cdFx0Ly9wYXJ0IDIsIGNoZWNrIGlmIHVzZXIgaGFzIGxvZ2dlZCBpbiwgYW5kIHNlbmQgdG8gb3JkZXIgZGJcblx0fVxufSk7IiwiJ3VzZSBzdHJpY3QnO1xuYXBwLmNvbmZpZyhmdW5jdGlvbiAoJHN0YXRlUHJvdmlkZXIpIHtcblxuICAgIFxuICAgICRzdGF0ZVByb3ZpZGVyLnN0YXRlKCdhZG1pbicsIHtcbiAgICAgICAgdXJsOiAnL2FkbWluJyxcbiAgICAgICAgdGVtcGxhdGVVcmw6ICdqcy9hZG1pbi9hZG1pbi5odG1sJ1xuICAgIH0pO1xuXG59KTtcblxuIiwiJ3VzZSBzdHJpY3QnO1xuYXBwLmNvbnRyb2xsZXIoJ0FkbWluQ29udHJvbGxlcicsIGZ1bmN0aW9uICgkc2NvcGUpIHtcblxuICAgIC8vIEdpdmVuIHRvIHRoZSA8bmF2YmFyPiBkaXJlY3RpdmUgdG8gc2hvdyB0aGUgbWVudS5cbiAgICAkc2NvcGUubWVudUl0ZW1zID0gW1xuICAgICAgICB7IGxhYmVsOiAnSG9tZScsIHN0YXRlOiAnaG9tZScgfSxcbiAgICAgICAgeyBsYWJlbDogJ0NyZWF0ZSBJdGVtJywgc3RhdGU6ICdpdGVtQ3JlYXRlJyB9LFxuICAgICAgICB7IGxhYmVsOiAnTW9kaWZ5IFVzZXInLCBzdGF0ZTogJ3VzZXJNb2RpZnknIH1cbiAgICBdO1xuXG59KTtcblxuYXBwLmRpcmVjdGl2ZSgnYWRtaW5OYXZiYXInLCBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgcmVzdHJpY3Q6ICdFJyxcbiAgICAgICAgc2NvcGU6IHtcbiAgICAgICAgICBpdGVtczogJz0nXG4gICAgICAgIH0sXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnanMvY29tbW9uL2RpcmVjdGl2ZXMvbmF2YmFyL25hdmJhci5odG1sJ1xuICAgIH07XG59KTsiLCIoZnVuY3Rpb24gKCkge1xuXG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgLy8gSG9wZSB5b3UgZGlkbid0IGZvcmdldCBBbmd1bGFyISBEdWgtZG95LlxuICAgIGlmICghd2luZG93LmFuZ3VsYXIpIHRocm93IG5ldyBFcnJvcignSSBjYW5cXCd0IGZpbmQgQW5ndWxhciEnKTtcblxuICAgIHZhciBhcHAgPSBhbmd1bGFyLm1vZHVsZSgnZnNhUHJlQnVpbHQnLCBbXSk7XG5cbiAgICBhcHAuZmFjdG9yeSgnU29ja2V0JywgZnVuY3Rpb24gKCRsb2NhdGlvbikge1xuXG4gICAgICAgIGlmICghd2luZG93LmlvKSB0aHJvdyBuZXcgRXJyb3IoJ3NvY2tldC5pbyBub3QgZm91bmQhJyk7XG5cbiAgICAgICAgdmFyIHNvY2tldDtcblxuICAgICAgICBpZiAoJGxvY2F0aW9uLiQkcG9ydCkge1xuICAgICAgICAgICAgc29ja2V0ID0gaW8oJ2h0dHA6Ly9sb2NhbGhvc3Q6MTMzNycpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgc29ja2V0ID0gaW8oJy8nKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBzb2NrZXQ7XG5cbiAgICB9KTtcblxuICAgIGFwcC5jb25zdGFudCgnQVVUSF9FVkVOVFMnLCB7XG4gICAgICAgIGxvZ2luU3VjY2VzczogJ2F1dGgtbG9naW4tc3VjY2VzcycsXG4gICAgICAgIGxvZ2luRmFpbGVkOiAnYXV0aC1sb2dpbi1mYWlsZWQnLFxuICAgICAgICBsb2dvdXRTdWNjZXNzOiAnYXV0aC1sb2dvdXQtc3VjY2VzcycsXG4gICAgICAgIHNlc3Npb25UaW1lb3V0OiAnYXV0aC1zZXNzaW9uLXRpbWVvdXQnLFxuICAgICAgICBub3RBdXRoZW50aWNhdGVkOiAnYXV0aC1ub3QtYXV0aGVudGljYXRlZCcsXG4gICAgICAgIG5vdEF1dGhvcml6ZWQ6ICdhdXRoLW5vdC1hdXRob3JpemVkJ1xuICAgIH0pO1xuXG4gICAgYXBwLmNvbmZpZyhmdW5jdGlvbiAoJGh0dHBQcm92aWRlcikge1xuICAgICAgICAkaHR0cFByb3ZpZGVyLmludGVyY2VwdG9ycy5wdXNoKFtcbiAgICAgICAgICAgICckaW5qZWN0b3InLFxuICAgICAgICAgICAgZnVuY3Rpb24gKCRpbmplY3Rvcikge1xuICAgICAgICAgICAgICAgIHJldHVybiAkaW5qZWN0b3IuZ2V0KCdBdXRoSW50ZXJjZXB0b3InKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgXSk7XG4gICAgfSk7XG5cbiAgICBhcHAuZmFjdG9yeSgnQXV0aEludGVyY2VwdG9yJywgZnVuY3Rpb24gKCRyb290U2NvcGUsICRxLCBBVVRIX0VWRU5UUykge1xuICAgICAgICB2YXIgc3RhdHVzRGljdCA9IHtcbiAgICAgICAgICAgIDQwMTogQVVUSF9FVkVOVFMubm90QXV0aGVudGljYXRlZCxcbiAgICAgICAgICAgIDQwMzogQVVUSF9FVkVOVFMubm90QXV0aG9yaXplZCxcbiAgICAgICAgICAgIDQxOTogQVVUSF9FVkVOVFMuc2Vzc2lvblRpbWVvdXQsXG4gICAgICAgICAgICA0NDA6IEFVVEhfRVZFTlRTLnNlc3Npb25UaW1lb3V0XG4gICAgICAgIH07XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICByZXNwb25zZUVycm9yOiBmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgICAgICAgICAgICAgICAkcm9vdFNjb3BlLiRicm9hZGNhc3Qoc3RhdHVzRGljdFtyZXNwb25zZS5zdGF0dXNdLCByZXNwb25zZSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuICRxLnJlamVjdChyZXNwb25zZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgfSk7XG5cbiAgICBhcHAuc2VydmljZSgnQXV0aFNlcnZpY2UnLCBmdW5jdGlvbiAoJGh0dHAsIFNlc3Npb24sICRyb290U2NvcGUsIEFVVEhfRVZFTlRTLCAkcSkge1xuXG4gICAgICAgIHZhciBvblN1Y2Nlc3NmdWxMb2dpbiA9IGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICAgICAgICAgICAgdmFyIGRhdGEgPSByZXNwb25zZS5kYXRhO1xuICAgICAgICAgICAgU2Vzc2lvbi5jcmVhdGUoZGF0YS5pZCwgZGF0YS51c2VyKTtcbiAgICAgICAgICAgICRyb290U2NvcGUuJGJyb2FkY2FzdChBVVRIX0VWRU5UUy5sb2dpblN1Y2Nlc3MpO1xuICAgICAgICAgICAgcmV0dXJuIGRhdGEudXNlcjtcbiAgICAgICAgfTtcblxuICAgICAgICB0aGlzLmdldExvZ2dlZEluVXNlciA9IGZ1bmN0aW9uICgpIHtcblxuICAgICAgICAgICAgaWYgKHRoaXMuaXNBdXRoZW50aWNhdGVkKCkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gJHEud2hlbih7IHVzZXI6IFNlc3Npb24udXNlciB9KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuICRodHRwLmdldCgnL3Nlc3Npb24nKS50aGVuKG9uU3VjY2Vzc2Z1bExvZ2luKS5jYXRjaChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICB9O1xuXG4gICAgICAgIHRoaXMubG9naW4gPSBmdW5jdGlvbiAoY3JlZGVudGlhbHMpIHtcbiAgICAgICAgICAgIHJldHVybiAkaHR0cC5wb3N0KCcvbG9naW4nLCBjcmVkZW50aWFscykudGhlbihvblN1Y2Nlc3NmdWxMb2dpbik7XG4gICAgICAgIH07XG5cbiAgICAgICAgdGhpcy5sb2dvdXQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KCcvbG9nb3V0JykudGhlbihmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgU2Vzc2lvbi5kZXN0cm95KCk7XG4gICAgICAgICAgICAgICAgJHJvb3RTY29wZS4kYnJvYWRjYXN0KEFVVEhfRVZFTlRTLmxvZ291dFN1Y2Nlc3MpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgdGhpcy5pc0F1dGhlbnRpY2F0ZWQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gISFTZXNzaW9uLnVzZXI7XG4gICAgICAgIH07XG5cbiAgICB9KTtcblxuICAgIGFwcC5zZXJ2aWNlKCdTZXNzaW9uJywgZnVuY3Rpb24gKCRyb290U2NvcGUsIEFVVEhfRVZFTlRTKSB7XG5cbiAgICAgICAgJHJvb3RTY29wZS4kb24oQVVUSF9FVkVOVFMubm90QXV0aGVudGljYXRlZCwgdGhpcy5kZXN0cm95KTtcbiAgICAgICAgJHJvb3RTY29wZS4kb24oQVVUSF9FVkVOVFMuc2Vzc2lvblRpbWVvdXQsIHRoaXMuZGVzdHJveSk7XG5cbiAgICAgICAgdGhpcy5jcmVhdGUgPSBmdW5jdGlvbiAoc2Vzc2lvbklkLCB1c2VyKSB7XG4gICAgICAgICAgICB0aGlzLmlkID0gc2Vzc2lvbklkO1xuICAgICAgICAgICAgdGhpcy51c2VyID0gdXNlcjtcbiAgICAgICAgfTtcblxuICAgICAgICB0aGlzLmRlc3Ryb3kgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB0aGlzLmlkID0gbnVsbDtcbiAgICAgICAgICAgIHRoaXMudXNlciA9IG51bGw7XG4gICAgICAgIH07XG5cbiAgICB9KTtcblxufSkoKTsiLCIndXNlIHN0cmljdCc7XG5hcHAuY29uZmlnKGZ1bmN0aW9uICgkc3RhdGVQcm92aWRlcikge1xuXG4gICAgJHN0YXRlUHJvdmlkZXIuc3RhdGUoJ2hvbWUnLCB7XG4gICAgICAgIHVybDogJy8nLFxuICAgICAgICBjb250cm9sbGVyOiAnSG9tZUN0cmwnLFxuICAgICAgICB0ZW1wbGF0ZVVybDogJ2pzL2hvbWUvaG9tZS5odG1sJ1xuICAgIH0pO1xuXG59KTtcblxuYXBwLmNvbnRyb2xsZXIoJ0hvbWVDdHJsJywgZnVuY3Rpb24gKCRzY29wZSkge1xufSk7IiwiJ3VzZSBzdHJpY3QnO1xuXG5hcHAucnVuKGZ1bmN0aW9uICgkY29va2llcywgJGNvb2tpZVN0b3JlKSB7XG5cblx0dmFyIGluaXQgPSAkY29va2llU3RvcmUuZ2V0KCdPcmRlcicpO1xuXHRpZighaW5pdCl7XG5cdFx0JGNvb2tpZVN0b3JlLnB1dCgnT3JkZXInLCBbXSk7XG5cdFx0Y29uc29sZS5sb2coJ3N0YXJ0aW5nIGNvb2tpZTogJywgJGNvb2tpZVN0b3JlLmdldCgnT3JkZXInKSk7XG5cdH1cblxufSk7XG5cbmFwcC5jb25maWcoZnVuY3Rpb24gKCRzdGF0ZVByb3ZpZGVyKSB7XG5cbiAgICAvLyBSZWdpc3RlciBvdXIgKml0ZW0qIHN0YXRlLlxuICAgICRzdGF0ZVByb3ZpZGVyLnN0YXRlKCdpdGVtJywge1xuICAgICAgICB1cmw6ICcvaXRlbS86bmFtZScsXG4gICAgICAgIGNvbnRyb2xsZXI6ICdpdGVtQ29udHJvbGxlcicsXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnanMvaXRlbS9pdGVtLmh0bWwnXG4gICAgfSk7XG5cbn0pO1xuXG5hcHAuY29udHJvbGxlcignaXRlbUNvbnRyb2xsZXInLCBmdW5jdGlvbiAoJHNjb3BlLCBHZXRJdGVtRmFjdG9yeSwgJHN0YXRlLCAkc3RhdGVQYXJhbXMsICRjb29raWVTdG9yZSwgQXV0aFNlcnZpY2UsIE9yZGVyRmFjdG9yeSApIHtcblxuXHQvL2dldCBpbnB1dCBmcm9tIHVzZXIgYWJvdXQgaXRlbSAoaWQgZnJvbSB1cmwgKVxuXHQvL2NoZWNrIGlkIHZzIGRhdGFiYXNlXG5cdC8vaWYgbm90IGZvdW5kLCByZWRpcmVjdCB0byBzZWFyY2ggcGFnZVxuXHQvL2lmIGZvdW5kIHNlbmQgdGVtcGFsYXRlVXJsXG5cblx0R2V0SXRlbUZhY3RvcnkuZ2V0SXRlbSgkc3RhdGVQYXJhbXMubmFtZSkudGhlbihmdW5jdGlvbihpdGVtLCBlcnIpe1xuXHRcdGlmKGVycikgJHN0YXRlLmdvKCdob21lJyk7XG5cdFx0ZWxzZXtcblx0XHRcdCRzY29wZS5pdGVtID0gaXRlbVswXTtcblx0XHRcdH1cblx0fSk7XG5cblx0JHNjb3BlLmFkZFRvT3JkZXIgPSBmdW5jdGlvbigpe1xuXHRcdFxuXHRcdEF1dGhTZXJ2aWNlLmlzQXV0aGVudGljYXRlZCgpLnRoZW4oZnVuY3Rpb24oYW5zd2VyKXtcblx0XHRcdHZhciBvcmRlciA9ICRjb29raWVzLmdldCgnT3JkZXInKTtcblx0XHRcdHZhciBsaW5lID0ge2l0ZW06ICRzY29wZS5pdGVtLCBxdHk6IDF9O1xuXHRcdFx0aWYoIW9yZGVyKXtcblx0XHRcdFx0JGNvb2tpZXMucHV0KCdPcmRlcicsIGxpbmUpO1xuXHRcdFx0fVxuXHRcdFx0ZWxzZXtcblx0XHRcdFx0b3JkZXIucHVzaChsaW5lKTtcblx0XHRcdFx0JGNvb2tpZXMucHV0KCdPcmRlcicsIG9yZGVyKTtcblx0XHRcdH1cblxuXHRcdFx0aWYoYW5zd2VyKXtcblx0XHRcdFx0T3JkZXJGYWN0b3J5LmFkZEl0ZW0oKVxuXHRcdFx0fVxuXHRcdH0pXG5cdH1cbn0pOyIsIid1c2Ugc3RyaWN0JztcbmFwcC5jb25maWcoZnVuY3Rpb24gKCRzdGF0ZVByb3ZpZGVyKSB7XG5cbiAgICAvLyBSZWdpc3RlciBvdXIgKml0ZW1DcmVhdGUqIHN0YXRlLlxuICAgICRzdGF0ZVByb3ZpZGVyLnN0YXRlKCdhZG1pbi5pdGVtQ3JlYXRlJywge1xuICAgICAgICB1cmw6ICcvaXRlbUNyZWF0ZScsXG4gICAgICAgIGNvbnRyb2xsZXI6ICdpdGVtQ3JlYXRlQ29udHJvbGxlcicsXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnanMvaXRlbUNyZWF0ZS9pdGVtQ3JlYXRlLmh0bWwnXG4gICAgfSk7XG5cbn0pO1xuXG5hcHAuY29udHJvbGxlcignaXRlbUNyZWF0ZUNvbnRyb2xsZXInLCBmdW5jdGlvbiAoJHNjb3BlLCBDcmVhdGVJdGVtRmFjdG9yeSwgJHN0YXRlLCAkc3RhdGVQYXJhbXMpIHtcblxuXHQkc2NvcGUuaXRlbSA9IHtcblx0XHRjYXRlZ29yaWVzOiBbXSB9O1xuXHQkc2NvcGUuc3VjY2VzcztcblxuXHQkc2NvcGUuc3VibWl0SXRlbSA9IGZ1bmN0aW9uKCkge1xuXHRcdC8vJHNjb3BlLml0ZW0uY2F0ZWdvcmllcyA9ICRzY29wZS5pdGVtLmNhdGVnb3JpZXMuc3BsaXQoJyAnKTtcblx0XHRjb25zb2xlLmxvZygncHJvY2VzcyBzdGFydGVkJyk7XG5cdFx0Y29uc29sZS5sb2coJHNjb3BlLml0ZW0pO1xuXHRcdENyZWF0ZUl0ZW1GYWN0b3J5LnBvc3RJdGVtKCRzY29wZS5pdGVtKS50aGVuKGZ1bmN0aW9uKGl0ZW0sIGVycil7XG5cdFx0XHRpZihlcnIpICRzY29wZS5zdWNjZXNzPSBmYWxzZTtcblx0XHRcdGVsc2V7XG5cdFx0XHRcdGNvbnNvbGUubG9nKGl0ZW0pO1xuXHRcdFx0XHQkc2NvcGUuc3VjY2VzcyA9IHRydWU7XG5cdFx0XHRcdFxuXHRcdFx0fVxuXHRcdH0pO1xuXHR9XG59KTsiLCJhcHAuY29uZmlnKGZ1bmN0aW9uICgkc3RhdGVQcm92aWRlcikge1xuXG4gICAgLy8gUmVnaXN0ZXIgb3VyICpKb2luIE5vdyogc3RhdGUuXG4gICAgJHN0YXRlUHJvdmlkZXIuc3RhdGUoJ2pvaW4nLCB7XG4gICAgICAgIHVybDogJy9qb2luJyxcbiAgICAgICAgY29udHJvbGxlcjogJ2pvaW5Db250cm9sbGVyJyxcblxuICAgICAgICB0ZW1wbGF0ZVVybDogJ2pzL2pvaW5ub3cvam9pbm5vdy5odG1sJyBcblxuICAgIH0pO1xuXG59KTtcblxuXG5cbmFwcC5jb250cm9sbGVyKCdqb2luQ29udHJvbGxlcicsIGZ1bmN0aW9uKCRzY29wZSwgJHdpbmRvdywgQ3JlYXRlVXNlckZhY3RvcnkpIHtcblxuICAgICRzY29wZS5sb2dpbm9hdXRoID0gZnVuY3Rpb24gKHByb3ZpZGVyKSB7XG4gICAgICAgIHZhciBsb2NhdGlvbiA9ICdhdXRoLycgKyBwcm92aWRlcjtcbiAgICAgICAgJHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gbG9jYXRpb247XG4gICAgfVxuXG4gICAgJHNjb3BlLnN1Y2Nlc3M7XG5cblxuICAgICRzY29wZS5zdWJtaXRVc2VyID0gZnVuY3Rpb24oKSB7XG4gICAgXHRjb25zb2xlLmxvZyhcInVzZXIgc3VibWl0IHByb2Nlc3Mgc3RhcnRlZFwiKTtcbiAgICBcdGNvbnNvbGUubG9nKCRzY29wZS51c2VyKTtcblx0ICAgIENyZWF0ZVVzZXJGYWN0b3J5LnBvc3RVc2VyKCRzY29wZS51c2VyKS50aGVuKGZ1bmN0aW9uKHVzZXIsIGVycil7XG5cdCAgICBcdGlmIChlcnIpICRzY29wZS5zdWNjZXNzPWZhbHNlO1xuXHQgICAgXHRlbHNle1xuXHQgICAgXHRcdGNvbnNvbGUubG9nKHVzZXIpO1xuXHQgICAgXHRcdCRzY29wZS5zdWNjZXNzID0gdHJ1ZTtcblx0ICAgIFx0fVxuXHQgICAgfSk7XG5cdCAgfVxufSk7XG5cbiIsImFwcC5jb25maWcoZnVuY3Rpb24gKCRzdGF0ZVByb3ZpZGVyKSB7XG5cbiAgICAvLyBSZWdpc3RlciBvdXIgKkxvZ2luKiBzdGF0ZS5cbiAgICAkc3RhdGVQcm92aWRlci5zdGF0ZSgnbG9naW4nLCB7XG4gICAgICAgIHVybDogJy9sb2dpbicsXG4gICAgICAgIGNvbnRyb2xsZXI6ICdsb2dpbkNvbnRyb2xsZXInLFxuICAgICAgICB0ZW1wbGF0ZVVybDogJ2pzL2xvZ2luL2xvZ2luLmh0bWwnIFxuICAgIH0pO1xuXG59KTtcblxuXG5hcHAuY29udHJvbGxlcignbG9naW5Db250cm9sbGVyJywgZnVuY3Rpb24gKCRzY29wZSwgJHdpbmRvdywgR2V0VXNlckZhY3RvcnksICRzdGF0ZSwgQXV0aFNlcnZpY2UsIFNlc3Npb24sICRyb290U2NvcGUpIHtcbiAgICAkc2NvcGUubG9naW5vYXV0aCA9IGZ1bmN0aW9uIChwcm92aWRlcikge1xuICAgICAgICB2YXIgbG9jYXRpb24gPSAnYXV0aC8nICsgcHJvdmlkZXI7XG4gICAgICAgICR3aW5kb3cubG9jYXRpb24uaHJlZiA9IGxvY2F0aW9uO1xuICAgIH1cbiAgICAkc2NvcGUuc3VjY2VzcztcbiAgICAkc2NvcGUuc3VibWl0VXNlciA9IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgaW5mbyA9ICRzY29wZS51c2VyLmVtYWlsO1xuICAgICAgICBjb25zb2xlLmxvZyhcInVzZXIgbG9naW4gcHJvY2VzcyBzdGFydGVkIHdpdGg6IFwiLCBpbmZvKTtcblx0ICAgIEdldFVzZXJGYWN0b3J5LmdldFVzZXIoaW5mbykudGhlbihmdW5jdGlvbih1c2VyLCBlcnIpe1xuXHQgICAgXHRpZiAoZXJyKSAkc2NvcGUuc3VjY2VzcyA9IGZhbHNlO1xuXHQgICAgXHRlbHNle1xuICAgICAgICAgICAgICAgICRyb290U2NvcGUuY3VycmVudFVzZXIgPSB1c2VyWzBdO1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCRyb290U2NvcGUuY3VycmVudFVzZXIpXG5cdCAgICBcdFx0aWYgKHVzZXJbMF0uYWRtaW4pIHtcbiAgICAgICAgICAgICAgICAgICAgJHN0YXRlLmdvKCdhZG1pbicpXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgJHN0YXRlLmdvKCdob21lJylcbiAgICAgICAgICAgICAgICB9XG5cdCAgICBcdH1cblx0ICAgIH0pO1xuXHR9XG59KTtcbiIsIid1c2Ugc3RyaWN0JztcbmFwcC5jb25maWcoZnVuY3Rpb24gKCRzdGF0ZVByb3ZpZGVyKSB7XG5cbiAgICAvLyBSZWdpc3RlciBvdXIgKm9yZGVycyogc3RhdGUuXG4gICAgJHN0YXRlUHJvdmlkZXIuc3RhdGUoJ29yZGVycycsIHtcbiAgICAgICAgdXJsOiAnL29yZGVyLzpuYW1lJyxcbiAgICAgICAgY29udHJvbGxlcjogJ29yZGVyQ29udHJvbGxlcicsXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnanMvb3JkZXIvb3JkZXIuaHRtbCdcbiAgICB9KTtcblxufSk7XG5cbmFwcC5jb250cm9sbGVyKCdvcmRlckNvbnRyb2xsZXInLCBmdW5jdGlvbiAoJHNjb3BlLCBPcmRlckZhY3RvcnksICRzdGF0ZSwgJHN0YXRlUGFyYW1zLCAkY29va2llU3RvcmUsIEF1dGhTZXJ2aWNlKSB7XG5cblx0Ly9wcm92aWRlcyBnZW5lcmFsIGZ1bmN0aW9uYWxpdHkgd2l0aCBhbiBvcmRlclxuXHQvL3ZpZXdzIGN1cnJlbnQgdXNlciBvcmRlclxuXHRcdC8vb3JkZXIgaXMgc2hvd24gYnkgbGluZSBpdGVtXG5cdFx0Ly9oYXMgYWJpbGl0eSB0byBlZGl0IG9yZGVyLCBvciBwcm9jZWVkIHRvIGNoZWNrb3V0XG5cdCRzY29wZS5hY3RpdmVvcmRlcnM9W107XG5cdCRzY29wZS5wYXN0b3JkZXJzPVtdO1xuXHQkc2NvcGUudXNlcjtcblx0JHNjb3BlLnN1bSA9IDA7XG5cdCRzY29wZS50b3RhbFF0eSA9IDA7IFxuXHQkc2NvcGUudGVtcFZhbDtcblx0JHNjb3BlLm9yZGVySWQ7XG5cdCRzY29wZS51c2VySWQ7XG5cdCRzY29wZS5hdXRoO1xuXG5cdGZ1bmN0aW9uIGZpcnN0VXBkYXRlICgpe1xuXHQvL2NoZWNrIGlmIHVzZXIgaXMgYXV0aGVudGljYXRlZCwgcG9wdWxhdGUgb3JkZXIgZnJvbSBkYiwgc2V0IG9yZGVyIHRvIGNvb2tpZVxuXHQvL1xuXHRcdGlmKEF1dGhTZXJ2aWNlLmlzQXV0aGVudGljYXRlZCgpKXtcblx0XHRcdEF1dGhTZXJ2aWNlLmdldExvZ2dlZEluVXNlcigpLnRoZW4oZnVuY3Rpb24odXNlcil7XG5cdFx0XHQkc2NvcGUudXNlcklkID0gdXNlci5faWQ7XG5cdFx0XHQkc2NvcGUudXNlciA9IHVzZXIuZmlyc3RfbmFtZTtcblx0XHRcdCRzY29wZS5hdXRoID0gdHJ1ZTtcblx0XHRcdFx0T3JkZXJGYWN0b3J5LmdldE9yZGVycyh1c2VyLl9pZCkudGhlbihmdW5jdGlvbihpdGVtcywgZXJyKXtcblx0XHRcdFx0XHRpZiAoZXJyKSBjb25zb2xlLmxvZygnRXJyb3I6ICcsIGVycik7XG5cdFx0XHRcdFx0ZWxzZSBpZighaXRlbXMpIHtcblx0XHRcdFx0XHRcdGNvbnNvbGUubG9nKCdObyBjdXJyZW50IG9yZGVyIGluIERCJyk7IC8vbm90IHN1cmUgd2hhdCBlbHNlIG5lZWRzIHRvIGJlIGRlY2xhcmVkLlxuXHRcdFx0XHRcdFx0JHNjb3BlLmFjdGl2ZW9yZGVycyA9ICRjb29raWVTdG9yZS5nZXQoJ09yZGVyJyk7XG5cdFx0XHRcdFx0XHQkc2NvcGUucHJvZiA9ICdVc2VyJztcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0ZWxzZSB7XG5cdFx0XHRcdFx0XHQkc2NvcGUuYWN0aXZlb3JkZXJzID0gaXRlbXMubGluZWl0ZW1zO1xuXHRcdFx0XHRcdFx0JHNjb3BlLm9yZGVySWQgPSBpdGVtcy5vcmRlcklkO1xuXG5cdFx0XHRcdFx0XHR2YXIgY29va2llID0gJGNvb2tpZVN0b3JlLmdldCgnT3JkZXInKTtcblx0XHRcdFx0XHRcdGlmKGNvb2tpZSl7XG5cdFx0XHRcdFx0XHRcdGNvb2tpZS5mb3JFYWNoKGZ1bmN0aW9uKG5ld0l0ZW0pe1xuXHRcdFx0XHRcdFx0XHRcdCRzY29wZS5hY3RpdmVvcmRlcnMucHVzaChuZXdJdGVtKTtcblx0XHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9KTtcblx0XHRcdH0pO1xuXHRcdH1cblx0XHRlbHNle1xuXHRcdFx0JHNjb3BlLmFjdGl2ZW9yZGVycyA9ICRjb29raWVTdG9yZS5nZXQoJ09yZGVyJyk7XG5cdFx0XHQkc2NvcGUudXNlciA9ICdVc2VyJztcblx0XHRcdCRzY29wZS5hdXRoID0gZmFsc2U7XG5cdFx0XHRzdW0oKTtcblx0XHRcdHRvdGFsUXR5KCk7XG5cdFx0fVxuXHR9XG5cblx0Zmlyc3RVcGRhdGUoKTtcblxuXG5cdGZ1bmN0aW9uIHNlcnZlclVwZGF0ZSgpe1xuXG5cdH1cblxuXHRmdW5jdGlvbiB0b3RhbFF0eSAoKXtcblx0XHR2YXIgdG90YWxRID0gMDtcblx0XHRjb25zb2xlLmxvZygnZ290IHRvIHN1bScpO1xuXHRcdCRzY29wZS5hY3RpdmVvcmRlcnMuZm9yRWFjaChmdW5jdGlvbihsaW5lSXRlbSl7XG5cdFx0XHR0b3RhbFE9IHRvdGFsUSArIGxpbmVJdGVtLnF0eTtcblx0XHR9KVxuXHRcdCRzY29wZS50b3RhbFF0eSA9IHRvdGFsUTtcblx0fTtcblxuXHQkc2NvcGUucmVtb3ZlSXRlbSA9IGZ1bmN0aW9uKGl0ZW0pe1xuXHRcdC8vcmVtb3ZlIGl0ZW0gZnJvbSBkYiwgcmVtb3ZlIGl0ZW0gZnJvbSBjb29raWUsIHJlbW92ZSBpdGVtIGZyb20gc2NvcGVcblx0XHQvL2lmIGF1dGhlbnRpY2F0ZWQsIHJlbW92ZSBpdGVtIGZyb20gb3JkZXJcblx0XHR2YXIgbXlPcmRlckNvb2tpZSA9ICRjb29raWVTdG9yZS5nZXQoJ09yZGVyJyk7XG5cdFx0dmFyIGxvY2F0aW9uXG5cdFx0bXlPcmRlckNvb2tpZS5mb3JFYWNoKGZ1bmN0aW9uKGVsZW1lbnQsIGluZGV4KXtcblx0XHRcdGlmKGVsZW1lbnQuaXRlbS5uYW1lID09PSBpdGVtLm5hbWUpe1xuXHRcdFx0XHRsb2NhdGlvbiA9IGluZGV4O1xuXHRcdFx0fVxuXHRcdH0pO1xuXHRcdHZhciByZW1vdmVkSXRlbSA9IG15T3JkZXJDb29raWUuc3BsaWNlKGxvY2F0aW9uLCAxKTtcblx0XHQkY29va2llU3RvcmUucHV0KCdPcmRlcicsIG15T3JkZXJDb29raWUpO1xuXHRcdCRzY29wZS5hY3RpdmVvcmRlcnMgPSBteU9yZGVyQ29va2llO1xuXHRcdHN1bSgpO1xuXHRcdHRvdGFsUXR5KCk7XG5cblx0XHRpZihBdXRoU2VydmljZS5pc0F1dGhlbnRpY2F0ZWQoKSl7XG5cdFx0XHRPcmRlckZhY3RvcnkudXBkYXRlT3JkZXIoe29yZGVySWQ6ICRzY29wZS5vcmRlcklkLCBxdWFudGl0eTogMCwgaXRlbUlkOiBJdGVtLl9pZH0pLnRoZW4oZnVuY3Rpb24oZXJyLCBkYXRhKXtcblx0XHRcdFx0aWYoZXJyKSBjb25zb2xlLmxvZyhlcnIpO1xuXG5cdFx0XHR9KTtcblx0XHRcdCRzY29wZS5hdXRoID0gdHJ1ZTtcblx0XHR9XG5cdH1cblxuXHQkc2NvcGUudXBkYXRlT3JkZXIgPSBmdW5jdGlvbigpe1xuXHRcdC8vdGFrZXMgaW4gaW5mb3JtYXRpb24gYWJvdXQgdGhlIHVzZXIsIFxuXHRcdE9yZGVyRmFjdG9yeS51cGRhdGVPcmRlcigpO1xuXG5cdH07IFxuXHQkc2NvcGUubmV3TnVtYmVyID0gZnVuY3Rpb24oaXRlbSwgdmFsKXtcblx0XHRjb25zb2xlLmxvZygnaXRlbScsIGl0ZW0sICd2YWwnLCB2YWwpO1xuXHR9XG5cdC8vZ2V0IHVzZXIgaW5mb3JtYXRpb24gYW5kIHNlbmQgSWRcblxuXHQkc2NvcGUuc2hvd0Nvb2tpZSA9IGZ1bmN0aW9uKCl7XG5cdFx0Y29uc29sZS5sb2coJGNvb2tpZVN0b3JlLmdldCgnT3JkZXInKSk7XG5cdFx0JHNjb3BlLmFjdGl2ZW9yZGVycyA9ICRjb29raWVTdG9yZS5nZXQoJ09yZGVyJyk7XG5cdH1cblxuXHQkc2NvcGUuZGVsZXRlQ29va2llID0gZnVuY3Rpb24oKXtcblx0XHQkY29va2llU3RvcmUucmVtb3ZlKCdPcmRlcicpO1xuXHRcdGNvbnNvbGUubG9nKCRjb29raWVTdG9yZS5nZXQoJ09yZGVyJykpO1xuXHR9XG5cdFxuXG5cdGZ1bmN0aW9uIHN1bSAoKXtcblx0XHR2YXIgdG90YWwgPSAwO1xuXHRcdGNvbnNvbGUubG9nKCdnb3QgdG8gc3VtJyk7XG5cdFx0JHNjb3BlLmFjdGl2ZW9yZGVycy5mb3JFYWNoKGZ1bmN0aW9uKGxpbmVJdGVtKXtcblx0XHRcdHRvdGFsPSB0b3RhbCArIGxpbmVJdGVtLml0ZW0ucHJpY2UgKiBsaW5lSXRlbS5xdHk7XG5cdFx0fSlcblx0XHQkc2NvcGUuc3VtID0gdG90YWw7XG5cdH07XG5cdFxufSk7IiwiYXBwLmNvbmZpZyhmdW5jdGlvbiAoJHN0YXRlUHJvdmlkZXIpIHtcblxuICAgIC8vIFJlZ2lzdGVyIG91ciAqUmV2aWV3IEVudHJ5KiBzdGF0ZS5cbiAgICAkc3RhdGVQcm92aWRlci5zdGF0ZSgncmV2aWV3LWVudHJ5Jywge1xuICAgICAgICB1cmw6ICc6bmFtZS86dXJsL3Jldmlldy1lbnRyeScsXG4gICAgICAgIGNvbnRyb2xsZXI6IGZ1bmN0aW9uKCRzY29wZSwgJHN0YXRlLCAkc3RhdGVQYXJhbXMpIHtcbiAgICAgICAgICAgICRzY29wZS5wcm9kdWN0bmFtZSA9ICRzdGF0ZVBhcmFtcy5uYW1lO1xuICAgICAgICAgICAgJHNjb3BlLnByb2R1Y3R1cmwgPSAkc3RhdGVQYXJhbXMudXJsO1xuICAgICAgICB9LFxuICAgICAgICB0ZW1wbGF0ZVVybDogJ2pzL3Jldmlldy1lbnRyeS9yZXZpZXctZW50cnkuaHRtbCdcbiAgICB9KTtcblxufSk7XG5cbiIsImFwcFxuXG4gICAgLmNvbnN0YW50KCdyYXRpbmdDb25maWcnLCB7XG4gICAgICAgIG1heDogNSxcbiAgICB9KVxuXG4gICAgLmRpcmVjdGl2ZSgncmF0aW5nJywgWydyYXRpbmdDb25maWcnLCBmdW5jdGlvbihyYXRpbmdDb25maWcpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHJlc3RyaWN0OiAnRUEnLFxuICAgICAgICAgICAgcmVwbGFjZTogdHJ1ZSxcbiAgICAgICAgICAgIHNjb3BlOiB7XG4gICAgICAgICAgICAgICAgdmFsdWU6ICc9JyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB0ZW1wbGF0ZTogJzxzcGFuIG5nLW1vdXNlbGVhdmU9XCJyZXNldCgpXCI+PGkgbmctcmVwZWF0PVwibnVtYmVyIGluIHJhbmdlXCIgbmctbW91c2VlbnRlcj1cImVudGVyKG51bWJlcilcIiBuZy1jbGljaz1cImFzc2lnbihudW1iZXIpXCIgbmctY2xhc3M9XCJ7XFwnZ2x5cGhpY29uIGdseXBoaWNvbi1zdGFyIGljb24tZ29sZFxcJzogbnVtYmVyIDw9IHZhbCwgXFwnZ2x5cGhpY29uIGdseXBoaWNvbi1zdGFyIGljb24tZ3JheVxcJzogbnVtYmVyID4gdmFsfVwiPjwvaT48L3NwYW4+JyxcbiAgICAgICAgICAgIGxpbms6IGZ1bmN0aW9uKHNjb3BlLCBlbGVtZW50LCBhdHRycykge1xuICAgICAgICAgICAgICAgIHZhciBtYXhSYW5nZSA9IGFuZ3VsYXIuaXNEZWZpbmVkKGF0dHJzLm1heCkgPyBzY29wZS4kZXZhbChhdHRycy5tYXgpIDogcmF0aW5nQ29uZmlnLm1heDtcblxuICAgICAgICAgICAgICAgIHNjb3BlLnJhbmdlID0gW107XG4gICAgICAgICAgICAgICAgZm9yKHZhciBpID0gMTsgaSA8PSBtYXhSYW5nZTsgaSsrICkge1xuICAgICAgICAgICAgICAgICAgICBzY29wZS5yYW5nZS5wdXNoKGkpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHNjb3BlLiR3YXRjaCgndmFsdWUnLCBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICBzY29wZS52YWwgPSB2YWx1ZTtcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIHNjb3BlLmFzc2lnbiA9IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgIHNjb3BlLnZhbHVlID0gdmFsdWU7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgc2NvcGUuZW50ZXIgPSBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICBzY29wZS52YWwgPSB2YWx1ZTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBzY29wZS5yZXNldCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICBzY29wZS52YWwgPSBhbmd1bGFyLmNvcHkoc2NvcGUudmFsdWUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBzY29wZS5yZXNldCgpO1xuXG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgfV0pO1xuXG5hcHAuY29udHJvbGxlcignU3RhckN0cmwnLCBmdW5jdGlvbigkc2NvcGUpIHtcblxuICAgICRzY29wZS5yYXRlMSA9IDA7XG5cbiAgICAkc2NvcGUucmF0ZTIgPSA2O1xuXG59KTsiLCIndXNlIHN0cmljdCc7XG5hcHAuY29uZmlnKGZ1bmN0aW9uICgkc3RhdGVQcm92aWRlcikge1xuXG4gICAgLy8gUmVnaXN0ZXIgb3VyICphYm91dCogc3RhdGUuXG4gICAgJHN0YXRlUHJvdmlkZXIuc3RhdGUoJ3N0cmlwZScsIHtcbiAgICAgICAgdXJsOiAnL3N0cmlwZScsXG4gICAgICAgIGNvbnRyb2xsZXI6ICdTdHJpcGVDb250cm9sbGVyJyxcbiAgICAgICAgdGVtcGxhdGVVcmw6ICdqcy90ZXN0U3RyaXBlL3N0cmlwZS5odG1sJ1xuICAgIH0pO1xuXG59KTtcblxuYXBwLmNvbnRyb2xsZXIoJ1N0cmlwZUNvbnRyb2xsZXInLCBmdW5jdGlvbiAoJHNjb3BlKSB7XG5cbn0pOyIsIid1c2Ugc3RyaWN0JztcbmFwcC5jb25maWcoZnVuY3Rpb24gKCRzdGF0ZVByb3ZpZGVyKSB7XG5cbiAgICAkc3RhdGVQcm92aWRlci5zdGF0ZSgndHV0b3JpYWwnLCB7XG4gICAgICAgIHVybDogJy90dXRvcmlhbCcsXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnanMvdHV0b3JpYWwvdHV0b3JpYWwuaHRtbCcsXG4gICAgICAgIGNvbnRyb2xsZXI6ICdUdXRvcmlhbEN0cmwnLFxuICAgICAgICByZXNvbHZlOiB7XG4gICAgICAgICAgICB0dXRvcmlhbEluZm86IGZ1bmN0aW9uIChUdXRvcmlhbEZhY3RvcnkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gVHV0b3JpYWxGYWN0b3J5LmdldFR1dG9yaWFsVmlkZW9zKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9KTtcblxufSk7XG5cbmFwcC5mYWN0b3J5KCdUdXRvcmlhbEZhY3RvcnknLCBmdW5jdGlvbiAoJGh0dHApIHtcblxuICAgIHJldHVybiB7XG4gICAgICAgIGdldFR1dG9yaWFsVmlkZW9zOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KCcvYXBpL3R1dG9yaWFsL3ZpZGVvcycpLnRoZW4oZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlLmRhdGE7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH07XG5cbn0pO1xuXG5hcHAuY29udHJvbGxlcignVHV0b3JpYWxDdHJsJywgZnVuY3Rpb24gKCRzY29wZSwgdHV0b3JpYWxJbmZvKSB7XG5cbiAgICAkc2NvcGUuc2VjdGlvbnMgPSB0dXRvcmlhbEluZm8uc2VjdGlvbnM7XG4gICAgJHNjb3BlLnZpZGVvcyA9IF8uZ3JvdXBCeSh0dXRvcmlhbEluZm8udmlkZW9zLCAnc2VjdGlvbicpO1xuXG4gICAgJHNjb3BlLmN1cnJlbnRTZWN0aW9uID0geyBzZWN0aW9uOiBudWxsIH07XG5cbiAgICAkc2NvcGUuY29sb3JzID0gW1xuICAgICAgICAncmdiYSgzNCwgMTA3LCAyNTUsIDAuMTApJyxcbiAgICAgICAgJ3JnYmEoMjM4LCAyNTUsIDY4LCAwLjExKScsXG4gICAgICAgICdyZ2JhKDIzNCwgNTEsIDI1NSwgMC4xMSknLFxuICAgICAgICAncmdiYSgyNTUsIDE5MywgNzMsIDAuMTEpJyxcbiAgICAgICAgJ3JnYmEoMjIsIDI1NSwgMSwgMC4xMSknXG4gICAgXTtcblxuICAgICRzY29wZS5nZXRWaWRlb3NCeVNlY3Rpb24gPSBmdW5jdGlvbiAoc2VjdGlvbiwgdmlkZW9zKSB7XG4gICAgICAgIHJldHVybiB2aWRlb3MuZmlsdGVyKGZ1bmN0aW9uICh2aWRlbykge1xuICAgICAgICAgICAgcmV0dXJuIHZpZGVvLnNlY3Rpb24gPT09IHNlY3Rpb247XG4gICAgICAgIH0pO1xuICAgIH07XG5cbn0pOyIsIid1c2Ugc3RyaWN0JztcbmFwcC5jb25maWcoZnVuY3Rpb24gKCRzdGF0ZVByb3ZpZGVyKSB7XG5cdCRzdGF0ZVByb3ZpZGVyLnN0YXRlKCdhZG1pbi51c2VyTW9kaWZ5Jywge1xuICAgICAgICB1cmw6ICcvdXNlck1vZGlmeScsXG4gICAgICAgIGNvbnRyb2xsZXI6ICd1c2VyTW9kaWZ5Q29udHJvbGxlcicsXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnanMvdXNlck1vZGlmeS91c2VyTW9kaWZ5Lmh0bWwnXG4gICAgfSk7XG59KVxuXG5hcHAuY29udHJvbGxlcigndXNlck1vZGlmeUNvbnRyb2xsZXInLCBmdW5jdGlvbiAoJHNjb3BlLCB1c2VyTW9kaWZ5RmFjdG9yeSwgJHN0YXRlLCAkc3RhdGVQYXJhbXMsIEF1dGhTZXJ2aWNlKSB7XG5cbiAgICBcbiAgICAkc2NvcGUuc3VibWl0ID0ge1xuICAgICAgICBwYXNzd29yZDogJycsXG4gICAgICAgIGVtYWlsOiAnJyxcbiAgICAgICAgbWFrZUFkbWluOiBmYWxzZVxuICAgIH1cbiAgICAkc2NvcGUuc3VjY2VzcztcblxuXG4gICAgJHNjb3BlLmNoYW5nZVBXID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHVzZXJNb2RpZnlGYWN0b3J5LnBvc3RQVygkc2NvcGUuc3VibWl0KS50aGVuKGZ1bmN0aW9uKHVzZXIsIGVycil7XG4gICAgICAgICAgICAkc2NvcGUuc3VibWl0ID0ge31cbiAgICAgICAgICAgIGlmKGVycikge1xuICAgICAgICAgICAgICAgICRzY29wZS5zdWNjZXNzPSBmYWxzZTtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnY2hhbmdpbmcgc3RhdGUnKVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZXtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygkc2NvcGUuc3VibWl0KTtcbiAgICAgICAgICAgICAgICAkc2NvcGUuc3VjY2VzcyA9IHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH0gIFxufSk7IiwiJ3VzZSBzdHJpY3QnO1xuYXBwLmZhY3RvcnkoJ0NyZWF0ZUl0ZW1GYWN0b3J5JywgZnVuY3Rpb24oJGh0dHApe1xuXHRcblx0cmV0dXJuIHtcblx0XHRwb3N0SXRlbTogZnVuY3Rpb24oZGF0YSl7XG5cdFx0XHRjb25zb2xlLmxvZygnaW50byB0aGUgZmFjdG9yeScsIGRhdGEpO1xuXHRcdFx0Ly8gcmV0dXJuICRodHRwLnBvc3QoJy9hcGkvaXRlbScsIGRhdGEpO1xuXG5cdFx0XHRyZXR1cm4gJGh0dHAucG9zdCgnL2FwaS9hZG1pbi9pdGVtQ3JlYXRlJywgZGF0YSkudGhlbihmdW5jdGlvbihyZXNwb25zZSl7XG5cdFx0XHRcdHJldHVybiByZXNwb25zZS5kYXRhO1xuXHRcdFx0fSlcblx0XHR9XG5cdH1cblxufSkiLCIndXNlIHN0cmljdCc7XG5hcHAuZmFjdG9yeSgnQ3JlYXRlVXNlckZhY3RvcnknLCBmdW5jdGlvbigkaHR0cCl7XG5cdFxuXHRyZXR1cm4ge1xuXHRcdHBvc3RVc2VyOiBmdW5jdGlvbihkYXRhKXtcblx0XHRcdGNvbnNvbGUubG9nKCdpbnRvIHVzZXIgZmFjdG9yeScsIGRhdGEpO1xuXHRcdFx0cmV0dXJuICRodHRwLnBvc3QoJy9hcGkvam9pbicsIGRhdGEpLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2Upe1xuXHRcdFx0XHRyZXR1cm4gcmVzcG9uc2UuZGF0YTtcblx0XHRcdH0pXG5cdFx0fVxuXHR9XG59KSIsIid1c2Ugc3RyaWN0JztcbmFwcC5mYWN0b3J5KCdHZXRJdGVtRmFjdG9yeScsIGZ1bmN0aW9uKCRodHRwKXtcblx0XG5cdHJldHVybiB7XG5cdFx0Z2V0SXRlbTogZnVuY3Rpb24oaWQpe1xuXHRcdFx0Ly92YXIgb3B0aW9ucyA9IHtlbWFpbDogZW1haWx9O1xuXHRcdFx0cmV0dXJuICRodHRwLmdldCgnL2FwaS9pdGVtLycraWQpLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2Upe1xuXHRcdFx0XHRyZXR1cm4gcmVzcG9uc2UuZGF0YTtcblx0XHRcdH0pXG5cdFx0fVxuXHR9XG5cbn0pIiwiJ3VzZSBzdHJpY3QnO1xuYXBwLmZhY3RvcnkoJ0dldEl0ZW1zRmFjdG9yeScsIGZ1bmN0aW9uKCRodHRwKXtcblx0XG5cdHJldHVybiB7XG5cdFx0Z2V0SXRlbXM6IGZ1bmN0aW9uKCl7XG5cdFx0XHRyZXR1cm4gJGh0dHAuZ2V0KCcvYXBpL2l0ZW1saXN0JykudGhlbihmdW5jdGlvbihyZXNwb25zZSl7XG5cdFx0XHRcdHJldHVybiByZXNwb25zZS5kYXRhO1xuXHRcdFx0fSlcblx0XHR9XG5cdH1cbn0pIiwiJ3VzZSBzdHJpY3QnO1xuYXBwLmZhY3RvcnkoJ0dldFVzZXJGYWN0b3J5JywgZnVuY3Rpb24oJGh0dHApe1xuXHRcblx0cmV0dXJuIHtcblx0XHRnZXRVc2VyOiBmdW5jdGlvbihlbWFpbCl7XG5cdFx0XHRjb25zb2xlLmxvZygnaW5zaWRlIGZhY3RvciB3aXRoOiAnLCBlbWFpbCk7XG5cdFx0XHQvL3ZhciBvcHRpb25zID0ge2VtYWlsOiBlbWFpbH07XG5cdFx0XHRyZXR1cm4gJGh0dHAuZ2V0KCcvYXBpL2xvZ2luLycgKyBlbWFpbCkudGhlbihmdW5jdGlvbihyZXNwb25zZSl7XG5cdFx0XHRcdHJldHVybiByZXNwb25zZS5kYXRhO1xuXHRcdFx0fSlcblx0XHR9XG5cdH1cbn0pIiwiJ3VzZSBzdHJpY3QnO1xuYXBwLmZhY3RvcnkoJ09yZGVyRmFjdG9yeScsIGZ1bmN0aW9uKCRodHRwKXtcblx0XG5cdHJldHVybiB7XG5cdFx0Y3JlYXRlT3JkZXI6IGZ1bmN0aW9uKGRhdGEpey8vIGRhdGEgc2hvdWxkIGJlIGluIGZvcm0ge3VzZXJJZDogdXNlci5faWQsIGl0ZW1zOiBbaXRlbTogaXRlbS5faWQsIHF0eTogcXR5XX1cblx0XHRcdHJldHVybiAkaHR0cC5wb3N0KCcvYXBpL29yZGVyJywgZGF0YSkudGhlbihmdW5jdGlvbihyZXNwb25zZSl7XG5cdFx0XHRcdHJldHVybiByZXNwb25zZS5kYXRhO1xuXHRcdFx0fSlcblx0XHR9LFxuXHRcdHVwZGF0ZU9yZGVyOiBmdW5jdGlvbihkYXRhKXsgLy9leHBlY3RzIG9yZGVySWQsIGl0ZW1JZCwgYW5kIHF1YW50aXR5IChjYXNlIHNlbnNhdGl2ZSlcblx0XHRcdHJldHVybiAkaHR0cC5wb3N0KCcvYXBpL29yZGVyL2xpbmVpdGVtJywgZGF0YSkudGhlbihmdW5jdGlvbihyZXNwb25zZSl7XG5cdFx0XHRcdHJldHVybiByZXNwb25zZS5kYXRhO1xuXHRcdFx0fSlcblx0XHR9LFxuXHRcdGdldE9yZGVyczogZnVuY3Rpb24odXNlcklkKXtcblx0XHRcdHJldHVybiAkaHR0cC5nZXQoJy9hcGkvb3JkZXIvJyt1c2VySWQpLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2Upe1xuXHRcdFx0XHRyZXR1cm4gcmVzcG9uc2UuZGF0YTtcblx0XHRcdH0pO1xuXHRcdH1cblxufX0pOyIsIid1c2Ugc3RyaWN0JztcbmFwcC5mYWN0b3J5KCdSYW5kb21HcmVldGluZ3MnLCBmdW5jdGlvbiAoKSB7XG5cbiAgICB2YXIgZ2V0UmFuZG9tRnJvbUFycmF5ID0gZnVuY3Rpb24gKGFycikge1xuICAgICAgICByZXR1cm4gYXJyW01hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIGFyci5sZW5ndGgpXTtcbiAgICB9O1xuXG4gICAgdmFyIGdyZWV0aW5ncyA9IFtcbiAgICAgICAgJ0hlbGxvLCB3b3JsZCEnLFxuICAgICAgICAnQXQgbG9uZyBsYXN0LCBJIGxpdmUhJyxcbiAgICAgICAgJ0hlbGxvLCBzaW1wbGUgaHVtYW4uJyxcbiAgICAgICAgJ1doYXQgYSBiZWF1dGlmdWwgZGF5IScsXG4gICAgICAgICdJXFwnbSBsaWtlIGFueSBvdGhlciBwcm9qZWN0LCBleGNlcHQgdGhhdCBJIGFtIHlvdXJzLiA6KScsXG4gICAgICAgICdUaGlzIGVtcHR5IHN0cmluZyBpcyBmb3IgTGluZHNheSBMZXZpbmUuJ1xuICAgIF07XG5cbiAgICByZXR1cm4ge1xuICAgICAgICBncmVldGluZ3M6IGdyZWV0aW5ncyxcbiAgICAgICAgZ2V0UmFuZG9tR3JlZXRpbmc6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiBnZXRSYW5kb21Gcm9tQXJyYXkoZ3JlZXRpbmdzKTtcbiAgICAgICAgfVxuICAgIH07XG5cbn0pOyIsIid1c2Ugc3RyaWN0JztcbiIsImFwcC5mYWN0b3J5KCdhZG1pbk5hdmJhckZhY3RvcnknLCBmdW5jdGlvbiAobmF2YmFyTWVudSkge1xuXHRcdHZhciBuYXZiYXJNZW51SXRlbXMgPSBbXG4gICAgICAgIHsgbGFiZWw6ICdIb21lJywgc3RhdGU6ICdob21lJyB9LFxuICAgICAgICB7IGxhYmVsOiAnQ3JlYXRlIEl0ZW0nLCBzdGF0ZTogJ2l0ZW1DcmVhdGUnIH0sXG4gICAgICAgIHsgbGFiZWw6ICdNb2RpZnkgVXNlcicsIHN0YXRlOiAndXNlck1vZGlmeScgfVxuICAgIF07XG5cblx0cmV0dXJuIHtcblxuXHR9XG59KSIsImFwcC5mYWN0b3J5KCdhZG1pblBvc3RVc2VyJywgZnVuY3Rpb24gKCRodHRwKSB7XG5cblx0cmV0dXJuIHtcblx0XHRwb3N0SW5mbzogZnVuY3Rpb24gKGlucHV0cykge1xuXHRcdFx0cmV0dXJuICRodHRwLnBvc3QoJ2FkbWluJywgaW5wdXRzKVxuXHRcdH1cblx0fVxufSkgIiwiJ3VzZSBzdHJpY3QnO1xuYXBwLmZhY3RvcnkoJ3VzZXJNb2RpZnlGYWN0b3J5JywgZnVuY3Rpb24oJGh0dHApe1xuXHRcblx0cmV0dXJuIHtcblx0XHRwb3N0UFc6IGZ1bmN0aW9uKGRhdGEpe1xuXHRcdFx0Y29uc29sZS5sb2coJ2ludG8gdGhlIGZhY3RvcnknLCBkYXRhKTtcblx0XHRcdC8vIHJldHVybiAkaHR0cC5wb3N0KCcvYXBpL2l0ZW0nLCBkYXRhKTtcblxuXHRcdFx0cmV0dXJuICRodHRwLnBvc3QoJy9hcGkvYWRtaW4vdXNlck1vZGlmeScsIGRhdGEpLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2Upe1xuXHRcdFx0XHRyZXR1cm4gcmVzcG9uc2UuZGF0YTtcblx0XHRcdH0pXG5cdFx0fVxuXHR9XG5cbn0pIiwiJ3VzZSBzdHJpY3QnO1xuXG5hcHAuZGlyZWN0aXZlKCd0dXRvcmlhbFNlY3Rpb24nLCBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgcmVzdHJpY3Q6ICdFJyxcbiAgICAgICAgc2NvcGU6IHtcbiAgICAgICAgICAgIG5hbWU6ICdAJyxcbiAgICAgICAgICAgIHZpZGVvczogJz0nLFxuICAgICAgICAgICAgYmFja2dyb3VuZDogJ0AnXG4gICAgICAgIH0sXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnanMvdHV0b3JpYWwvdHV0b3JpYWwtc2VjdGlvbi90dXRvcmlhbC1zZWN0aW9uLmh0bWwnLFxuICAgICAgICBsaW5rOiBmdW5jdGlvbiAoc2NvcGUsIGVsZW1lbnQpIHtcbiAgICAgICAgICAgIGVsZW1lbnQuY3NzKHsgYmFja2dyb3VuZDogc2NvcGUuYmFja2dyb3VuZCB9KTtcbiAgICAgICAgfVxuICAgIH07XG59KTsiLCIndXNlIHN0cmljdCc7XG5hcHAuZGlyZWN0aXZlKCd0dXRvcmlhbFNlY3Rpb25NZW51JywgZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB7XG4gICAgICAgIHJlc3RyaWN0OiAnRScsXG4gICAgICAgIHJlcXVpcmU6ICduZ01vZGVsJyxcbiAgICAgICAgdGVtcGxhdGVVcmw6ICdqcy90dXRvcmlhbC90dXRvcmlhbC1zZWN0aW9uLW1lbnUvdHV0b3JpYWwtc2VjdGlvbi1tZW51Lmh0bWwnLFxuICAgICAgICBzY29wZToge1xuICAgICAgICAgICAgc2VjdGlvbnM6ICc9J1xuICAgICAgICB9LFxuICAgICAgICBsaW5rOiBmdW5jdGlvbiAoc2NvcGUsIGVsZW1lbnQsIGF0dHJzLCBuZ01vZGVsQ3RybCkge1xuXG4gICAgICAgICAgICBzY29wZS5jdXJyZW50U2VjdGlvbiA9IHNjb3BlLnNlY3Rpb25zWzBdO1xuICAgICAgICAgICAgbmdNb2RlbEN0cmwuJHNldFZpZXdWYWx1ZShzY29wZS5jdXJyZW50U2VjdGlvbik7XG5cbiAgICAgICAgICAgIHNjb3BlLnNldFNlY3Rpb24gPSBmdW5jdGlvbiAoc2VjdGlvbikge1xuICAgICAgICAgICAgICAgIHNjb3BlLmN1cnJlbnRTZWN0aW9uID0gc2VjdGlvbjtcbiAgICAgICAgICAgICAgICBuZ01vZGVsQ3RybC4kc2V0Vmlld1ZhbHVlKHNlY3Rpb24pO1xuICAgICAgICAgICAgfTtcblxuICAgICAgICB9XG4gICAgfTtcbn0pOyIsIid1c2Ugc3RyaWN0JztcbmFwcC5kaXJlY3RpdmUoJ3R1dG9yaWFsVmlkZW8nLCBmdW5jdGlvbiAoJHNjZSkge1xuXG4gICAgdmFyIGZvcm1Zb3V0dWJlVVJMID0gZnVuY3Rpb24gKGlkKSB7XG4gICAgICAgIHJldHVybiAnaHR0cHM6Ly93d3cueW91dHViZS5jb20vZW1iZWQvJyArIGlkO1xuICAgIH07XG5cbiAgICByZXR1cm4ge1xuICAgICAgICByZXN0cmljdDogJ0UnLFxuICAgICAgICB0ZW1wbGF0ZVVybDogJ2pzL3R1dG9yaWFsL3R1dG9yaWFsLXZpZGVvL3R1dG9yaWFsLXZpZGVvLmh0bWwnLFxuICAgICAgICBzY29wZToge1xuICAgICAgICAgICAgdmlkZW86ICc9J1xuICAgICAgICB9LFxuICAgICAgICBsaW5rOiBmdW5jdGlvbiAoc2NvcGUpIHtcbiAgICAgICAgICAgIHNjb3BlLnRydXN0ZWRZb3V0dWJlVVJMID0gJHNjZS50cnVzdEFzUmVzb3VyY2VVcmwoZm9ybVlvdXR1YmVVUkwoc2NvcGUudmlkZW8ueW91dHViZUlEKSk7XG4gICAgICAgIH1cbiAgICB9O1xuXG59KTsiLCIiLCIndXNlIHN0cmljdCc7XG5hcHAuZGlyZWN0aXZlKCdmdWxsc3RhY2tMb2dvJywgZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB7XG4gICAgICAgIHJlc3RyaWN0OiAnRScsXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnanMvY29tbW9uL2RpcmVjdGl2ZXMvZnVsbHN0YWNrLWxvZ28vZnVsbHN0YWNrLWxvZ28uaHRtbCdcbiAgICB9O1xufSk7IiwiJ3VzZSBzdHJpY3QnO1xuYXBwLmRpcmVjdGl2ZSgnbmF2YmFyJywgZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB7XG4gICAgICAgIHJlc3RyaWN0OiAnRScsXG4gICAgICAgIHNjb3BlOiB7XG4gICAgICAgICAgaXRlbXM6ICc9JyxcbiAgICAgICAgICBjdXJyZW50VXNlckFkbWluOiAnPScsXG4gICAgICAgICAgYWRtaW5JdGVtczogJz0nXG4gICAgICAgIH0sXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnanMvY29tbW9uL2RpcmVjdGl2ZXMvbmF2YmFyL25hdmJhci5odG1sJ1xuICAgIH07XG59KTsiLCIndXNlIHN0cmljdCc7XG5hcHAuZGlyZWN0aXZlKCdyYW5kb0dyZWV0aW5nJywgZnVuY3Rpb24gKFJhbmRvbUdyZWV0aW5ncykge1xuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgcmVzdHJpY3Q6ICdFJyxcbiAgICAgICAgdGVtcGxhdGVVcmw6ICdqcy9jb21tb24vZGlyZWN0aXZlcy9yYW5kby1ncmVldGluZy9yYW5kby1ncmVldGluZy5odG1sJyxcbiAgICAgICAgbGluazogZnVuY3Rpb24gKHNjb3BlKSB7XG4gICAgICAgICAgICBzY29wZS5ncmVldGluZyA9IFJhbmRvbUdyZWV0aW5ncy5nZXRSYW5kb21HcmVldGluZygpO1xuICAgICAgICB9XG4gICAgfTtcblxufSk7IiwiJ3VzZSBzdHJpY3QnO1xuYXBwLmRpcmVjdGl2ZSgnc3BlY3N0YWNrdWxhckxvZ28nLCBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgcmVzdHJpY3Q6ICdFJyxcbiAgICAgICAgdGVtcGxhdGVVcmw6ICdqcy9jb21tb24vZGlyZWN0aXZlcy9zcGVjc3RhY2t1bGFyLWxvZ28vc3BlY3N0YWNrdWxhci1sb2dvLmh0bWwnXG4gICAgfTtcbn0pOyJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==