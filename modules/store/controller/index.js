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
            //门店详情
            //{
            //  'Token': '5354bcf5-1351-47b8-be4b-7df254474c58'
            //  'StoreWXID':'',
            //  "StoreID": "23b21f20-1cd3-4ac3-adae-8119ebdeeead"
            //}
            {
                'Token': '5354bcf5-1351-47b8-be4b-7df254474c58',
                'StoreWXID':'',
                "StoreID": "23b21f20-1cd3-4ac3-adae-8119ebdeeead"
            },
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