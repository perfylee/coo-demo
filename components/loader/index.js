'use strict'

angular.module('coo.components.loader',[function () {

}])

.directive('cooLoader',function () {
    return {
        restrict: 'E',
        replace: true,
        transclude: true,
        scope: {
            size: "@",
            show: "="
        },
        template:"\
        <div class='ui {{show?\"active\":\"\"}} dimmer coo-loader'>\
            <div class='ui {{size}} loader'></div>\
        </div>\
        ",
        link:function (scope,element,attrs,controller) {
            if (scope.size == undefined)
                scope.size = 'large'

            if (scope.show == undefined)
                scope.show = false

        }
    }
})