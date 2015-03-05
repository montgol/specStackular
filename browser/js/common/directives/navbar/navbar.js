'use strict';
app.directive('navbar', function () {
    return {
        restrict: 'E',
        scope: {
          items: '=',
          currentUserAdmin: '='
        },
        templateUrl: 'js/common/directives/navbar/navbar.html'
    };
});