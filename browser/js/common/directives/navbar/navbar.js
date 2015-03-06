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