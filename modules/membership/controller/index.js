'use strict'


angular.module('coo.modules.membership',[
    'coo.global',
    'coo.components.loader',
    'coo.components.price',
    'coo.components.rating'
])


.controller('membershipCtrl',['$rootScope','$scope','$location','cooGlobal',function ($rootScope,$scope,$location,cooGlobal) {
    $scope.path = function (url) {
        $location.path(url)
    }
    $scope.packageModalVisible = false

}])