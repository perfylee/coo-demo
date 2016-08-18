'use strict'

angular.module('coo.components.rating',[function () {

}])

.directive('cooRating',function () {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            value: "@"
        },
        template: "<div class='ratings'></div>",
        link: function (scope, element, attrs, controller) {
            scope.$watch('value', function () {
                element.empty()
                for (var i = 0; i < scope.value; i++)
                    element.append('<i class="icon star"></i>')
            })
        }
    }
})