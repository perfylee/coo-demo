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




    /*path*/
    $scope.path = function (path) {
        $location.path(path)
    }

    $scope.store = null
    $scope.loaderVisible = false
    $scope.isLoaded = false


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
                'Token': params.token,
                'StoreWXID':params.StoreWXID,
                "StoreID": params.id
            },
            function (res) {
                $scope.loaderVisible = false
                if(res.ResCode == 0) {
                    $scope.store = res.ResData
                }

                $scope.isLoaded = true
            },
            function () {
                console.log('error')
                $scope.loaderVisible = false
                $scope.isLoaded = true
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
    
    $scope.shopMap = function () {
        $location.path('/storeMap').search(
            angular.extend({}, params, {
                'StoreID': $scope.store.StoreID,
                'StoreName':$scope.store.StoreName,
                'Latitude_B': $scope.store.Latitude_B,
                'Longitude_B': $scope.store.Longitude_B,
            })
        )
    }

    $scope.init()

}])