'use strict';
// var app = angular.module('FullstackGeneratedApp', ['ui.router', 'fsaPreBuilt']);
var app = angular.module('specStackular', ['ui.router', 'fsaPreBuilt']);
app.controller('MainController', function ($scope) {

    // Given to the <navbar> directive to show the menu.
    $scope.menuItems = [
        { label: 'Home', state: 'home' },
        { label: 'Product list', state: 'products' },
        { label: 'Tutorial', state: 'tutorial' },
        { label: 'Create a product', state: 'itemCreate' },
        { label: 'About', state: 'about' },
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
app.config(function ($stateProvider) {

    // Register our *about* state.
    $stateProvider.state('products', {
        url: '/products',
        controller: 'allItemsController',
        templateUrl: 'js/allitems/allitems.html'
    });

});

app.controller('allItemsController', function ($scope, GetItemsFactory, $state, $stateParams) {

	GetItemsFactory.getItems().then(function(items, err){
		if(err) throw err;
		else{
			$scope.items = items;
		}
	});
});
app.config(function ($stateProvider) {

    // Register our *Join Now* state.
    $stateProvider.state('create-account', {
        url: '/create-account',
        //controller: 'joinController',
        templateUrl: 'js/create-account/create-account.html'
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
'use strict';
app.config(function ($stateProvider) {

    // Register our *about* state.
    $stateProvider.state('item', {
        url: '/item/:name',
        controller: 'itemController',
        templateUrl: 'js/item/item.html'
    });

});

app.controller('itemController', function ($scope, GetItemFactory, $state, $stateParams) {

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
});
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

    $stateProvider

});

app.controller('joinController', function($scope, $window) {
    $scope.loginoauth = function (provider) {
        var location = 'auth/' + provider;
        $window.location.href = location;
    }
})
app.config(function ($stateProvider) {

    // Register our *Review Entry* state.
    $stateProvider.state('review-entry', {
        url: ':item/review-entry',
        controller: 'reviewEntryController',
        templateUrl: 'js/review-entry/review-entry.html'
    });

});

app.controller('reviewEntryController', function($scope, $state, $stateParams) {
    console.log("params name:" + $stateParams.item.name);
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
			//var options = {email: email};
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
			//var options = {email: email};
			return $http.get('/api/user', {data: email}).then(function(response){
				return response.data;
			})
		}
	}

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
app.directive('fullstackLogo', function () {
    return {
        restrict: 'E',
        templateUrl: 'js/common/directives/fullstack-logo/fullstack-logo.html'
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyIsImFib3V0L2Fib3V0LmpzIiwiYWxsSXRlbXMvYWxsSXRlbXMuanMiLCJjcmVhdGUtYWNjb3VudC9jcmVhdGUtYWNjb3VudC5qcyIsImZzYS9mc2EtcHJlLWJ1aWx0LmpzIiwiaG9tZS9ob21lLmpzIiwiaXRlbS9pdGVtLmpzIiwiaXRlbUNyZWF0ZS9pdGVtQ3JlYXRlLmpzIiwiam9pbm5vdy9qb2lubm93LmpzIiwicmV2aWV3LWVudHJ5L3Jldmlldy1lbnRyeS5qcyIsInRlc3RTdHJpcGUvc3RyaXBlLmpzIiwidHV0b3JpYWwvdHV0b3JpYWwuanMiLCJjb21tb24vZmFjdG9yaWVzL0NyZWF0ZUl0ZW1GYWN0b3J5LmpzIiwiY29tbW9uL2ZhY3Rvcmllcy9DcmVhdGVVc2VyRmFjdG9yeS5qcyIsImNvbW1vbi9mYWN0b3JpZXMvR2V0SXRlbUZhY3RvcnkuanMiLCJjb21tb24vZmFjdG9yaWVzL0dldEl0ZW1zRmFjdG9yeS5qcyIsImNvbW1vbi9mYWN0b3JpZXMvR2V0VXNlckZhY3RvcnkuanMiLCJjb21tb24vZmFjdG9yaWVzL1JhbmRvbUdyZWV0aW5ncy5qcyIsImNvbW1vbi9mYWN0b3JpZXMvU29ja2V0LmpzIiwidHV0b3JpYWwvdHV0b3JpYWwtc2VjdGlvbi90dXRvcmlhbC1zZWN0aW9uLmpzIiwidHV0b3JpYWwvdHV0b3JpYWwtc2VjdGlvbi1tZW51L3R1dG9yaWFsLXNlY3Rpb24tbWVudS5qcyIsInR1dG9yaWFsL3R1dG9yaWFsLXZpZGVvL3R1dG9yaWFsLXZpZGVvLmpzIiwiY29tbW9uL2RpcmVjdGl2ZXMvbmF2YmFyL25hdmJhci5qcyIsImNvbW1vbi9kaXJlY3RpdmVzL2Z1bGxzdGFjay1sb2dvL2Z1bGxzdGFjay1sb2dvLmpzIiwiY29tbW9uL2RpcmVjdGl2ZXMvcmFuZG8tZ3JlZXRpbmcvcmFuZG8tZ3JlZXRpbmcuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3RCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNwQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNqSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNaQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMxQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM5QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNsQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNqREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDZEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDWEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNaQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDVkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNaQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN2QkE7QUFDQTtBQ0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDZkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNyQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNsQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJtYWluLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnO1xuLy8gdmFyIGFwcCA9IGFuZ3VsYXIubW9kdWxlKCdGdWxsc3RhY2tHZW5lcmF0ZWRBcHAnLCBbJ3VpLnJvdXRlcicsICdmc2FQcmVCdWlsdCddKTtcbnZhciBhcHAgPSBhbmd1bGFyLm1vZHVsZSgnc3BlY1N0YWNrdWxhcicsIFsndWkucm91dGVyJywgJ2ZzYVByZUJ1aWx0J10pO1xuYXBwLmNvbnRyb2xsZXIoJ01haW5Db250cm9sbGVyJywgZnVuY3Rpb24gKCRzY29wZSkge1xuXG4gICAgLy8gR2l2ZW4gdG8gdGhlIDxuYXZiYXI+IGRpcmVjdGl2ZSB0byBzaG93IHRoZSBtZW51LlxuICAgICRzY29wZS5tZW51SXRlbXMgPSBbXG4gICAgICAgIHsgbGFiZWw6ICdIb21lJywgc3RhdGU6ICdob21lJyB9LFxuICAgICAgICB7IGxhYmVsOiAnUHJvZHVjdCBsaXN0Jywgc3RhdGU6ICdwcm9kdWN0cycgfSxcbiAgICAgICAgeyBsYWJlbDogJ1R1dG9yaWFsJywgc3RhdGU6ICd0dXRvcmlhbCcgfSxcbiAgICAgICAgeyBsYWJlbDogJ0NyZWF0ZSBhIHByb2R1Y3QnLCBzdGF0ZTogJ2l0ZW1DcmVhdGUnIH0sXG4gICAgICAgIHsgbGFiZWw6ICdBYm91dCcsIHN0YXRlOiAnYWJvdXQnIH0sXG4gICAgXTtcblxufSk7XG5cblxuYXBwLmNvbmZpZyhmdW5jdGlvbiAoJHVybFJvdXRlclByb3ZpZGVyLCAkbG9jYXRpb25Qcm92aWRlcikge1xuICAgIC8vIFRoaXMgdHVybnMgb2ZmIGhhc2hiYW5nIHVybHMgKC8jYWJvdXQpIGFuZCBjaGFuZ2VzIGl0IHRvIHNvbWV0aGluZyBub3JtYWwgKC9hYm91dClcbiAgICAkbG9jYXRpb25Qcm92aWRlci5odG1sNU1vZGUodHJ1ZSk7XG4gICAgLy8gSWYgd2UgZ28gdG8gYSBVUkwgdGhhdCB1aS1yb3V0ZXIgZG9lc24ndCBoYXZlIHJlZ2lzdGVyZWQsIGdvIHRvIHRoZSBcIi9cIiB1cmwuXG4gICAgJHVybFJvdXRlclByb3ZpZGVyLm90aGVyd2lzZSgnLycpO1xufSk7IiwiJ3VzZSBzdHJpY3QnO1xuYXBwLmNvbmZpZyhmdW5jdGlvbiAoJHN0YXRlUHJvdmlkZXIpIHtcblxuICAgIC8vIFJlZ2lzdGVyIG91ciAqYWJvdXQqIHN0YXRlLlxuICAgICRzdGF0ZVByb3ZpZGVyLnN0YXRlKCdhYm91dCcsIHtcbiAgICAgICAgdXJsOiAnL2Fib3V0JyxcbiAgICAgICAgY29udHJvbGxlcjogJ0Fib3V0Q29udHJvbGxlcicsXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnanMvYWJvdXQvYWJvdXQuaHRtbCdcbiAgICB9KTtcblxufSk7XG5cbmFwcC5jb250cm9sbGVyKCdBYm91dENvbnRyb2xsZXInLCBmdW5jdGlvbiAoJHNjb3BlKSB7XG5cbiAgICAvLyBJbWFnZXMgb2YgYmVhdXRpZnVsIEZ1bGxzdGFjayBwZW9wbGUuXG4gICAgJHNjb3BlLmltYWdlcyA9IFtcbiAgICAgICAgJ2h0dHBzOi8vcGJzLnR3aW1nLmNvbS9tZWRpYS9CN2dCWHVsQ0FBQVhRY0UuanBnOmxhcmdlJyxcbiAgICAgICAgJ2h0dHBzOi8vZmJjZG4tc3Bob3Rvcy1jLWEuYWthbWFpaGQubmV0L2hwaG90b3MtYWsteGFwMS90MzEuMC04LzEwODYyNDUxXzEwMjA1NjIyOTkwMzU5MjQxXzgwMjcxNjg4NDMzMTI4NDExMzdfby5qcGcnLFxuICAgICAgICAnaHR0cHM6Ly9wYnMudHdpbWcuY29tL21lZGlhL0ItTEtVc2hJZ0FFeTlTSy5qcGcnLFxuICAgICAgICAnaHR0cHM6Ly9wYnMudHdpbWcuY29tL21lZGlhL0I3OS1YN29DTUFBa3c3eS5qcGcnLFxuICAgICAgICAnaHR0cHM6Ly9wYnMudHdpbWcuY29tL21lZGlhL0ItVWo5Q09JSUFJRkFoMC5qcGc6bGFyZ2UnLFxuICAgICAgICAnaHR0cHM6Ly9wYnMudHdpbWcuY29tL21lZGlhL0I2eUl5RmlDRUFBcWwxMi5qcGc6bGFyZ2UnXG4gICAgXTtcblxufSk7IiwiJ3VzZSBzdHJpY3QnO1xuYXBwLmNvbmZpZyhmdW5jdGlvbiAoJHN0YXRlUHJvdmlkZXIpIHtcblxuICAgIC8vIFJlZ2lzdGVyIG91ciAqYWJvdXQqIHN0YXRlLlxuICAgICRzdGF0ZVByb3ZpZGVyLnN0YXRlKCdwcm9kdWN0cycsIHtcbiAgICAgICAgdXJsOiAnL3Byb2R1Y3RzJyxcbiAgICAgICAgY29udHJvbGxlcjogJ2FsbEl0ZW1zQ29udHJvbGxlcicsXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnanMvYWxsaXRlbXMvYWxsaXRlbXMuaHRtbCdcbiAgICB9KTtcblxufSk7XG5cbmFwcC5jb250cm9sbGVyKCdhbGxJdGVtc0NvbnRyb2xsZXInLCBmdW5jdGlvbiAoJHNjb3BlLCBHZXRJdGVtc0ZhY3RvcnksICRzdGF0ZSwgJHN0YXRlUGFyYW1zKSB7XG5cblx0R2V0SXRlbXNGYWN0b3J5LmdldEl0ZW1zKCkudGhlbihmdW5jdGlvbihpdGVtcywgZXJyKXtcblx0XHRpZihlcnIpIHRocm93IGVycjtcblx0XHRlbHNle1xuXHRcdFx0JHNjb3BlLml0ZW1zID0gaXRlbXM7XG5cdFx0fVxuXHR9KTtcbn0pOyIsImFwcC5jb25maWcoZnVuY3Rpb24gKCRzdGF0ZVByb3ZpZGVyKSB7XG5cbiAgICAvLyBSZWdpc3RlciBvdXIgKkpvaW4gTm93KiBzdGF0ZS5cbiAgICAkc3RhdGVQcm92aWRlci5zdGF0ZSgnY3JlYXRlLWFjY291bnQnLCB7XG4gICAgICAgIHVybDogJy9jcmVhdGUtYWNjb3VudCcsXG4gICAgICAgIC8vY29udHJvbGxlcjogJ2pvaW5Db250cm9sbGVyJyxcbiAgICAgICAgdGVtcGxhdGVVcmw6ICdqcy9jcmVhdGUtYWNjb3VudC9jcmVhdGUtYWNjb3VudC5odG1sJ1xuICAgIH0pO1xuXG59KTsiLCIoZnVuY3Rpb24gKCkge1xuXG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgLy8gSG9wZSB5b3UgZGlkbid0IGZvcmdldCBBbmd1bGFyISBEdWgtZG95LlxuICAgIGlmICghd2luZG93LmFuZ3VsYXIpIHRocm93IG5ldyBFcnJvcignSSBjYW5cXCd0IGZpbmQgQW5ndWxhciEnKTtcblxuICAgIHZhciBhcHAgPSBhbmd1bGFyLm1vZHVsZSgnZnNhUHJlQnVpbHQnLCBbXSk7XG5cbiAgICBhcHAuZmFjdG9yeSgnU29ja2V0JywgZnVuY3Rpb24gKCRsb2NhdGlvbikge1xuXG4gICAgICAgIGlmICghd2luZG93LmlvKSB0aHJvdyBuZXcgRXJyb3IoJ3NvY2tldC5pbyBub3QgZm91bmQhJyk7XG5cbiAgICAgICAgdmFyIHNvY2tldDtcblxuICAgICAgICBpZiAoJGxvY2F0aW9uLiQkcG9ydCkge1xuICAgICAgICAgICAgc29ja2V0ID0gaW8oJ2h0dHA6Ly9sb2NhbGhvc3Q6MTMzNycpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgc29ja2V0ID0gaW8oJy8nKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBzb2NrZXQ7XG5cbiAgICB9KTtcblxuICAgIGFwcC5jb25zdGFudCgnQVVUSF9FVkVOVFMnLCB7XG4gICAgICAgIGxvZ2luU3VjY2VzczogJ2F1dGgtbG9naW4tc3VjY2VzcycsXG4gICAgICAgIGxvZ2luRmFpbGVkOiAnYXV0aC1sb2dpbi1mYWlsZWQnLFxuICAgICAgICBsb2dvdXRTdWNjZXNzOiAnYXV0aC1sb2dvdXQtc3VjY2VzcycsXG4gICAgICAgIHNlc3Npb25UaW1lb3V0OiAnYXV0aC1zZXNzaW9uLXRpbWVvdXQnLFxuICAgICAgICBub3RBdXRoZW50aWNhdGVkOiAnYXV0aC1ub3QtYXV0aGVudGljYXRlZCcsXG4gICAgICAgIG5vdEF1dGhvcml6ZWQ6ICdhdXRoLW5vdC1hdXRob3JpemVkJ1xuICAgIH0pO1xuXG4gICAgYXBwLmNvbmZpZyhmdW5jdGlvbiAoJGh0dHBQcm92aWRlcikge1xuICAgICAgICAkaHR0cFByb3ZpZGVyLmludGVyY2VwdG9ycy5wdXNoKFtcbiAgICAgICAgICAgICckaW5qZWN0b3InLFxuICAgICAgICAgICAgZnVuY3Rpb24gKCRpbmplY3Rvcikge1xuICAgICAgICAgICAgICAgIHJldHVybiAkaW5qZWN0b3IuZ2V0KCdBdXRoSW50ZXJjZXB0b3InKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgXSk7XG4gICAgfSk7XG5cbiAgICBhcHAuZmFjdG9yeSgnQXV0aEludGVyY2VwdG9yJywgZnVuY3Rpb24gKCRyb290U2NvcGUsICRxLCBBVVRIX0VWRU5UUykge1xuICAgICAgICB2YXIgc3RhdHVzRGljdCA9IHtcbiAgICAgICAgICAgIDQwMTogQVVUSF9FVkVOVFMubm90QXV0aGVudGljYXRlZCxcbiAgICAgICAgICAgIDQwMzogQVVUSF9FVkVOVFMubm90QXV0aG9yaXplZCxcbiAgICAgICAgICAgIDQxOTogQVVUSF9FVkVOVFMuc2Vzc2lvblRpbWVvdXQsXG4gICAgICAgICAgICA0NDA6IEFVVEhfRVZFTlRTLnNlc3Npb25UaW1lb3V0XG4gICAgICAgIH07XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICByZXNwb25zZUVycm9yOiBmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgICAgICAgICAgICAgICAkcm9vdFNjb3BlLiRicm9hZGNhc3Qoc3RhdHVzRGljdFtyZXNwb25zZS5zdGF0dXNdLCByZXNwb25zZSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuICRxLnJlamVjdChyZXNwb25zZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgfSk7XG5cbiAgICBhcHAuc2VydmljZSgnQXV0aFNlcnZpY2UnLCBmdW5jdGlvbiAoJGh0dHAsIFNlc3Npb24sICRyb290U2NvcGUsIEFVVEhfRVZFTlRTLCAkcSkge1xuXG4gICAgICAgIHZhciBvblN1Y2Nlc3NmdWxMb2dpbiA9IGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICAgICAgICAgICAgdmFyIGRhdGEgPSByZXNwb25zZS5kYXRhO1xuICAgICAgICAgICAgU2Vzc2lvbi5jcmVhdGUoZGF0YS5pZCwgZGF0YS51c2VyKTtcbiAgICAgICAgICAgICRyb290U2NvcGUuJGJyb2FkY2FzdChBVVRIX0VWRU5UUy5sb2dpblN1Y2Nlc3MpO1xuICAgICAgICAgICAgcmV0dXJuIGRhdGEudXNlcjtcbiAgICAgICAgfTtcblxuICAgICAgICB0aGlzLmdldExvZ2dlZEluVXNlciA9IGZ1bmN0aW9uICgpIHtcblxuICAgICAgICAgICAgaWYgKHRoaXMuaXNBdXRoZW50aWNhdGVkKCkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gJHEud2hlbih7IHVzZXI6IFNlc3Npb24udXNlciB9KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuICRodHRwLmdldCgnL3Nlc3Npb24nKS50aGVuKG9uU3VjY2Vzc2Z1bExvZ2luKS5jYXRjaChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICB9O1xuXG4gICAgICAgIHRoaXMubG9naW4gPSBmdW5jdGlvbiAoY3JlZGVudGlhbHMpIHtcbiAgICAgICAgICAgIHJldHVybiAkaHR0cC5wb3N0KCcvbG9naW4nLCBjcmVkZW50aWFscykudGhlbihvblN1Y2Nlc3NmdWxMb2dpbik7XG4gICAgICAgIH07XG5cbiAgICAgICAgdGhpcy5sb2dvdXQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KCcvbG9nb3V0JykudGhlbihmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgU2Vzc2lvbi5kZXN0cm95KCk7XG4gICAgICAgICAgICAgICAgJHJvb3RTY29wZS4kYnJvYWRjYXN0KEFVVEhfRVZFTlRTLmxvZ291dFN1Y2Nlc3MpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgdGhpcy5pc0F1dGhlbnRpY2F0ZWQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gISFTZXNzaW9uLnVzZXI7XG4gICAgICAgIH07XG5cbiAgICB9KTtcblxuICAgIGFwcC5zZXJ2aWNlKCdTZXNzaW9uJywgZnVuY3Rpb24gKCRyb290U2NvcGUsIEFVVEhfRVZFTlRTKSB7XG5cbiAgICAgICAgJHJvb3RTY29wZS4kb24oQVVUSF9FVkVOVFMubm90QXV0aGVudGljYXRlZCwgdGhpcy5kZXN0cm95KTtcbiAgICAgICAgJHJvb3RTY29wZS4kb24oQVVUSF9FVkVOVFMuc2Vzc2lvblRpbWVvdXQsIHRoaXMuZGVzdHJveSk7XG5cbiAgICAgICAgdGhpcy5jcmVhdGUgPSBmdW5jdGlvbiAoc2Vzc2lvbklkLCB1c2VyKSB7XG4gICAgICAgICAgICB0aGlzLmlkID0gc2Vzc2lvbklkO1xuICAgICAgICAgICAgdGhpcy51c2VyID0gdXNlcjtcbiAgICAgICAgfTtcblxuICAgICAgICB0aGlzLmRlc3Ryb3kgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB0aGlzLmlkID0gbnVsbDtcbiAgICAgICAgICAgIHRoaXMudXNlciA9IG51bGw7XG4gICAgICAgIH07XG5cbiAgICB9KTtcblxufSkoKTsiLCIndXNlIHN0cmljdCc7XG5hcHAuY29uZmlnKGZ1bmN0aW9uICgkc3RhdGVQcm92aWRlcikge1xuXG4gICAgJHN0YXRlUHJvdmlkZXIuc3RhdGUoJ2hvbWUnLCB7XG4gICAgICAgIHVybDogJy8nLFxuICAgICAgICBjb250cm9sbGVyOiAnSG9tZUN0cmwnLFxuICAgICAgICB0ZW1wbGF0ZVVybDogJ2pzL2hvbWUvaG9tZS5odG1sJ1xuICAgIH0pO1xuXG59KTtcblxuYXBwLmNvbnRyb2xsZXIoJ0hvbWVDdHJsJywgZnVuY3Rpb24gKCRzY29wZSkge1xufSk7IiwiJ3VzZSBzdHJpY3QnO1xuYXBwLmNvbmZpZyhmdW5jdGlvbiAoJHN0YXRlUHJvdmlkZXIpIHtcblxuICAgIC8vIFJlZ2lzdGVyIG91ciAqYWJvdXQqIHN0YXRlLlxuICAgICRzdGF0ZVByb3ZpZGVyLnN0YXRlKCdpdGVtJywge1xuICAgICAgICB1cmw6ICcvaXRlbS86bmFtZScsXG4gICAgICAgIGNvbnRyb2xsZXI6ICdpdGVtQ29udHJvbGxlcicsXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnanMvaXRlbS9pdGVtLmh0bWwnXG4gICAgfSk7XG5cbn0pO1xuXG5hcHAuY29udHJvbGxlcignaXRlbUNvbnRyb2xsZXInLCBmdW5jdGlvbiAoJHNjb3BlLCBHZXRJdGVtRmFjdG9yeSwgJHN0YXRlLCAkc3RhdGVQYXJhbXMpIHtcblxuXHQvL2dldCBpbnB1dCBmcm9tIHVzZXIgYWJvdXQgaXRlbSAoaWQgZnJvbSB1cmwgKVxuXHQvL2NoZWNrIGlkIHZzIGRhdGFiYXNlXG5cdC8vaWYgbm90IGZvdW5kLCByZWRpcmVjdCB0byBzZWFyY2ggcGFnZVxuXHQvL2lmIGZvdW5kIHNlbmQgdGVtcGFsYXRlVXJsXG5cblx0R2V0SXRlbUZhY3RvcnkuZ2V0SXRlbSgkc3RhdGVQYXJhbXMubmFtZSkudGhlbihmdW5jdGlvbihpdGVtLCBlcnIpe1xuXHRcdGlmKGVycikgJHN0YXRlLmdvKCdob21lJyk7XG5cdFx0ZWxzZXtcblx0XHRcdCRzY29wZS5pdGVtID0gaXRlbVswXTtcblx0XHRcdH1cblx0XHRcblx0fSk7XG59KTsiLCIndXNlIHN0cmljdCc7XG5hcHAuY29uZmlnKGZ1bmN0aW9uICgkc3RhdGVQcm92aWRlcikge1xuXG4gICAgLy8gUmVnaXN0ZXIgb3VyICphYm91dCogc3RhdGUuXG4gICAgJHN0YXRlUHJvdmlkZXIuc3RhdGUoJ2l0ZW1DcmVhdGUnLCB7XG4gICAgICAgIHVybDogJy9jcmVhdGUvaXRlbScsXG4gICAgICAgIGNvbnRyb2xsZXI6ICdpdGVtQ3JlYXRlQ29udHJvbGxlcicsXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnanMvaXRlbUNyZWF0ZS9pdGVtQ3JlYXRlLmh0bWwnXG4gICAgfSk7XG5cbn0pO1xuXG5hcHAuY29udHJvbGxlcignaXRlbUNyZWF0ZUNvbnRyb2xsZXInLCBmdW5jdGlvbiAoJHNjb3BlLCBDcmVhdGVJdGVtRmFjdG9yeSwgJHN0YXRlLCAkc3RhdGVQYXJhbXMpIHtcblxuXHQkc2NvcGUuaXRlbSA9IHtcblx0XHRjYXRlZ29yaWVzOiBbXSB9O1xuXHQkc2NvcGUuc3VjY2VzcztcblxuXHQkc2NvcGUuc3VibWl0SXRlbSA9IGZ1bmN0aW9uKCkge1xuXHRcdC8vJHNjb3BlLml0ZW0uY2F0ZWdvcmllcyA9ICRzY29wZS5pdGVtLmNhdGVnb3JpZXMuc3BsaXQoJyAnKTtcblx0XHRjb25zb2xlLmxvZygncHJvY2VzcyBzdGFydGVkJyk7XG5cdFx0Y29uc29sZS5sb2coJHNjb3BlLml0ZW0pO1xuXHRcdENyZWF0ZUl0ZW1GYWN0b3J5LnBvc3RJdGVtKCRzY29wZS5pdGVtKS50aGVuKGZ1bmN0aW9uKGl0ZW0sIGVycil7XG5cdFx0XHRpZihlcnIpICRzY29wZS5zdWNjZXNzPSBmYWxzZTtcblx0XHRcdGVsc2V7XG5cdFx0XHRcdGNvbnNvbGUubG9nKGl0ZW0pO1xuXHRcdFx0XHQkc2NvcGUuc3VjY2VzcyA9IHRydWU7XG5cdFx0XHR9XG5cdFx0fSk7XG5cdH1cbn0pOyIsImFwcC5jb25maWcoZnVuY3Rpb24gKCRzdGF0ZVByb3ZpZGVyKSB7XG5cbiAgICAvLyBSZWdpc3RlciBvdXIgKkpvaW4gTm93KiBzdGF0ZS5cbiAgICAkc3RhdGVQcm92aWRlci5zdGF0ZSgnam9pbicsIHtcbiAgICAgICAgdXJsOiAnL2pvaW4nLFxuICAgICAgICBjb250cm9sbGVyOiAnam9pbkNvbnRyb2xsZXInLFxuICAgICAgICB0ZW1wbGF0ZVVybDogJ2pzL2pvaW5ub3cvam9pbm5vdy5odG1sJ1xuICAgIH0pO1xuXG4gICAgJHN0YXRlUHJvdmlkZXJcblxufSk7XG5cbmFwcC5jb250cm9sbGVyKCdqb2luQ29udHJvbGxlcicsIGZ1bmN0aW9uKCRzY29wZSwgJHdpbmRvdykge1xuICAgICRzY29wZS5sb2dpbm9hdXRoID0gZnVuY3Rpb24gKHByb3ZpZGVyKSB7XG4gICAgICAgIHZhciBsb2NhdGlvbiA9ICdhdXRoLycgKyBwcm92aWRlcjtcbiAgICAgICAgJHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gbG9jYXRpb247XG4gICAgfVxufSkiLCJhcHAuY29uZmlnKGZ1bmN0aW9uICgkc3RhdGVQcm92aWRlcikge1xuXG4gICAgLy8gUmVnaXN0ZXIgb3VyICpSZXZpZXcgRW50cnkqIHN0YXRlLlxuICAgICRzdGF0ZVByb3ZpZGVyLnN0YXRlKCdyZXZpZXctZW50cnknLCB7XG4gICAgICAgIHVybDogJzppdGVtL3Jldmlldy1lbnRyeScsXG4gICAgICAgIGNvbnRyb2xsZXI6ICdyZXZpZXdFbnRyeUNvbnRyb2xsZXInLFxuICAgICAgICB0ZW1wbGF0ZVVybDogJ2pzL3Jldmlldy1lbnRyeS9yZXZpZXctZW50cnkuaHRtbCdcbiAgICB9KTtcblxufSk7XG5cbmFwcC5jb250cm9sbGVyKCdyZXZpZXdFbnRyeUNvbnRyb2xsZXInLCBmdW5jdGlvbigkc2NvcGUsICRzdGF0ZSwgJHN0YXRlUGFyYW1zKSB7XG4gICAgY29uc29sZS5sb2coXCJwYXJhbXMgbmFtZTpcIiArICRzdGF0ZVBhcmFtcy5pdGVtLm5hbWUpO1xufSk7IiwiJ3VzZSBzdHJpY3QnO1xuYXBwLmNvbmZpZyhmdW5jdGlvbiAoJHN0YXRlUHJvdmlkZXIpIHtcblxuICAgIC8vIFJlZ2lzdGVyIG91ciAqYWJvdXQqIHN0YXRlLlxuICAgICRzdGF0ZVByb3ZpZGVyLnN0YXRlKCdzdHJpcGUnLCB7XG4gICAgICAgIHVybDogJy9zdHJpcGUnLFxuICAgICAgICBjb250cm9sbGVyOiAnU3RyaXBlQ29udHJvbGxlcicsXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnanMvdGVzdFN0cmlwZS9zdHJpcGUuaHRtbCdcbiAgICB9KTtcblxufSk7XG5cbmFwcC5jb250cm9sbGVyKCdTdHJpcGVDb250cm9sbGVyJywgZnVuY3Rpb24gKCRzY29wZSkge1xuXG59KTsiLCIndXNlIHN0cmljdCc7XG5hcHAuY29uZmlnKGZ1bmN0aW9uICgkc3RhdGVQcm92aWRlcikge1xuXG4gICAgJHN0YXRlUHJvdmlkZXIuc3RhdGUoJ3R1dG9yaWFsJywge1xuICAgICAgICB1cmw6ICcvdHV0b3JpYWwnLFxuICAgICAgICB0ZW1wbGF0ZVVybDogJ2pzL3R1dG9yaWFsL3R1dG9yaWFsLmh0bWwnLFxuICAgICAgICBjb250cm9sbGVyOiAnVHV0b3JpYWxDdHJsJyxcbiAgICAgICAgcmVzb2x2ZToge1xuICAgICAgICAgICAgdHV0b3JpYWxJbmZvOiBmdW5jdGlvbiAoVHV0b3JpYWxGYWN0b3J5KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFR1dG9yaWFsRmFjdG9yeS5nZXRUdXRvcmlhbFZpZGVvcygpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSk7XG5cbn0pO1xuXG5hcHAuZmFjdG9yeSgnVHV0b3JpYWxGYWN0b3J5JywgZnVuY3Rpb24gKCRodHRwKSB7XG5cbiAgICByZXR1cm4ge1xuICAgICAgICBnZXRUdXRvcmlhbFZpZGVvczogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuICRodHRwLmdldCgnL2FwaS90dXRvcmlhbC92aWRlb3MnKS50aGVuKGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiByZXNwb25zZS5kYXRhO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9O1xuXG59KTtcblxuYXBwLmNvbnRyb2xsZXIoJ1R1dG9yaWFsQ3RybCcsIGZ1bmN0aW9uICgkc2NvcGUsIHR1dG9yaWFsSW5mbykge1xuXG4gICAgJHNjb3BlLnNlY3Rpb25zID0gdHV0b3JpYWxJbmZvLnNlY3Rpb25zO1xuICAgICRzY29wZS52aWRlb3MgPSBfLmdyb3VwQnkodHV0b3JpYWxJbmZvLnZpZGVvcywgJ3NlY3Rpb24nKTtcblxuICAgICRzY29wZS5jdXJyZW50U2VjdGlvbiA9IHsgc2VjdGlvbjogbnVsbCB9O1xuXG4gICAgJHNjb3BlLmNvbG9ycyA9IFtcbiAgICAgICAgJ3JnYmEoMzQsIDEwNywgMjU1LCAwLjEwKScsXG4gICAgICAgICdyZ2JhKDIzOCwgMjU1LCA2OCwgMC4xMSknLFxuICAgICAgICAncmdiYSgyMzQsIDUxLCAyNTUsIDAuMTEpJyxcbiAgICAgICAgJ3JnYmEoMjU1LCAxOTMsIDczLCAwLjExKScsXG4gICAgICAgICdyZ2JhKDIyLCAyNTUsIDEsIDAuMTEpJ1xuICAgIF07XG5cbiAgICAkc2NvcGUuZ2V0VmlkZW9zQnlTZWN0aW9uID0gZnVuY3Rpb24gKHNlY3Rpb24sIHZpZGVvcykge1xuICAgICAgICByZXR1cm4gdmlkZW9zLmZpbHRlcihmdW5jdGlvbiAodmlkZW8pIHtcbiAgICAgICAgICAgIHJldHVybiB2aWRlby5zZWN0aW9uID09PSBzZWN0aW9uO1xuICAgICAgICB9KTtcbiAgICB9O1xuXG59KTsiLCIndXNlIHN0cmljdCc7XG5hcHAuZmFjdG9yeSgnQ3JlYXRlSXRlbUZhY3RvcnknLCBmdW5jdGlvbigkaHR0cCl7XG5cdFxuXHRyZXR1cm4ge1xuXHRcdHBvc3RJdGVtOiBmdW5jdGlvbihkYXRhKXtcblx0XHRcdGNvbnNvbGUubG9nKCdpbnRvIHRoZSBmYWN0b3J5JywgZGF0YSk7XG5cdFx0XHQvLyByZXR1cm4gJGh0dHAucG9zdCgnL2FwaS9pdGVtJywgZGF0YSk7XG5cblx0XHRcdHJldHVybiAkaHR0cC5wb3N0KCcvYXBpL2l0ZW0nLCBkYXRhKS50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKXtcblx0XHRcdFx0cmV0dXJuIHJlc3BvbnNlLmRhdGE7XG5cdFx0XHR9KVxuXHRcdH1cblx0fVxuXG59KSIsIid1c2Ugc3RyaWN0JztcbmFwcC5mYWN0b3J5KCdDcmVhdGVVc2VyRmFjdG9yeScsIGZ1bmN0aW9uKCRodHRwKXtcblx0XG5cdHJldHVybiB7XG5cdFx0cG9zdFVzZXI6IGZ1bmN0aW9uKGRhdGEpe1xuXHRcdFx0Ly92YXIgb3B0aW9ucyA9IHtlbWFpbDogZW1haWx9O1xuXHRcdFx0cmV0dXJuICRodHRwLnBvc3QoJy9hcGkvdXNlcicsIGRhdGEpLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2Upe1xuXHRcdFx0XHRyZXR1cm4gcmVzcG9uc2UuZGF0YTtcblx0XHRcdH0pXG5cdFx0fVxuXHR9XG59KSIsIid1c2Ugc3RyaWN0JztcbmFwcC5mYWN0b3J5KCdHZXRJdGVtRmFjdG9yeScsIGZ1bmN0aW9uKCRodHRwKXtcblx0XG5cdHJldHVybiB7XG5cdFx0Z2V0SXRlbTogZnVuY3Rpb24oaWQpe1xuXHRcdFx0Ly92YXIgb3B0aW9ucyA9IHtlbWFpbDogZW1haWx9O1xuXHRcdFx0cmV0dXJuICRodHRwLmdldCgnL2FwaS9pdGVtLycraWQpLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2Upe1xuXHRcdFx0XHRyZXR1cm4gcmVzcG9uc2UuZGF0YTtcblx0XHRcdH0pXG5cdFx0fVxuXHR9XG5cbn0pIiwiJ3VzZSBzdHJpY3QnO1xuYXBwLmZhY3RvcnkoJ0dldEl0ZW1zRmFjdG9yeScsIGZ1bmN0aW9uKCRodHRwKXtcblx0XG5cdHJldHVybiB7XG5cdFx0Z2V0SXRlbXM6IGZ1bmN0aW9uKCl7XG5cdFx0XHRyZXR1cm4gJGh0dHAuZ2V0KCcvYXBpL2l0ZW1saXN0JykudGhlbihmdW5jdGlvbihyZXNwb25zZSl7XG5cdFx0XHRcdHJldHVybiByZXNwb25zZS5kYXRhO1xuXHRcdFx0fSlcblx0XHR9XG5cdH1cbn0pIiwiJ3VzZSBzdHJpY3QnO1xuYXBwLmZhY3RvcnkoJ0dldFVzZXJGYWN0b3J5JywgZnVuY3Rpb24oJGh0dHApe1xuXHRcblx0cmV0dXJuIHtcblx0XHRnZXRVc2VyOiBmdW5jdGlvbihlbWFpbCl7XG5cdFx0XHQvL3ZhciBvcHRpb25zID0ge2VtYWlsOiBlbWFpbH07XG5cdFx0XHRyZXR1cm4gJGh0dHAuZ2V0KCcvYXBpL3VzZXInLCB7ZGF0YTogZW1haWx9KS50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKXtcblx0XHRcdFx0cmV0dXJuIHJlc3BvbnNlLmRhdGE7XG5cdFx0XHR9KVxuXHRcdH1cblx0fVxuXG59KSIsIid1c2Ugc3RyaWN0JztcbmFwcC5mYWN0b3J5KCdSYW5kb21HcmVldGluZ3MnLCBmdW5jdGlvbiAoKSB7XG5cbiAgICB2YXIgZ2V0UmFuZG9tRnJvbUFycmF5ID0gZnVuY3Rpb24gKGFycikge1xuICAgICAgICByZXR1cm4gYXJyW01hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIGFyci5sZW5ndGgpXTtcbiAgICB9O1xuXG4gICAgdmFyIGdyZWV0aW5ncyA9IFtcbiAgICAgICAgJ0hlbGxvLCB3b3JsZCEnLFxuICAgICAgICAnQXQgbG9uZyBsYXN0LCBJIGxpdmUhJyxcbiAgICAgICAgJ0hlbGxvLCBzaW1wbGUgaHVtYW4uJyxcbiAgICAgICAgJ1doYXQgYSBiZWF1dGlmdWwgZGF5IScsXG4gICAgICAgICdJXFwnbSBsaWtlIGFueSBvdGhlciBwcm9qZWN0LCBleGNlcHQgdGhhdCBJIGFtIHlvdXJzLiA6KScsXG4gICAgICAgICdUaGlzIGVtcHR5IHN0cmluZyBpcyBmb3IgTGluZHNheSBMZXZpbmUuJ1xuICAgIF07XG5cbiAgICByZXR1cm4ge1xuICAgICAgICBncmVldGluZ3M6IGdyZWV0aW5ncyxcbiAgICAgICAgZ2V0UmFuZG9tR3JlZXRpbmc6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiBnZXRSYW5kb21Gcm9tQXJyYXkoZ3JlZXRpbmdzKTtcbiAgICAgICAgfVxuICAgIH07XG5cbn0pOyIsIid1c2Ugc3RyaWN0JztcbiIsIid1c2Ugc3RyaWN0JztcblxuYXBwLmRpcmVjdGl2ZSgndHV0b3JpYWxTZWN0aW9uJywgZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB7XG4gICAgICAgIHJlc3RyaWN0OiAnRScsXG4gICAgICAgIHNjb3BlOiB7XG4gICAgICAgICAgICBuYW1lOiAnQCcsXG4gICAgICAgICAgICB2aWRlb3M6ICc9JyxcbiAgICAgICAgICAgIGJhY2tncm91bmQ6ICdAJ1xuICAgICAgICB9LFxuICAgICAgICB0ZW1wbGF0ZVVybDogJ2pzL3R1dG9yaWFsL3R1dG9yaWFsLXNlY3Rpb24vdHV0b3JpYWwtc2VjdGlvbi5odG1sJyxcbiAgICAgICAgbGluazogZnVuY3Rpb24gKHNjb3BlLCBlbGVtZW50KSB7XG4gICAgICAgICAgICBlbGVtZW50LmNzcyh7IGJhY2tncm91bmQ6IHNjb3BlLmJhY2tncm91bmQgfSk7XG4gICAgICAgIH1cbiAgICB9O1xufSk7IiwiJ3VzZSBzdHJpY3QnO1xuYXBwLmRpcmVjdGl2ZSgndHV0b3JpYWxTZWN0aW9uTWVudScsIGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgICByZXN0cmljdDogJ0UnLFxuICAgICAgICByZXF1aXJlOiAnbmdNb2RlbCcsXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnanMvdHV0b3JpYWwvdHV0b3JpYWwtc2VjdGlvbi1tZW51L3R1dG9yaWFsLXNlY3Rpb24tbWVudS5odG1sJyxcbiAgICAgICAgc2NvcGU6IHtcbiAgICAgICAgICAgIHNlY3Rpb25zOiAnPSdcbiAgICAgICAgfSxcbiAgICAgICAgbGluazogZnVuY3Rpb24gKHNjb3BlLCBlbGVtZW50LCBhdHRycywgbmdNb2RlbEN0cmwpIHtcblxuICAgICAgICAgICAgc2NvcGUuY3VycmVudFNlY3Rpb24gPSBzY29wZS5zZWN0aW9uc1swXTtcbiAgICAgICAgICAgIG5nTW9kZWxDdHJsLiRzZXRWaWV3VmFsdWUoc2NvcGUuY3VycmVudFNlY3Rpb24pO1xuXG4gICAgICAgICAgICBzY29wZS5zZXRTZWN0aW9uID0gZnVuY3Rpb24gKHNlY3Rpb24pIHtcbiAgICAgICAgICAgICAgICBzY29wZS5jdXJyZW50U2VjdGlvbiA9IHNlY3Rpb247XG4gICAgICAgICAgICAgICAgbmdNb2RlbEN0cmwuJHNldFZpZXdWYWx1ZShzZWN0aW9uKTtcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgfVxuICAgIH07XG59KTsiLCIndXNlIHN0cmljdCc7XG5hcHAuZGlyZWN0aXZlKCd0dXRvcmlhbFZpZGVvJywgZnVuY3Rpb24gKCRzY2UpIHtcblxuICAgIHZhciBmb3JtWW91dHViZVVSTCA9IGZ1bmN0aW9uIChpZCkge1xuICAgICAgICByZXR1cm4gJ2h0dHBzOi8vd3d3LnlvdXR1YmUuY29tL2VtYmVkLycgKyBpZDtcbiAgICB9O1xuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgcmVzdHJpY3Q6ICdFJyxcbiAgICAgICAgdGVtcGxhdGVVcmw6ICdqcy90dXRvcmlhbC90dXRvcmlhbC12aWRlby90dXRvcmlhbC12aWRlby5odG1sJyxcbiAgICAgICAgc2NvcGU6IHtcbiAgICAgICAgICAgIHZpZGVvOiAnPSdcbiAgICAgICAgfSxcbiAgICAgICAgbGluazogZnVuY3Rpb24gKHNjb3BlKSB7XG4gICAgICAgICAgICBzY29wZS50cnVzdGVkWW91dHViZVVSTCA9ICRzY2UudHJ1c3RBc1Jlc291cmNlVXJsKGZvcm1Zb3V0dWJlVVJMKHNjb3BlLnZpZGVvLnlvdXR1YmVJRCkpO1xuICAgICAgICB9XG4gICAgfTtcblxufSk7IiwiJ3VzZSBzdHJpY3QnO1xuYXBwLmRpcmVjdGl2ZSgnbmF2YmFyJywgZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB7XG4gICAgICAgIHJlc3RyaWN0OiAnRScsXG4gICAgICAgIHNjb3BlOiB7XG4gICAgICAgICAgaXRlbXM6ICc9J1xuICAgICAgICB9LFxuICAgICAgICB0ZW1wbGF0ZVVybDogJ2pzL2NvbW1vbi9kaXJlY3RpdmVzL25hdmJhci9uYXZiYXIuaHRtbCdcbiAgICB9O1xufSk7IiwiJ3VzZSBzdHJpY3QnO1xuYXBwLmRpcmVjdGl2ZSgnZnVsbHN0YWNrTG9nbycsIGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgICByZXN0cmljdDogJ0UnLFxuICAgICAgICB0ZW1wbGF0ZVVybDogJ2pzL2NvbW1vbi9kaXJlY3RpdmVzL2Z1bGxzdGFjay1sb2dvL2Z1bGxzdGFjay1sb2dvLmh0bWwnXG4gICAgfTtcbn0pOyIsIid1c2Ugc3RyaWN0JztcbmFwcC5kaXJlY3RpdmUoJ3JhbmRvR3JlZXRpbmcnLCBmdW5jdGlvbiAoUmFuZG9tR3JlZXRpbmdzKSB7XG5cbiAgICByZXR1cm4ge1xuICAgICAgICByZXN0cmljdDogJ0UnLFxuICAgICAgICB0ZW1wbGF0ZVVybDogJ2pzL2NvbW1vbi9kaXJlY3RpdmVzL3JhbmRvLWdyZWV0aW5nL3JhbmRvLWdyZWV0aW5nLmh0bWwnLFxuICAgICAgICBsaW5rOiBmdW5jdGlvbiAoc2NvcGUpIHtcbiAgICAgICAgICAgIHNjb3BlLmdyZWV0aW5nID0gUmFuZG9tR3JlZXRpbmdzLmdldFJhbmRvbUdyZWV0aW5nKCk7XG4gICAgICAgIH1cbiAgICB9O1xuXG59KTsiXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=