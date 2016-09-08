'use strict'


angular.module('coo.modules.store.list',[
    'ngRoute',
    'coo.global',
    'coo.components.modal',
    'coo.components.loader',
    'coo.components.rating'
])


.controller('storesCtrl',['$rootScope','$scope','$location','$route','cooGlobal',function ($rootScope,$scope,$location,$route,cooGlobal) {
    $scope.params = $route.current.params
    $scope.path = function (path) {
        $location.path(path).search({
            'token': $scope.params.token,
            'lnt': $scope.params.lnt,
            'lat': $scope.params.lat,
            'StoreWXID': $scope.params.StoreWXID,
            'WXID': $scope.params.WXID
        })
    }

    $scope.isRoot = $scope.params.isRoot || 0

    $scope.loaderVisible = false
    $scope.isLoaded = false
    $scope.errorModalVisible = false

    $scope.stores = []

    $scope.init = function () {
        $scope.loaderVisible = true
        $scope.errorModalVisible = false
        var queryUrl = $scope.params.TickUseStoreTag ? cooGlobal.api.stores_query_fromcard: cooGlobal.api.stores_query
        var queryParams = $scope.params.TickUseStoreTag?
        {
            "Token": $scope.params.token,
            "ILongitude": $scope.params.lnt,
            "ILatitude": $scope.params.lat,
            "StoreWXID": $scope.params.StoreWXID,
            "TickUseStoreTag": $scope.params.TickUseStoreTag,
            "Source": "wechat",
            "PageSize": 100,
            "PageNum":1,
            "Area": "",
            "IsAll": 1,
            "Order": null
        }:
        {
            "Token": $scope.params.token,
            "lng": $scope.params.lnt,
            "lat": $scope.params.lat,
            "StoreWXID": $scope.params.StoreWXID
        }
        cooGlobal.resource(queryUrl).query(
            queryParams,
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