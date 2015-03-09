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

                console.log(scope);


            }
        };
    }]);

app.controller('productstar', function($scope) {

    $scope.rate1 = 0;

    $scope.rate2 = 6;

    $scope.val = $scope.rating;

});