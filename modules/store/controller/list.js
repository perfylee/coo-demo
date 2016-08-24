'use strict'


angular.module('coo.modules.store.list',[
    'ngRoute',
    'coo.global',
    'coo.components.modal',
    'coo.components.loader',
    'coo.components.rating'
])


.controller('storesCtrl',['$rootScope','$scope','$location','$route','cooGlobal',function ($rootScope,$scope,$location,$route,cooGlobal) {

    var params = $route.current.params

    $scope.path = function (path) {
        $location.path(path)
    }

    $scope.loaderVisible = false
    $scope.isLoaded = false
    $scope.errorModalVisible = false

    $scope.stores = []

    $scope.init = function () {
        $scope.loaderVisible = true
        $scope.errorModalVisible = false
        cooGlobal.resource(cooGlobal.api.stores_query).query(
            {
                "Token": params.token,
                "lng": params.lnt,
                "lat": params.lat,
                "StoreWXID": params.StoreWXID
            },
            function (res) {
                $scope.loaderVisible = false
                if (res.ResCode == 0) {
                    $scope.stores = angular.isArray(res.ResData) ? res.ResData : []
                } else {
                    $scope.errorModalVisible = true
                }

                $scope.isLoaded = true
            },
            function () {
                console.log('error')
                $scope.loaderVisible = false
                $scope.errorModalVisible = true
            }
        )
    }

    $scope.select = function (store) {
        $location.path('/store/'+store.StoreID)
    }


    $scope.init()

}])