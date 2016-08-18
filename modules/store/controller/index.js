'use strict'


angular.module('coo.modules.store',[
    'ngRoute',
    'coo.global',
    'coo.components.loader',
    'coo.components.price',
    'coo.components.rating'
])


.controller('storeCtrl',['$rootScope','$scope','$location','$route','cooGlobal',function ($rootScope,$scope,$location,$route,cooGlobal) {

    var params = $route.current.params

    $scope.store = null
    $scope.loaderVisible = false


    $scope.init = function () {
        $scope.loaderVisible = true
        cooGlobal.resource(cooGlobal.api.store_query).query(
            {StoreID: params.id},
            function (res) {
                $scope.store = res.ResData
                $scope.loaderVisible = false
            },
            function () {
                console.log('error')
            }
        )
    }

    $scope.select = function (service) {
        $rootScope.appointment = $rootScope.appointment || {}
        $rootScope.appointment.store = $scope.store
        $rootScope.appointment.service = service
        $rootScope.appointment.time = null

        $location.path('/appointment')
    }

    $scope.back = function () {
        $location.path('/appointment')
    }
    $scope.init()

}])