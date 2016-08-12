'use strict'

angular.module('coo.components.modal',[function () {

}])

.directive('cooModal',function () {
    return {
        restrict: 'E',
        replace: true,
        transclude: true,
        scope: {
            size: "@",
            show: "="
        },
        template:"\
        <div class='ui page dimmer'>\
            <div class='content'>\
                <div class='{{size}}' ng-transclude></div>\
            </div>\
        </div>\
        ",
        link:function (scope,element,attrs,controller) {
            if (scope.size == undefined)
                scope.size = 'small'

            var content = angular.element(element[0].querySelector('.content > div'))
            //var content_transition = scope.size == 'small' ? 'vertical flip' : 'fly up'
            var content_transition = scope.size == 'small' ? 'fly down' : 'fly up'

            var dimmer = angular.element(element).dimmer({
                opacity: 0.4,
                closable: false,
                onShow: function () {
                    content.transition(content_transition)
                },
                onHide: function () {
                    content.transition(content_transition)
                }
            })

            var close = angular.element(element[0].querySelector('.content > div > .close'))

            close.bind('click',function () {
                scope.show = false
                scope.$apply()
            })

            scope.$watch('show', function (val) {
                if (val == false || val == undefined)
                    dimmer.dimmer('hide')
                else
                    dimmer.dimmer('show')
            });


        }
    }
})