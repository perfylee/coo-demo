'use strict'


angular.module('coo.modules.store',[
    'ngRoute',
    'coo.global',
    'coo.components.loader',
    'coo.components.price',
    'coo.components.rating'
])


.controller('storeCtrl',['$rootScope','$scope','$location','$route','$window','cooGlobal',function ($rootScope,$scope,$location,$route,$window,cooGlobal) {

    var params = $route.current.params




    /*path*/
    $scope.path = function (path) {
        $location.path(path)
    }
    $scope.back = function () {
        $window.history.go(-1)
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

        var wxRegisterParams = new FormData()
        wxRegisterParams.append('Action', 'GetWX_Info')
        wxRegisterParams.append('RequestURL', 'http://'+ $location.host()+'/newcoo/index.html')

        var wxLocationParams = new FormData()
        wxLocationParams.append('Action', 'bd_decrypt')
        wxLocationParams.append('latitude', $scope.store.Latitude_B)
        wxLocationParams.append('longitude', $scope.store.Longitude_B)

        var location = {
            'latitude': -1,
            'longitude': -1
        }

        var shopNav = function () {
            cooGlobal.resource(cooGlobal.modules.wxToken).form(
                wxRegisterParams,
                function (res) {
                    wx.config({
                        debug: false,
                        appId: res.ResData.Appid,
                        timestamp: res.ResData.Timestamp,
                        nonceStr: res.ResData.Nonce,
                        signature: res.ResData.Signature,
                        jsApiList: ['openLocation']
                    })
                    wx.ready(function () {
                        wx.openLocation({
                            latitude: parseFloat(location.latitude), // 纬度，浮点数，范围为90 ~ -90
                            longitude: parseFloat(location.longitude), // 经度，浮点数，范围为180 ~ -180。
                            name: $scope.store.StoreName, // 位置名
                            address: $scope.store.StoreAddress, // 地址详情说明
                            scale: 16, // 地图缩放级别,整形值,范围从1~28。默认为最大
                            infoUrl: '' // 在查看位置界面底部显示的超链接,可点击跳转
                        })
                    })
                }
                ,function () {
                }
            )
        }

        cooGlobal.resource(cooGlobal.modules.wxToken).form(
            wxLocationParams,
            function (res) {
                location.latitude = res.ResData.lat
                location.longitude = res.ResData.lnt
                shopNav()
            },
            function () {
            }
        )

    }

    $scope.init()

}])