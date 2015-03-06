'use strict';
// var app = angular.module('FullstackGeneratedApp', ['ui.router', 'fsaPreBuilt']);
var app = angular.module('specStackular', ['ui.router', 'fsaPreBuilt', 'ngCookies']);
app.controller('MainController',  function ($scope) {

    // Given to the <navbar> directive to show the menu.
    $scope.menuItems = [
        { label: 'Home', state: 'home' },
        { label: 'Product list', state: 'products' },
        { label: 'Register', state: 'join' },
        { label: 'Log In', state: 'login'},
        { label: 'Create a product', state: 'itemCreate' },
        { label: 'About', state: 'about' },
        { label: 'My Orders', state: 'orders'}
    ];

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

    // Register our *about* state.
    $stateProvider.state('products', {
        url: '/products',
        controller: 'allItemsController',
        templateUrl: 'js/allitems/allitems.html'
    });

});

app.controller('allItemsController', function ($scope, GetItemsFactory, $state, $stateParams, $cookieStore) {

	GetItemsFactory.getItems().then(function(items, err){
		if(err) throw err;
		else{
			$scope.items = items;
		}
	});

	$scope.addToOrder = function(specificItem){
		console.log('got into the function');
		// $cookieStore.remove('Order');
		var order = $cookieStore.get('Order');
		var line = {item: specificItem, qty: 1};
			console.log('added item to order');
			order.push(line);
			$cookieStore.put('Order', order);
		console.log('Total Order: ', $cookieStore.get('Order'));
	}
});
// app.config(function ($stateProvider) {

    // Register our *Join Now* state.
    // $stateProvider.state('create-account', {
    //     url: '/create-account',
        //controller: 'joinController',
//         templateUrl: 'js/create-account/create-account.html'
//     });

// });
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

    // Register our *about* state.
    $stateProvider.state('item', {
        url: '/item/:name',
        controller: 'itemController',
        templateUrl: 'js/item/item.html'
    });

});

app.controller('itemController', ['$cookies', function ($scope, GetItemFactory, $state, $stateParams, $cookies) {

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
		var order = $cookies.get('Order');
		var line = {item: $scope.item, qty: 1};
			if(!order){
				$cookies.put('Order', line);
			}
			else{
				order.push(line);
				$cookies.put('Order', order);
			}
	}
}]);
'use strict';
app.config(function ($stateProvider) {

    // Register our *about* state.
    $stateProvider.state('itemCreate', {
        url: '/create/item',
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


app.controller('loginController', function($scope, $window, GetUserFactory) {
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
	    		console.log(user);
	    		$scope.user.email = user[0].email;
	    	}
	    });
	}
});

'use strict';
app.config(function ($stateProvider) {

    // Register our *about* state.
    $stateProvider.state('orders', {
        url: '/order/:name',
        controller: 'orderController',
        templateUrl: 'js/order/order.html'
    });

});

app.controller('orderController', function ($scope, OrderFactory, $state, $stateParams, $cookieStore) {

	//provides general functionality with an order
	//views current user order
		//order is shown by line item
		//has ability to edit order, or proceed to checkout
	$scope.activeorders=[];
	$scope.pastorders=[];
	$scope.prof;

	$scope.sum = function(){

	};

	$scope.totalQty = function(){

	};


	$scope.updateOrder = function(){
		//takes in information about the user, 
		OrderFactory.updateOrder();

	}; 
	//get user information and send Id

	$scope.showCookie = function(){
		console.log($cookieStore.get('Order'));
		$scope.activeorders = $cookieStore.get('Order');
	}

	// if(authenticated){
	// 	OrderFactory.getOrders().then(function(items, err){
	// 		if (err) console.log('Error: ', err);

	// 		else if(!items) {
	// 			console.log('No current order'); //not sure what else needs to be declared.
	// 		}
	// 		else {
	// 			$scope.prof = items.info;
	// 			items.lineItems.forEach(function(thing){
	// 				if(thing.info.status === 'open'){
	// 					$scope.activeorders.push(thing);
	// 				}
	// 				else {
	// 					$scope.pastorders.push(thing);
	// 				}
	// 			});	
	// 		}
	// 	});
	// }

	// else{
		$scope.activeorders = $cookieStore.get('Order');
		$scope.prof = 'User';
	// }
	
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
app.factory('CreateItemFactory', function($http){
	
	return {
		postItem: function(data){
			console.log('into the factory', data);
			// return $http.post('/api/item', data);

			return $http.post('/api/item', data).then(function(response){
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
			return $http.post('/api/user', data).then(function(response){
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
			return $http.get('/api/user/' + email).then(function(response){
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
          items: '='
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyIsImFib3V0L2Fib3V0LmpzIiwiYWxsSXRlbXMvYWxsSXRlbXMuanMiLCJjcmVhdGUtYWNjb3VudC9jcmVhdGUtYWNjb3VudC5qcyIsImZzYS9mc2EtcHJlLWJ1aWx0LmpzIiwiaG9tZS9ob21lLmpzIiwiaXRlbS9pdGVtLmpzIiwiaXRlbUNyZWF0ZS9pdGVtQ3JlYXRlLmpzIiwiam9pbm5vdy9qb2lubm93LmpzIiwibG9naW4vbG9naW4uanMiLCJvcmRlci9vcmRlci5qcyIsInRlc3RTdHJpcGUvc3RyaXBlLmpzIiwidHV0b3JpYWwvdHV0b3JpYWwuanMiLCJjb21tb24vZmFjdG9yaWVzL0NyZWF0ZUl0ZW1GYWN0b3J5LmpzIiwiY29tbW9uL2ZhY3Rvcmllcy9DcmVhdGVVc2VyRmFjdG9yeS5qcyIsImNvbW1vbi9mYWN0b3JpZXMvR2V0SXRlbUZhY3RvcnkuanMiLCJjb21tb24vZmFjdG9yaWVzL0dldEl0ZW1zRmFjdG9yeS5qcyIsImNvbW1vbi9mYWN0b3JpZXMvR2V0VXNlckZhY3RvcnkuanMiLCJjb21tb24vZmFjdG9yaWVzL09yZGVyRmFjdG9yeS5qcyIsImNvbW1vbi9mYWN0b3JpZXMvUmFuZG9tR3JlZXRpbmdzLmpzIiwiY29tbW9uL2ZhY3Rvcmllcy9Tb2NrZXQuanMiLCJ0dXRvcmlhbC90dXRvcmlhbC1zZWN0aW9uL3R1dG9yaWFsLXNlY3Rpb24uanMiLCJ0dXRvcmlhbC90dXRvcmlhbC1zZWN0aW9uLW1lbnUvdHV0b3JpYWwtc2VjdGlvbi1tZW51LmpzIiwidHV0b3JpYWwvdHV0b3JpYWwtdmlkZW8vdHV0b3JpYWwtdmlkZW8uanMiLCJjb21tb24vZGlyZWN0aXZlcy9mdWxsc3RhY2stbG9nby9mdWxsc3RhY2stbG9nby5qcyIsImNvbW1vbi9kaXJlY3RpdmVzL25hdmJhci9uYXZiYXIuanMiLCJjb21tb24vZGlyZWN0aXZlcy9yYW5kby1ncmVldGluZy9yYW5kby1ncmVldGluZy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2pIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDaERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDOUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3RDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzlCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3JFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNkQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDakRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDWkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNiQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3ZCQTtBQUNBO0FDREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNmQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3JCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2xCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6Im1haW4uanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHN0cmljdCc7XG4vLyB2YXIgYXBwID0gYW5ndWxhci5tb2R1bGUoJ0Z1bGxzdGFja0dlbmVyYXRlZEFwcCcsIFsndWkucm91dGVyJywgJ2ZzYVByZUJ1aWx0J10pO1xudmFyIGFwcCA9IGFuZ3VsYXIubW9kdWxlKCdzcGVjU3RhY2t1bGFyJywgWyd1aS5yb3V0ZXInLCAnZnNhUHJlQnVpbHQnLCAnbmdDb29raWVzJ10pO1xuYXBwLmNvbnRyb2xsZXIoJ01haW5Db250cm9sbGVyJywgIGZ1bmN0aW9uICgkc2NvcGUpIHtcblxuICAgIC8vIEdpdmVuIHRvIHRoZSA8bmF2YmFyPiBkaXJlY3RpdmUgdG8gc2hvdyB0aGUgbWVudS5cbiAgICAkc2NvcGUubWVudUl0ZW1zID0gW1xuICAgICAgICB7IGxhYmVsOiAnSG9tZScsIHN0YXRlOiAnaG9tZScgfSxcbiAgICAgICAgeyBsYWJlbDogJ1Byb2R1Y3QgbGlzdCcsIHN0YXRlOiAncHJvZHVjdHMnIH0sXG4gICAgICAgIHsgbGFiZWw6ICdSZWdpc3RlcicsIHN0YXRlOiAnam9pbicgfSxcbiAgICAgICAgeyBsYWJlbDogJ0xvZyBJbicsIHN0YXRlOiAnbG9naW4nfSxcbiAgICAgICAgeyBsYWJlbDogJ0NyZWF0ZSBhIHByb2R1Y3QnLCBzdGF0ZTogJ2l0ZW1DcmVhdGUnIH0sXG4gICAgICAgIHsgbGFiZWw6ICdBYm91dCcsIHN0YXRlOiAnYWJvdXQnIH0sXG4gICAgICAgIHsgbGFiZWw6ICdNeSBPcmRlcnMnLCBzdGF0ZTogJ29yZGVycyd9XG4gICAgXTtcblxufSk7XG5cblxuYXBwLmNvbmZpZyhmdW5jdGlvbiAoJHVybFJvdXRlclByb3ZpZGVyLCAkbG9jYXRpb25Qcm92aWRlcikge1xuICAgIC8vIFRoaXMgdHVybnMgb2ZmIGhhc2hiYW5nIHVybHMgKC8jYWJvdXQpIGFuZCBjaGFuZ2VzIGl0IHRvIHNvbWV0aGluZyBub3JtYWwgKC9hYm91dClcbiAgICAkbG9jYXRpb25Qcm92aWRlci5odG1sNU1vZGUodHJ1ZSk7XG4gICAgLy8gSWYgd2UgZ28gdG8gYSBVUkwgdGhhdCB1aS1yb3V0ZXIgZG9lc24ndCBoYXZlIHJlZ2lzdGVyZWQsIGdvIHRvIHRoZSBcIi9cIiB1cmwuXG4gICAgJHVybFJvdXRlclByb3ZpZGVyLm90aGVyd2lzZSgnLycpO1xufSk7IiwiJ3VzZSBzdHJpY3QnO1xuYXBwLmNvbmZpZyhmdW5jdGlvbiAoJHN0YXRlUHJvdmlkZXIpIHtcblxuICAgIC8vIFJlZ2lzdGVyIG91ciAqYWJvdXQqIHN0YXRlLlxuICAgICRzdGF0ZVByb3ZpZGVyLnN0YXRlKCdhYm91dCcsIHtcbiAgICAgICAgdXJsOiAnL2Fib3V0JyxcbiAgICAgICAgY29udHJvbGxlcjogJ0Fib3V0Q29udHJvbGxlcicsXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnanMvYWJvdXQvYWJvdXQuaHRtbCdcbiAgICB9KTtcblxufSk7XG5cbmFwcC5jb250cm9sbGVyKCdBYm91dENvbnRyb2xsZXInLCBmdW5jdGlvbiAoJHNjb3BlKSB7XG5cbiAgICAvLyBJbWFnZXMgb2YgYmVhdXRpZnVsIEZ1bGxzdGFjayBwZW9wbGUuXG4gICAgJHNjb3BlLmltYWdlcyA9IFtcbiAgICAgICAgJ2h0dHBzOi8vcGJzLnR3aW1nLmNvbS9tZWRpYS9CN2dCWHVsQ0FBQVhRY0UuanBnOmxhcmdlJyxcbiAgICAgICAgJ2h0dHBzOi8vZmJjZG4tc3Bob3Rvcy1jLWEuYWthbWFpaGQubmV0L2hwaG90b3MtYWsteGFwMS90MzEuMC04LzEwODYyNDUxXzEwMjA1NjIyOTkwMzU5MjQxXzgwMjcxNjg4NDMzMTI4NDExMzdfby5qcGcnLFxuICAgICAgICAnaHR0cHM6Ly9wYnMudHdpbWcuY29tL21lZGlhL0ItTEtVc2hJZ0FFeTlTSy5qcGcnLFxuICAgICAgICAnaHR0cHM6Ly9wYnMudHdpbWcuY29tL21lZGlhL0I3OS1YN29DTUFBa3c3eS5qcGcnLFxuICAgICAgICAnaHR0cHM6Ly9wYnMudHdpbWcuY29tL21lZGlhL0ItVWo5Q09JSUFJRkFoMC5qcGc6bGFyZ2UnLFxuICAgICAgICAnaHR0cHM6Ly9wYnMudHdpbWcuY29tL21lZGlhL0I2eUl5RmlDRUFBcWwxMi5qcGc6bGFyZ2UnXG4gICAgXTtcblxufSk7IiwiJ3VzZSBzdHJpY3QnO1xuXG5hcHAucnVuKGZ1bmN0aW9uICgkY29va2llcywgJGNvb2tpZVN0b3JlKSB7XG5cblx0dmFyIGluaXQgPSAkY29va2llU3RvcmUuZ2V0KCdPcmRlcicpO1xuXHRpZighaW5pdCl7XG5cdFx0JGNvb2tpZVN0b3JlLnB1dCgnT3JkZXInLCBbXSk7XG5cdFx0Y29uc29sZS5sb2coJ3N0YXJ0aW5nIGNvb2tpZTogJywgJGNvb2tpZVN0b3JlLmdldCgnT3JkZXInKSk7XG5cdH1cblxufSk7XG5cbmFwcC5jb25maWcoZnVuY3Rpb24gKCRzdGF0ZVByb3ZpZGVyKSB7XG5cbiAgICAvLyBSZWdpc3RlciBvdXIgKmFib3V0KiBzdGF0ZS5cbiAgICAkc3RhdGVQcm92aWRlci5zdGF0ZSgncHJvZHVjdHMnLCB7XG4gICAgICAgIHVybDogJy9wcm9kdWN0cycsXG4gICAgICAgIGNvbnRyb2xsZXI6ICdhbGxJdGVtc0NvbnRyb2xsZXInLFxuICAgICAgICB0ZW1wbGF0ZVVybDogJ2pzL2FsbGl0ZW1zL2FsbGl0ZW1zLmh0bWwnXG4gICAgfSk7XG5cbn0pO1xuXG5hcHAuY29udHJvbGxlcignYWxsSXRlbXNDb250cm9sbGVyJywgZnVuY3Rpb24gKCRzY29wZSwgR2V0SXRlbXNGYWN0b3J5LCAkc3RhdGUsICRzdGF0ZVBhcmFtcywgJGNvb2tpZVN0b3JlKSB7XG5cblx0R2V0SXRlbXNGYWN0b3J5LmdldEl0ZW1zKCkudGhlbihmdW5jdGlvbihpdGVtcywgZXJyKXtcblx0XHRpZihlcnIpIHRocm93IGVycjtcblx0XHRlbHNle1xuXHRcdFx0JHNjb3BlLml0ZW1zID0gaXRlbXM7XG5cdFx0fVxuXHR9KTtcblxuXHQkc2NvcGUuYWRkVG9PcmRlciA9IGZ1bmN0aW9uKHNwZWNpZmljSXRlbSl7XG5cdFx0Y29uc29sZS5sb2coJ2dvdCBpbnRvIHRoZSBmdW5jdGlvbicpO1xuXHRcdC8vICRjb29raWVTdG9yZS5yZW1vdmUoJ09yZGVyJyk7XG5cdFx0dmFyIG9yZGVyID0gJGNvb2tpZVN0b3JlLmdldCgnT3JkZXInKTtcblx0XHR2YXIgbGluZSA9IHtpdGVtOiBzcGVjaWZpY0l0ZW0sIHF0eTogMX07XG5cdFx0XHRjb25zb2xlLmxvZygnYWRkZWQgaXRlbSB0byBvcmRlcicpO1xuXHRcdFx0b3JkZXIucHVzaChsaW5lKTtcblx0XHRcdCRjb29raWVTdG9yZS5wdXQoJ09yZGVyJywgb3JkZXIpO1xuXHRcdGNvbnNvbGUubG9nKCdUb3RhbCBPcmRlcjogJywgJGNvb2tpZVN0b3JlLmdldCgnT3JkZXInKSk7XG5cdH1cbn0pOyIsIi8vIGFwcC5jb25maWcoZnVuY3Rpb24gKCRzdGF0ZVByb3ZpZGVyKSB7XG5cbiAgICAvLyBSZWdpc3RlciBvdXIgKkpvaW4gTm93KiBzdGF0ZS5cbiAgICAvLyAkc3RhdGVQcm92aWRlci5zdGF0ZSgnY3JlYXRlLWFjY291bnQnLCB7XG4gICAgLy8gICAgIHVybDogJy9jcmVhdGUtYWNjb3VudCcsXG4gICAgICAgIC8vY29udHJvbGxlcjogJ2pvaW5Db250cm9sbGVyJyxcbi8vICAgICAgICAgdGVtcGxhdGVVcmw6ICdqcy9jcmVhdGUtYWNjb3VudC9jcmVhdGUtYWNjb3VudC5odG1sJ1xuLy8gICAgIH0pO1xuXG4vLyB9KTsiLCIoZnVuY3Rpb24gKCkge1xuXG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgLy8gSG9wZSB5b3UgZGlkbid0IGZvcmdldCBBbmd1bGFyISBEdWgtZG95LlxuICAgIGlmICghd2luZG93LmFuZ3VsYXIpIHRocm93IG5ldyBFcnJvcignSSBjYW5cXCd0IGZpbmQgQW5ndWxhciEnKTtcblxuICAgIHZhciBhcHAgPSBhbmd1bGFyLm1vZHVsZSgnZnNhUHJlQnVpbHQnLCBbXSk7XG5cbiAgICBhcHAuZmFjdG9yeSgnU29ja2V0JywgZnVuY3Rpb24gKCRsb2NhdGlvbikge1xuXG4gICAgICAgIGlmICghd2luZG93LmlvKSB0aHJvdyBuZXcgRXJyb3IoJ3NvY2tldC5pbyBub3QgZm91bmQhJyk7XG5cbiAgICAgICAgdmFyIHNvY2tldDtcblxuICAgICAgICBpZiAoJGxvY2F0aW9uLiQkcG9ydCkge1xuICAgICAgICAgICAgc29ja2V0ID0gaW8oJ2h0dHA6Ly9sb2NhbGhvc3Q6MTMzNycpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgc29ja2V0ID0gaW8oJy8nKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBzb2NrZXQ7XG5cbiAgICB9KTtcblxuICAgIGFwcC5jb25zdGFudCgnQVVUSF9FVkVOVFMnLCB7XG4gICAgICAgIGxvZ2luU3VjY2VzczogJ2F1dGgtbG9naW4tc3VjY2VzcycsXG4gICAgICAgIGxvZ2luRmFpbGVkOiAnYXV0aC1sb2dpbi1mYWlsZWQnLFxuICAgICAgICBsb2dvdXRTdWNjZXNzOiAnYXV0aC1sb2dvdXQtc3VjY2VzcycsXG4gICAgICAgIHNlc3Npb25UaW1lb3V0OiAnYXV0aC1zZXNzaW9uLXRpbWVvdXQnLFxuICAgICAgICBub3RBdXRoZW50aWNhdGVkOiAnYXV0aC1ub3QtYXV0aGVudGljYXRlZCcsXG4gICAgICAgIG5vdEF1dGhvcml6ZWQ6ICdhdXRoLW5vdC1hdXRob3JpemVkJ1xuICAgIH0pO1xuXG4gICAgYXBwLmNvbmZpZyhmdW5jdGlvbiAoJGh0dHBQcm92aWRlcikge1xuICAgICAgICAkaHR0cFByb3ZpZGVyLmludGVyY2VwdG9ycy5wdXNoKFtcbiAgICAgICAgICAgICckaW5qZWN0b3InLFxuICAgICAgICAgICAgZnVuY3Rpb24gKCRpbmplY3Rvcikge1xuICAgICAgICAgICAgICAgIHJldHVybiAkaW5qZWN0b3IuZ2V0KCdBdXRoSW50ZXJjZXB0b3InKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgXSk7XG4gICAgfSk7XG5cbiAgICBhcHAuZmFjdG9yeSgnQXV0aEludGVyY2VwdG9yJywgZnVuY3Rpb24gKCRyb290U2NvcGUsICRxLCBBVVRIX0VWRU5UUykge1xuICAgICAgICB2YXIgc3RhdHVzRGljdCA9IHtcbiAgICAgICAgICAgIDQwMTogQVVUSF9FVkVOVFMubm90QXV0aGVudGljYXRlZCxcbiAgICAgICAgICAgIDQwMzogQVVUSF9FVkVOVFMubm90QXV0aG9yaXplZCxcbiAgICAgICAgICAgIDQxOTogQVVUSF9FVkVOVFMuc2Vzc2lvblRpbWVvdXQsXG4gICAgICAgICAgICA0NDA6IEFVVEhfRVZFTlRTLnNlc3Npb25UaW1lb3V0XG4gICAgICAgIH07XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICByZXNwb25zZUVycm9yOiBmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgICAgICAgICAgICAgICAkcm9vdFNjb3BlLiRicm9hZGNhc3Qoc3RhdHVzRGljdFtyZXNwb25zZS5zdGF0dXNdLCByZXNwb25zZSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuICRxLnJlamVjdChyZXNwb25zZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgfSk7XG5cbiAgICBhcHAuc2VydmljZSgnQXV0aFNlcnZpY2UnLCBmdW5jdGlvbiAoJGh0dHAsIFNlc3Npb24sICRyb290U2NvcGUsIEFVVEhfRVZFTlRTLCAkcSkge1xuXG4gICAgICAgIHZhciBvblN1Y2Nlc3NmdWxMb2dpbiA9IGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICAgICAgICAgICAgdmFyIGRhdGEgPSByZXNwb25zZS5kYXRhO1xuICAgICAgICAgICAgU2Vzc2lvbi5jcmVhdGUoZGF0YS5pZCwgZGF0YS51c2VyKTtcbiAgICAgICAgICAgICRyb290U2NvcGUuJGJyb2FkY2FzdChBVVRIX0VWRU5UUy5sb2dpblN1Y2Nlc3MpO1xuICAgICAgICAgICAgcmV0dXJuIGRhdGEudXNlcjtcbiAgICAgICAgfTtcblxuICAgICAgICB0aGlzLmdldExvZ2dlZEluVXNlciA9IGZ1bmN0aW9uICgpIHtcblxuICAgICAgICAgICAgaWYgKHRoaXMuaXNBdXRoZW50aWNhdGVkKCkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gJHEud2hlbih7IHVzZXI6IFNlc3Npb24udXNlciB9KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuICRodHRwLmdldCgnL3Nlc3Npb24nKS50aGVuKG9uU3VjY2Vzc2Z1bExvZ2luKS5jYXRjaChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICB9O1xuXG4gICAgICAgIHRoaXMubG9naW4gPSBmdW5jdGlvbiAoY3JlZGVudGlhbHMpIHtcbiAgICAgICAgICAgIHJldHVybiAkaHR0cC5wb3N0KCcvbG9naW4nLCBjcmVkZW50aWFscykudGhlbihvblN1Y2Nlc3NmdWxMb2dpbik7XG4gICAgICAgIH07XG5cbiAgICAgICAgdGhpcy5sb2dvdXQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KCcvbG9nb3V0JykudGhlbihmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgU2Vzc2lvbi5kZXN0cm95KCk7XG4gICAgICAgICAgICAgICAgJHJvb3RTY29wZS4kYnJvYWRjYXN0KEFVVEhfRVZFTlRTLmxvZ291dFN1Y2Nlc3MpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgdGhpcy5pc0F1dGhlbnRpY2F0ZWQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gISFTZXNzaW9uLnVzZXI7XG4gICAgICAgIH07XG5cbiAgICB9KTtcblxuICAgIGFwcC5zZXJ2aWNlKCdTZXNzaW9uJywgZnVuY3Rpb24gKCRyb290U2NvcGUsIEFVVEhfRVZFTlRTKSB7XG5cbiAgICAgICAgJHJvb3RTY29wZS4kb24oQVVUSF9FVkVOVFMubm90QXV0aGVudGljYXRlZCwgdGhpcy5kZXN0cm95KTtcbiAgICAgICAgJHJvb3RTY29wZS4kb24oQVVUSF9FVkVOVFMuc2Vzc2lvblRpbWVvdXQsIHRoaXMuZGVzdHJveSk7XG5cbiAgICAgICAgdGhpcy5jcmVhdGUgPSBmdW5jdGlvbiAoc2Vzc2lvbklkLCB1c2VyKSB7XG4gICAgICAgICAgICB0aGlzLmlkID0gc2Vzc2lvbklkO1xuICAgICAgICAgICAgdGhpcy51c2VyID0gdXNlcjtcbiAgICAgICAgfTtcblxuICAgICAgICB0aGlzLmRlc3Ryb3kgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB0aGlzLmlkID0gbnVsbDtcbiAgICAgICAgICAgIHRoaXMudXNlciA9IG51bGw7XG4gICAgICAgIH07XG5cbiAgICB9KTtcblxufSkoKTsiLCIndXNlIHN0cmljdCc7XG5hcHAuY29uZmlnKGZ1bmN0aW9uICgkc3RhdGVQcm92aWRlcikge1xuXG4gICAgJHN0YXRlUHJvdmlkZXIuc3RhdGUoJ2hvbWUnLCB7XG4gICAgICAgIHVybDogJy8nLFxuICAgICAgICBjb250cm9sbGVyOiAnSG9tZUN0cmwnLFxuICAgICAgICB0ZW1wbGF0ZVVybDogJ2pzL2hvbWUvaG9tZS5odG1sJ1xuICAgIH0pO1xuXG59KTtcblxuYXBwLmNvbnRyb2xsZXIoJ0hvbWVDdHJsJywgZnVuY3Rpb24gKCRzY29wZSkge1xufSk7IiwiJ3VzZSBzdHJpY3QnO1xuXG5hcHAucnVuKGZ1bmN0aW9uICgkY29va2llcywgJGNvb2tpZVN0b3JlKSB7XG5cblx0dmFyIGluaXQgPSAkY29va2llU3RvcmUuZ2V0KCdPcmRlcicpO1xuXHRpZighaW5pdCl7XG5cdFx0JGNvb2tpZVN0b3JlLnB1dCgnT3JkZXInLCBbXSk7XG5cdFx0Y29uc29sZS5sb2coJ3N0YXJ0aW5nIGNvb2tpZTogJywgJGNvb2tpZVN0b3JlLmdldCgnT3JkZXInKSk7XG5cdH1cblxufSk7XG5cbmFwcC5jb25maWcoZnVuY3Rpb24gKCRzdGF0ZVByb3ZpZGVyKSB7XG5cbiAgICAvLyBSZWdpc3RlciBvdXIgKmFib3V0KiBzdGF0ZS5cbiAgICAkc3RhdGVQcm92aWRlci5zdGF0ZSgnaXRlbScsIHtcbiAgICAgICAgdXJsOiAnL2l0ZW0vOm5hbWUnLFxuICAgICAgICBjb250cm9sbGVyOiAnaXRlbUNvbnRyb2xsZXInLFxuICAgICAgICB0ZW1wbGF0ZVVybDogJ2pzL2l0ZW0vaXRlbS5odG1sJ1xuICAgIH0pO1xuXG59KTtcblxuYXBwLmNvbnRyb2xsZXIoJ2l0ZW1Db250cm9sbGVyJywgWyckY29va2llcycsIGZ1bmN0aW9uICgkc2NvcGUsIEdldEl0ZW1GYWN0b3J5LCAkc3RhdGUsICRzdGF0ZVBhcmFtcywgJGNvb2tpZXMpIHtcblxuXHQvL2dldCBpbnB1dCBmcm9tIHVzZXIgYWJvdXQgaXRlbSAoaWQgZnJvbSB1cmwgKVxuXHQvL2NoZWNrIGlkIHZzIGRhdGFiYXNlXG5cdC8vaWYgbm90IGZvdW5kLCByZWRpcmVjdCB0byBzZWFyY2ggcGFnZVxuXHQvL2lmIGZvdW5kIHNlbmQgdGVtcGFsYXRlVXJsXG5cblx0R2V0SXRlbUZhY3RvcnkuZ2V0SXRlbSgkc3RhdGVQYXJhbXMubmFtZSkudGhlbihmdW5jdGlvbihpdGVtLCBlcnIpe1xuXHRcdGlmKGVycikgJHN0YXRlLmdvKCdob21lJyk7XG5cdFx0ZWxzZXtcblx0XHRcdCRzY29wZS5pdGVtID0gaXRlbVswXTtcblx0XHRcdH1cblx0fSk7XG5cblx0JHNjb3BlLmFkZFRvT3JkZXIgPSBmdW5jdGlvbigpe1xuXHRcdHZhciBvcmRlciA9ICRjb29raWVzLmdldCgnT3JkZXInKTtcblx0XHR2YXIgbGluZSA9IHtpdGVtOiAkc2NvcGUuaXRlbSwgcXR5OiAxfTtcblx0XHRcdGlmKCFvcmRlcil7XG5cdFx0XHRcdCRjb29raWVzLnB1dCgnT3JkZXInLCBsaW5lKTtcblx0XHRcdH1cblx0XHRcdGVsc2V7XG5cdFx0XHRcdG9yZGVyLnB1c2gobGluZSk7XG5cdFx0XHRcdCRjb29raWVzLnB1dCgnT3JkZXInLCBvcmRlcik7XG5cdFx0XHR9XG5cdH1cbn1dKTsiLCIndXNlIHN0cmljdCc7XG5hcHAuY29uZmlnKGZ1bmN0aW9uICgkc3RhdGVQcm92aWRlcikge1xuXG4gICAgLy8gUmVnaXN0ZXIgb3VyICphYm91dCogc3RhdGUuXG4gICAgJHN0YXRlUHJvdmlkZXIuc3RhdGUoJ2l0ZW1DcmVhdGUnLCB7XG4gICAgICAgIHVybDogJy9jcmVhdGUvaXRlbScsXG4gICAgICAgIGNvbnRyb2xsZXI6ICdpdGVtQ3JlYXRlQ29udHJvbGxlcicsXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnanMvaXRlbUNyZWF0ZS9pdGVtQ3JlYXRlLmh0bWwnXG4gICAgfSk7XG5cbn0pO1xuXG5hcHAuY29udHJvbGxlcignaXRlbUNyZWF0ZUNvbnRyb2xsZXInLCBmdW5jdGlvbiAoJHNjb3BlLCBDcmVhdGVJdGVtRmFjdG9yeSwgJHN0YXRlLCAkc3RhdGVQYXJhbXMpIHtcblxuXHQkc2NvcGUuaXRlbSA9IHtcblx0XHRjYXRlZ29yaWVzOiBbXSB9O1xuXHQkc2NvcGUuc3VjY2VzcztcblxuXHQkc2NvcGUuc3VibWl0SXRlbSA9IGZ1bmN0aW9uKCkge1xuXHRcdC8vJHNjb3BlLml0ZW0uY2F0ZWdvcmllcyA9ICRzY29wZS5pdGVtLmNhdGVnb3JpZXMuc3BsaXQoJyAnKTtcblx0XHRjb25zb2xlLmxvZygncHJvY2VzcyBzdGFydGVkJyk7XG5cdFx0Y29uc29sZS5sb2coJHNjb3BlLml0ZW0pO1xuXHRcdENyZWF0ZUl0ZW1GYWN0b3J5LnBvc3RJdGVtKCRzY29wZS5pdGVtKS50aGVuKGZ1bmN0aW9uKGl0ZW0sIGVycil7XG5cdFx0XHRpZihlcnIpICRzY29wZS5zdWNjZXNzPSBmYWxzZTtcblx0XHRcdGVsc2V7XG5cdFx0XHRcdGNvbnNvbGUubG9nKGl0ZW0pO1xuXHRcdFx0XHQkc2NvcGUuc3VjY2VzcyA9IHRydWU7XG5cdFx0XHR9XG5cdFx0fSk7XG5cdH1cbn0pOyIsImFwcC5jb25maWcoZnVuY3Rpb24gKCRzdGF0ZVByb3ZpZGVyKSB7XG5cbiAgICAvLyBSZWdpc3RlciBvdXIgKkpvaW4gTm93KiBzdGF0ZS5cbiAgICAkc3RhdGVQcm92aWRlci5zdGF0ZSgnam9pbicsIHtcbiAgICAgICAgdXJsOiAnL2pvaW4nLFxuICAgICAgICBjb250cm9sbGVyOiAnam9pbkNvbnRyb2xsZXInLFxuXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnanMvam9pbm5vdy9qb2lubm93Lmh0bWwnIFxuXG4gICAgfSk7XG5cbn0pO1xuXG5cblxuYXBwLmNvbnRyb2xsZXIoJ2pvaW5Db250cm9sbGVyJywgZnVuY3Rpb24oJHNjb3BlLCAkd2luZG93LCBDcmVhdGVVc2VyRmFjdG9yeSkge1xuXG4gICAgJHNjb3BlLmxvZ2lub2F1dGggPSBmdW5jdGlvbiAocHJvdmlkZXIpIHtcbiAgICAgICAgdmFyIGxvY2F0aW9uID0gJ2F1dGgvJyArIHByb3ZpZGVyO1xuICAgICAgICAkd2luZG93LmxvY2F0aW9uLmhyZWYgPSBsb2NhdGlvbjtcbiAgICB9XG5cbiAgICAkc2NvcGUuc3VjY2VzcztcblxuXG4gICAgJHNjb3BlLnN1Ym1pdFVzZXIgPSBmdW5jdGlvbigpIHtcbiAgICBcdGNvbnNvbGUubG9nKFwidXNlciBzdWJtaXQgcHJvY2VzcyBzdGFydGVkXCIpO1xuICAgIFx0Y29uc29sZS5sb2coJHNjb3BlLnVzZXIpO1xuXHQgICAgQ3JlYXRlVXNlckZhY3RvcnkucG9zdFVzZXIoJHNjb3BlLnVzZXIpLnRoZW4oZnVuY3Rpb24odXNlciwgZXJyKXtcblx0ICAgIFx0aWYgKGVycikgJHNjb3BlLnN1Y2Nlc3M9ZmFsc2U7XG5cdCAgICBcdGVsc2V7XG5cdCAgICBcdFx0Y29uc29sZS5sb2codXNlcik7XG5cdCAgICBcdFx0JHNjb3BlLnN1Y2Nlc3MgPSB0cnVlO1xuXHQgICAgXHR9XG5cdCAgICB9KTtcblx0ICB9XG59KTtcblxuIiwiYXBwLmNvbmZpZyhmdW5jdGlvbiAoJHN0YXRlUHJvdmlkZXIpIHtcblxuICAgIC8vIFJlZ2lzdGVyIG91ciAqSm9pbiBOb3cqIHN0YXRlLlxuICAgICRzdGF0ZVByb3ZpZGVyLnN0YXRlKCdsb2dpbicsIHtcbiAgICAgICAgdXJsOiAnL2xvZ2luJyxcbiAgICAgICAgY29udHJvbGxlcjogJ2xvZ2luQ29udHJvbGxlcicsXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnanMvbG9naW4vbG9naW4uaHRtbCcgXG4gICAgfSk7XG5cbn0pO1xuXG5cbmFwcC5jb250cm9sbGVyKCdsb2dpbkNvbnRyb2xsZXInLCBmdW5jdGlvbigkc2NvcGUsICR3aW5kb3csIEdldFVzZXJGYWN0b3J5KSB7XG4gICAgJHNjb3BlLmxvZ2lub2F1dGggPSBmdW5jdGlvbiAocHJvdmlkZXIpIHtcbiAgICAgICAgdmFyIGxvY2F0aW9uID0gJ2F1dGgvJyArIHByb3ZpZGVyO1xuICAgICAgICAkd2luZG93LmxvY2F0aW9uLmhyZWYgPSBsb2NhdGlvbjtcbiAgICB9XG4gICAgJHNjb3BlLnN1Y2Nlc3M7XG4gICAgJHNjb3BlLnN1Ym1pdFVzZXIgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGluZm8gPSAkc2NvcGUudXNlci5lbWFpbDtcbiAgICAgICAgY29uc29sZS5sb2coXCJ1c2VyIGxvZ2luIHByb2Nlc3Mgc3RhcnRlZCB3aXRoOiBcIiwgaW5mbyk7XG5cdCAgICBHZXRVc2VyRmFjdG9yeS5nZXRVc2VyKGluZm8pLnRoZW4oZnVuY3Rpb24odXNlciwgZXJyKXtcblx0ICAgIFx0aWYgKGVycikgJHNjb3BlLnN1Y2Nlc3MgPSBmYWxzZTtcblx0ICAgIFx0ZWxzZXtcblx0ICAgIFx0XHRjb25zb2xlLmxvZyh1c2VyKTtcblx0ICAgIFx0XHQkc2NvcGUudXNlci5lbWFpbCA9IHVzZXJbMF0uZW1haWw7XG5cdCAgICBcdH1cblx0ICAgIH0pO1xuXHR9XG59KTtcbiIsIid1c2Ugc3RyaWN0JztcbmFwcC5jb25maWcoZnVuY3Rpb24gKCRzdGF0ZVByb3ZpZGVyKSB7XG5cbiAgICAvLyBSZWdpc3RlciBvdXIgKmFib3V0KiBzdGF0ZS5cbiAgICAkc3RhdGVQcm92aWRlci5zdGF0ZSgnb3JkZXJzJywge1xuICAgICAgICB1cmw6ICcvb3JkZXIvOm5hbWUnLFxuICAgICAgICBjb250cm9sbGVyOiAnb3JkZXJDb250cm9sbGVyJyxcbiAgICAgICAgdGVtcGxhdGVVcmw6ICdqcy9vcmRlci9vcmRlci5odG1sJ1xuICAgIH0pO1xuXG59KTtcblxuYXBwLmNvbnRyb2xsZXIoJ29yZGVyQ29udHJvbGxlcicsIGZ1bmN0aW9uICgkc2NvcGUsIE9yZGVyRmFjdG9yeSwgJHN0YXRlLCAkc3RhdGVQYXJhbXMsICRjb29raWVTdG9yZSkge1xuXG5cdC8vcHJvdmlkZXMgZ2VuZXJhbCBmdW5jdGlvbmFsaXR5IHdpdGggYW4gb3JkZXJcblx0Ly92aWV3cyBjdXJyZW50IHVzZXIgb3JkZXJcblx0XHQvL29yZGVyIGlzIHNob3duIGJ5IGxpbmUgaXRlbVxuXHRcdC8vaGFzIGFiaWxpdHkgdG8gZWRpdCBvcmRlciwgb3IgcHJvY2VlZCB0byBjaGVja291dFxuXHQkc2NvcGUuYWN0aXZlb3JkZXJzPVtdO1xuXHQkc2NvcGUucGFzdG9yZGVycz1bXTtcblx0JHNjb3BlLnByb2Y7XG5cblx0JHNjb3BlLnN1bSA9IGZ1bmN0aW9uKCl7XG5cblx0fTtcblxuXHQkc2NvcGUudG90YWxRdHkgPSBmdW5jdGlvbigpe1xuXG5cdH07XG5cblxuXHQkc2NvcGUudXBkYXRlT3JkZXIgPSBmdW5jdGlvbigpe1xuXHRcdC8vdGFrZXMgaW4gaW5mb3JtYXRpb24gYWJvdXQgdGhlIHVzZXIsIFxuXHRcdE9yZGVyRmFjdG9yeS51cGRhdGVPcmRlcigpO1xuXG5cdH07IFxuXHQvL2dldCB1c2VyIGluZm9ybWF0aW9uIGFuZCBzZW5kIElkXG5cblx0JHNjb3BlLnNob3dDb29raWUgPSBmdW5jdGlvbigpe1xuXHRcdGNvbnNvbGUubG9nKCRjb29raWVTdG9yZS5nZXQoJ09yZGVyJykpO1xuXHRcdCRzY29wZS5hY3RpdmVvcmRlcnMgPSAkY29va2llU3RvcmUuZ2V0KCdPcmRlcicpO1xuXHR9XG5cblx0Ly8gaWYoYXV0aGVudGljYXRlZCl7XG5cdC8vIFx0T3JkZXJGYWN0b3J5LmdldE9yZGVycygpLnRoZW4oZnVuY3Rpb24oaXRlbXMsIGVycil7XG5cdC8vIFx0XHRpZiAoZXJyKSBjb25zb2xlLmxvZygnRXJyb3I6ICcsIGVycik7XG5cblx0Ly8gXHRcdGVsc2UgaWYoIWl0ZW1zKSB7XG5cdC8vIFx0XHRcdGNvbnNvbGUubG9nKCdObyBjdXJyZW50IG9yZGVyJyk7IC8vbm90IHN1cmUgd2hhdCBlbHNlIG5lZWRzIHRvIGJlIGRlY2xhcmVkLlxuXHQvLyBcdFx0fVxuXHQvLyBcdFx0ZWxzZSB7XG5cdC8vIFx0XHRcdCRzY29wZS5wcm9mID0gaXRlbXMuaW5mbztcblx0Ly8gXHRcdFx0aXRlbXMubGluZUl0ZW1zLmZvckVhY2goZnVuY3Rpb24odGhpbmcpe1xuXHQvLyBcdFx0XHRcdGlmKHRoaW5nLmluZm8uc3RhdHVzID09PSAnb3Blbicpe1xuXHQvLyBcdFx0XHRcdFx0JHNjb3BlLmFjdGl2ZW9yZGVycy5wdXNoKHRoaW5nKTtcblx0Ly8gXHRcdFx0XHR9XG5cdC8vIFx0XHRcdFx0ZWxzZSB7XG5cdC8vIFx0XHRcdFx0XHQkc2NvcGUucGFzdG9yZGVycy5wdXNoKHRoaW5nKTtcblx0Ly8gXHRcdFx0XHR9XG5cdC8vIFx0XHRcdH0pO1x0XG5cdC8vIFx0XHR9XG5cdC8vIFx0fSk7XG5cdC8vIH1cblxuXHQvLyBlbHNle1xuXHRcdCRzY29wZS5hY3RpdmVvcmRlcnMgPSAkY29va2llU3RvcmUuZ2V0KCdPcmRlcicpO1xuXHRcdCRzY29wZS5wcm9mID0gJ1VzZXInO1xuXHQvLyB9XG5cdFxufSk7IiwiJ3VzZSBzdHJpY3QnO1xuYXBwLmNvbmZpZyhmdW5jdGlvbiAoJHN0YXRlUHJvdmlkZXIpIHtcblxuICAgIC8vIFJlZ2lzdGVyIG91ciAqYWJvdXQqIHN0YXRlLlxuICAgICRzdGF0ZVByb3ZpZGVyLnN0YXRlKCdzdHJpcGUnLCB7XG4gICAgICAgIHVybDogJy9zdHJpcGUnLFxuICAgICAgICBjb250cm9sbGVyOiAnU3RyaXBlQ29udHJvbGxlcicsXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnanMvdGVzdFN0cmlwZS9zdHJpcGUuaHRtbCdcbiAgICB9KTtcblxufSk7XG5cbmFwcC5jb250cm9sbGVyKCdTdHJpcGVDb250cm9sbGVyJywgZnVuY3Rpb24gKCRzY29wZSkge1xuXG59KTsiLCIndXNlIHN0cmljdCc7XG5hcHAuY29uZmlnKGZ1bmN0aW9uICgkc3RhdGVQcm92aWRlcikge1xuXG4gICAgJHN0YXRlUHJvdmlkZXIuc3RhdGUoJ3R1dG9yaWFsJywge1xuICAgICAgICB1cmw6ICcvdHV0b3JpYWwnLFxuICAgICAgICB0ZW1wbGF0ZVVybDogJ2pzL3R1dG9yaWFsL3R1dG9yaWFsLmh0bWwnLFxuICAgICAgICBjb250cm9sbGVyOiAnVHV0b3JpYWxDdHJsJyxcbiAgICAgICAgcmVzb2x2ZToge1xuICAgICAgICAgICAgdHV0b3JpYWxJbmZvOiBmdW5jdGlvbiAoVHV0b3JpYWxGYWN0b3J5KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFR1dG9yaWFsRmFjdG9yeS5nZXRUdXRvcmlhbFZpZGVvcygpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSk7XG5cbn0pO1xuXG5hcHAuZmFjdG9yeSgnVHV0b3JpYWxGYWN0b3J5JywgZnVuY3Rpb24gKCRodHRwKSB7XG5cbiAgICByZXR1cm4ge1xuICAgICAgICBnZXRUdXRvcmlhbFZpZGVvczogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuICRodHRwLmdldCgnL2FwaS90dXRvcmlhbC92aWRlb3MnKS50aGVuKGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiByZXNwb25zZS5kYXRhO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9O1xuXG59KTtcblxuYXBwLmNvbnRyb2xsZXIoJ1R1dG9yaWFsQ3RybCcsIGZ1bmN0aW9uICgkc2NvcGUsIHR1dG9yaWFsSW5mbykge1xuXG4gICAgJHNjb3BlLnNlY3Rpb25zID0gdHV0b3JpYWxJbmZvLnNlY3Rpb25zO1xuICAgICRzY29wZS52aWRlb3MgPSBfLmdyb3VwQnkodHV0b3JpYWxJbmZvLnZpZGVvcywgJ3NlY3Rpb24nKTtcblxuICAgICRzY29wZS5jdXJyZW50U2VjdGlvbiA9IHsgc2VjdGlvbjogbnVsbCB9O1xuXG4gICAgJHNjb3BlLmNvbG9ycyA9IFtcbiAgICAgICAgJ3JnYmEoMzQsIDEwNywgMjU1LCAwLjEwKScsXG4gICAgICAgICdyZ2JhKDIzOCwgMjU1LCA2OCwgMC4xMSknLFxuICAgICAgICAncmdiYSgyMzQsIDUxLCAyNTUsIDAuMTEpJyxcbiAgICAgICAgJ3JnYmEoMjU1LCAxOTMsIDczLCAwLjExKScsXG4gICAgICAgICdyZ2JhKDIyLCAyNTUsIDEsIDAuMTEpJ1xuICAgIF07XG5cbiAgICAkc2NvcGUuZ2V0VmlkZW9zQnlTZWN0aW9uID0gZnVuY3Rpb24gKHNlY3Rpb24sIHZpZGVvcykge1xuICAgICAgICByZXR1cm4gdmlkZW9zLmZpbHRlcihmdW5jdGlvbiAodmlkZW8pIHtcbiAgICAgICAgICAgIHJldHVybiB2aWRlby5zZWN0aW9uID09PSBzZWN0aW9uO1xuICAgICAgICB9KTtcbiAgICB9O1xuXG59KTsiLCIndXNlIHN0cmljdCc7XG5hcHAuZmFjdG9yeSgnQ3JlYXRlSXRlbUZhY3RvcnknLCBmdW5jdGlvbigkaHR0cCl7XG5cdFxuXHRyZXR1cm4ge1xuXHRcdHBvc3RJdGVtOiBmdW5jdGlvbihkYXRhKXtcblx0XHRcdGNvbnNvbGUubG9nKCdpbnRvIHRoZSBmYWN0b3J5JywgZGF0YSk7XG5cdFx0XHQvLyByZXR1cm4gJGh0dHAucG9zdCgnL2FwaS9pdGVtJywgZGF0YSk7XG5cblx0XHRcdHJldHVybiAkaHR0cC5wb3N0KCcvYXBpL2l0ZW0nLCBkYXRhKS50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKXtcblx0XHRcdFx0cmV0dXJuIHJlc3BvbnNlLmRhdGE7XG5cdFx0XHR9KVxuXHRcdH1cblx0fVxuXG59KSIsIid1c2Ugc3RyaWN0JztcbmFwcC5mYWN0b3J5KCdDcmVhdGVVc2VyRmFjdG9yeScsIGZ1bmN0aW9uKCRodHRwKXtcblx0XG5cdHJldHVybiB7XG5cdFx0cG9zdFVzZXI6IGZ1bmN0aW9uKGRhdGEpe1xuXHRcdFx0Y29uc29sZS5sb2coJ2ludG8gdXNlciBmYWN0b3J5JywgZGF0YSk7XG5cdFx0XHRyZXR1cm4gJGh0dHAucG9zdCgnL2FwaS91c2VyJywgZGF0YSkudGhlbihmdW5jdGlvbihyZXNwb25zZSl7XG5cdFx0XHRcdHJldHVybiByZXNwb25zZS5kYXRhO1xuXHRcdFx0fSlcblx0XHR9XG5cdH1cbn0pIiwiJ3VzZSBzdHJpY3QnO1xuYXBwLmZhY3RvcnkoJ0dldEl0ZW1GYWN0b3J5JywgZnVuY3Rpb24oJGh0dHApe1xuXHRcblx0cmV0dXJuIHtcblx0XHRnZXRJdGVtOiBmdW5jdGlvbihpZCl7XG5cdFx0XHQvL3ZhciBvcHRpb25zID0ge2VtYWlsOiBlbWFpbH07XG5cdFx0XHRyZXR1cm4gJGh0dHAuZ2V0KCcvYXBpL2l0ZW0vJytpZCkudGhlbihmdW5jdGlvbihyZXNwb25zZSl7XG5cdFx0XHRcdHJldHVybiByZXNwb25zZS5kYXRhO1xuXHRcdFx0fSlcblx0XHR9XG5cdH1cblxufSkiLCIndXNlIHN0cmljdCc7XG5hcHAuZmFjdG9yeSgnR2V0SXRlbXNGYWN0b3J5JywgZnVuY3Rpb24oJGh0dHApe1xuXHRcblx0cmV0dXJuIHtcblx0XHRnZXRJdGVtczogZnVuY3Rpb24oKXtcblx0XHRcdHJldHVybiAkaHR0cC5nZXQoJy9hcGkvaXRlbWxpc3QnKS50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKXtcblx0XHRcdFx0cmV0dXJuIHJlc3BvbnNlLmRhdGE7XG5cdFx0XHR9KVxuXHRcdH1cblx0fVxufSkiLCIndXNlIHN0cmljdCc7XG5hcHAuZmFjdG9yeSgnR2V0VXNlckZhY3RvcnknLCBmdW5jdGlvbigkaHR0cCl7XG5cdFxuXHRyZXR1cm4ge1xuXHRcdGdldFVzZXI6IGZ1bmN0aW9uKGVtYWlsKXtcblx0XHRcdGNvbnNvbGUubG9nKCdpbnNpZGUgZmFjdG9yIHdpdGg6ICcsIGVtYWlsKTtcblx0XHRcdC8vdmFyIG9wdGlvbnMgPSB7ZW1haWw6IGVtYWlsfTtcblx0XHRcdHJldHVybiAkaHR0cC5nZXQoJy9hcGkvdXNlci8nICsgZW1haWwpLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2Upe1xuXHRcdFx0XHRyZXR1cm4gcmVzcG9uc2UuZGF0YTtcblx0XHRcdH0pXG5cdFx0fVxuXHR9XG5cbn0pIiwiJ3VzZSBzdHJpY3QnO1xuYXBwLmZhY3RvcnkoJ09yZGVyRmFjdG9yeScsIGZ1bmN0aW9uKCRodHRwKXtcblx0XG5cdHJldHVybiB7XG5cdFx0YWRkSXRlbTogZnVuY3Rpb24oZGF0YSl7XG5cdFx0XHRjb25zb2xlLmxvZygnaW50byB0aGUgZmFjdG9yeScsIGRhdGEpO1xuXHRcdFx0Ly8gZGF0YSBzaG91bGQgYmUgaW4gZm9ybSB7aXRlbTogaXRlbUlkLCBxdWFudGl0eTogcXVhbnRpdHksIH1cblxuXHRcdFx0cmV0dXJuICRodHRwLnBvc3QoJy9hcGkvaXRlbS9hZGRUb09yZGVyJywgZGF0YSkudGhlbihmdW5jdGlvbihyZXNwb25zZSl7XG5cdFx0XHRcdHJldHVybiByZXNwb25zZS5kYXRhO1xuXHRcdFx0fSlcblx0XHR9LFxuXHRcdHVwZGF0ZU9yZGVyOiBmdW5jdGlvbihkYXRhKXtcblx0XHRcdHJldHVybiAkaHR0cC5wb3N0KCcvYXBpL29yZGVyL2xpbmVpdGVtJywgZGF0YSkudGhlbihmdW5jdGlvbihyZXNwb25zZSl7XG5cdFx0XHRcdHJldHVybiByZXNwb25zZS5kYXRhO1xuXHRcdFx0fSlcblx0XHR9LFxuXHRcdGdldE9yZGVyczogZnVuY3Rpb24oKXtcblx0XHRcdC8vaWYgdXNlciBpcyBhdXRoZW50aWNhdGVkLCBjaGVjayB0aGUgc2VydmVyXG5cdFx0XHQvL2lmKHJlcS5zZXNzaW9uLnVzZXIpXG5cdFx0XHRpZiggMSA+PSA2ICl7XG5cdFx0XHRcdHJldHVybiAkaHR0cC5nZXQoJy9hcGkvb3JkZXInKS50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKXtcblx0XHRcdFx0XHRyZXR1cm4gcmVzcG9uc2UuZGF0YTtcblx0XHRcdFx0fSlcblx0XHRcdH1cblx0XHRcdGVsc2V7XG5cdFx0XHRcdHJldHVybiBmYWxzZTsgLy9nZXQgZGF0YSBmcm9tIHNlc3Npb25cblx0XHRcdH1cblx0XHR9XG5cblxuXG5cdH07XG5cbn0pIiwiJ3VzZSBzdHJpY3QnO1xuYXBwLmZhY3RvcnkoJ1JhbmRvbUdyZWV0aW5ncycsIGZ1bmN0aW9uICgpIHtcblxuICAgIHZhciBnZXRSYW5kb21Gcm9tQXJyYXkgPSBmdW5jdGlvbiAoYXJyKSB7XG4gICAgICAgIHJldHVybiBhcnJbTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogYXJyLmxlbmd0aCldO1xuICAgIH07XG5cbiAgICB2YXIgZ3JlZXRpbmdzID0gW1xuICAgICAgICAnSGVsbG8sIHdvcmxkIScsXG4gICAgICAgICdBdCBsb25nIGxhc3QsIEkgbGl2ZSEnLFxuICAgICAgICAnSGVsbG8sIHNpbXBsZSBodW1hbi4nLFxuICAgICAgICAnV2hhdCBhIGJlYXV0aWZ1bCBkYXkhJyxcbiAgICAgICAgJ0lcXCdtIGxpa2UgYW55IG90aGVyIHByb2plY3QsIGV4Y2VwdCB0aGF0IEkgYW0geW91cnMuIDopJyxcbiAgICAgICAgJ1RoaXMgZW1wdHkgc3RyaW5nIGlzIGZvciBMaW5kc2F5IExldmluZS4nXG4gICAgXTtcblxuICAgIHJldHVybiB7XG4gICAgICAgIGdyZWV0aW5nczogZ3JlZXRpbmdzLFxuICAgICAgICBnZXRSYW5kb21HcmVldGluZzogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIGdldFJhbmRvbUZyb21BcnJheShncmVldGluZ3MpO1xuICAgICAgICB9XG4gICAgfTtcblxufSk7IiwiJ3VzZSBzdHJpY3QnO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5hcHAuZGlyZWN0aXZlKCd0dXRvcmlhbFNlY3Rpb24nLCBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgcmVzdHJpY3Q6ICdFJyxcbiAgICAgICAgc2NvcGU6IHtcbiAgICAgICAgICAgIG5hbWU6ICdAJyxcbiAgICAgICAgICAgIHZpZGVvczogJz0nLFxuICAgICAgICAgICAgYmFja2dyb3VuZDogJ0AnXG4gICAgICAgIH0sXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnanMvdHV0b3JpYWwvdHV0b3JpYWwtc2VjdGlvbi90dXRvcmlhbC1zZWN0aW9uLmh0bWwnLFxuICAgICAgICBsaW5rOiBmdW5jdGlvbiAoc2NvcGUsIGVsZW1lbnQpIHtcbiAgICAgICAgICAgIGVsZW1lbnQuY3NzKHsgYmFja2dyb3VuZDogc2NvcGUuYmFja2dyb3VuZCB9KTtcbiAgICAgICAgfVxuICAgIH07XG59KTsiLCIndXNlIHN0cmljdCc7XG5hcHAuZGlyZWN0aXZlKCd0dXRvcmlhbFNlY3Rpb25NZW51JywgZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB7XG4gICAgICAgIHJlc3RyaWN0OiAnRScsXG4gICAgICAgIHJlcXVpcmU6ICduZ01vZGVsJyxcbiAgICAgICAgdGVtcGxhdGVVcmw6ICdqcy90dXRvcmlhbC90dXRvcmlhbC1zZWN0aW9uLW1lbnUvdHV0b3JpYWwtc2VjdGlvbi1tZW51Lmh0bWwnLFxuICAgICAgICBzY29wZToge1xuICAgICAgICAgICAgc2VjdGlvbnM6ICc9J1xuICAgICAgICB9LFxuICAgICAgICBsaW5rOiBmdW5jdGlvbiAoc2NvcGUsIGVsZW1lbnQsIGF0dHJzLCBuZ01vZGVsQ3RybCkge1xuXG4gICAgICAgICAgICBzY29wZS5jdXJyZW50U2VjdGlvbiA9IHNjb3BlLnNlY3Rpb25zWzBdO1xuICAgICAgICAgICAgbmdNb2RlbEN0cmwuJHNldFZpZXdWYWx1ZShzY29wZS5jdXJyZW50U2VjdGlvbik7XG5cbiAgICAgICAgICAgIHNjb3BlLnNldFNlY3Rpb24gPSBmdW5jdGlvbiAoc2VjdGlvbikge1xuICAgICAgICAgICAgICAgIHNjb3BlLmN1cnJlbnRTZWN0aW9uID0gc2VjdGlvbjtcbiAgICAgICAgICAgICAgICBuZ01vZGVsQ3RybC4kc2V0Vmlld1ZhbHVlKHNlY3Rpb24pO1xuICAgICAgICAgICAgfTtcblxuICAgICAgICB9XG4gICAgfTtcbn0pOyIsIid1c2Ugc3RyaWN0JztcbmFwcC5kaXJlY3RpdmUoJ3R1dG9yaWFsVmlkZW8nLCBmdW5jdGlvbiAoJHNjZSkge1xuXG4gICAgdmFyIGZvcm1Zb3V0dWJlVVJMID0gZnVuY3Rpb24gKGlkKSB7XG4gICAgICAgIHJldHVybiAnaHR0cHM6Ly93d3cueW91dHViZS5jb20vZW1iZWQvJyArIGlkO1xuICAgIH07XG5cbiAgICByZXR1cm4ge1xuICAgICAgICByZXN0cmljdDogJ0UnLFxuICAgICAgICB0ZW1wbGF0ZVVybDogJ2pzL3R1dG9yaWFsL3R1dG9yaWFsLXZpZGVvL3R1dG9yaWFsLXZpZGVvLmh0bWwnLFxuICAgICAgICBzY29wZToge1xuICAgICAgICAgICAgdmlkZW86ICc9J1xuICAgICAgICB9LFxuICAgICAgICBsaW5rOiBmdW5jdGlvbiAoc2NvcGUpIHtcbiAgICAgICAgICAgIHNjb3BlLnRydXN0ZWRZb3V0dWJlVVJMID0gJHNjZS50cnVzdEFzUmVzb3VyY2VVcmwoZm9ybVlvdXR1YmVVUkwoc2NvcGUudmlkZW8ueW91dHViZUlEKSk7XG4gICAgICAgIH1cbiAgICB9O1xuXG59KTsiLCIndXNlIHN0cmljdCc7XG5hcHAuZGlyZWN0aXZlKCdmdWxsc3RhY2tMb2dvJywgZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB7XG4gICAgICAgIHJlc3RyaWN0OiAnRScsXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnanMvY29tbW9uL2RpcmVjdGl2ZXMvZnVsbHN0YWNrLWxvZ28vZnVsbHN0YWNrLWxvZ28uaHRtbCdcbiAgICB9O1xufSk7IiwiJ3VzZSBzdHJpY3QnO1xuYXBwLmRpcmVjdGl2ZSgnbmF2YmFyJywgZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB7XG4gICAgICAgIHJlc3RyaWN0OiAnRScsXG4gICAgICAgIHNjb3BlOiB7XG4gICAgICAgICAgaXRlbXM6ICc9J1xuICAgICAgICB9LFxuICAgICAgICB0ZW1wbGF0ZVVybDogJ2pzL2NvbW1vbi9kaXJlY3RpdmVzL25hdmJhci9uYXZiYXIuaHRtbCdcbiAgICB9O1xufSk7IiwiJ3VzZSBzdHJpY3QnO1xuYXBwLmRpcmVjdGl2ZSgncmFuZG9HcmVldGluZycsIGZ1bmN0aW9uIChSYW5kb21HcmVldGluZ3MpIHtcblxuICAgIHJldHVybiB7XG4gICAgICAgIHJlc3RyaWN0OiAnRScsXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnanMvY29tbW9uL2RpcmVjdGl2ZXMvcmFuZG8tZ3JlZXRpbmcvcmFuZG8tZ3JlZXRpbmcuaHRtbCcsXG4gICAgICAgIGxpbms6IGZ1bmN0aW9uIChzY29wZSkge1xuICAgICAgICAgICAgc2NvcGUuZ3JlZXRpbmcgPSBSYW5kb21HcmVldGluZ3MuZ2V0UmFuZG9tR3JlZXRpbmcoKTtcbiAgICAgICAgfVxuICAgIH07XG5cbn0pOyJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==