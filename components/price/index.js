'use strict'

angular.module('coo.components.price',[function () {

}])

.directive('cooPrice',function () {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            value: "@",
            prefix:"@"
        },
        template: "<div class='prices'></div>",
        link: function (scope, element, attrs, controller) {
            scope.$watch("value",function () {
                element.empty()
                if(scope.prefix)
                    element.append(scope.prefix)
                if(scope.value == undefined){
                    element.append('<span class="empty"></span>')
                }else if (
                    scope.value.toString() == '-1' ||
                    scope.value.toString() == '-1.00' ||
                    scope.value.toString() =='-1.00,-1.00' ||
                    scope.value.toString() =='-1.00|-1.00' ||
                    scope.value.toString() =='-1.00|-1.00,-1.00|-1.00'){
                    element.append('')
                }else{
                    var prices = scope.value.replace(/-1.00/g, '').replace(/-1/g, '').split(',')
                    angular.forEach(prices,function (price) {

                        var priceEle = angular.element('<div class="price"></div>')

                        var pricetwo = price.split('|')

                        if (pricetwo.length > 1 && pricetwo[0] == pricetwo[1] && pricetwo[0] == '-') {
                            priceEle.append('-')
                        } else if (pricetwo.length > 1) {
                            priceEle.append('<s class="delete">' + pricetwo[0] + '</s>')
                            priceEle.append(pricetwo[1])
                        } else {
                            priceEle.append(price)
                        }
                        element.append(priceEle)
                    })
                }
            })
        }
    }
})