'use strict';
app.directive('men-dropdown', function () {
    return {
        restrict: 'E',
        scope: {
            items: '='
        },
        templateUrl: 'js/common/directives/navbar/men-dropdown/men-dropdown.html'
    };
});