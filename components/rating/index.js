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
                var cnt = Math.max(0, scope.value)
                element.empty()
                for (var i = 0; i < cnt; i++)
                    element.append('<i class="icon star"></i>')
                for (var i = 0; i < 5 - cnt; i++)
                    element.append('<i class="icon empty star"></i>')
            })
        }
    }
})