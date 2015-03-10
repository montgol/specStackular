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
