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