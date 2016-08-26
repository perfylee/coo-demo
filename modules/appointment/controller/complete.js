'use strict'


angular.module('coo.modules.appointment.complete',[
    'ngRoute',
    'coo.global',
    'coo.components.modal',
    'coo.components.loader'
])


.controller('appointmentCompleteCtrl',['$rootScope','$scope','$location','$route','cooGlobal',function ($rootScope,$scope,$location,$route,cooGlobal) {

    $scope.params = $route.current.params
    $scope.loaderVisible = false

    $scope.path = function (path) {
        $location.path(path).search({
            'token': $scope.params.token,
            'lnt': $scope.params.lnt,
            'lat': $scope.params.lat,
            'StoreWXID': $scope.params.StoreWXID,
            'WXID': $scope.params.WXID
        })
    }

    if($rootScope.appointment == null || $rootScope.appointment.store == null){
        $location.path('/appointment')
        return
    }


    $scope.store = $rootScope.appointment.store
    $scope.service = $rootScope.appointment.service
    $scope.time = $rootScope.appointment.time


    $rootScope.appointment.store = null
    $rootScope.appointment.service = null
    $rootScope.appointment.time = null

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

    $scope.goBack = function () {
        $location.path('/appointment')
    }

}])