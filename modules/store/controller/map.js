'use strict'


angular.module('coo.modules.store.map',[
    'ngRoute',
    'coo.global',
    'coo.components.loader',
    'coo.components.price',
    'coo.components.rating'
])


.controller('storeMapCtrl',['$rootScope','$scope','$location','$route','cooGlobal',function ($rootScope,$scope,$location,$route,cooGlobal) {

    var params = $route.current.params


    var map = null

    var t = setInterval(function () {
        map = new BMap.Map('storeMap')
        var point = new BMap.Point(params.Longitude_B, params.Latitude_B)
        var marker = new BMap.Marker(point)
        map.addOverlay(marker)
        map.centerAndZoom(point, 16)

        clearInterval(t)
    }, 500)


    $scope.navToStore = function () {
        var routeSearch = new BMap.RouteSearch();
        var start = {
            latlng: new BMap.Point(params.lnt, params.lat),
            name: "我的位置"
        }
        var end = {
            latlng: new BMap.Point(params.Longitude_B, params.Latitude_B),
            name: params.StoreName
        }
        var opts = {
            mode: BMAP_MODE_DRIVING,//公交、驾车、导航均修改该参数
            region: "合肥"
        }
        var ss = new BMap.RouteSearch();
        routeSearch.routeCall(start, end, opts);
    }


    // var timestamp = new Date().getTime()
    // var nonceStr = cooGlobal.randomString()
    // var signature = cooGlobal.wxSignature(cooGlobal.wx.jsApiTicket, nonceStr, timestamp, $location.absUrl())
    //
    // wx.config({
    //     debug: true,
    //     appId: cooGlobal.wx.appId,
    //     timestamp: timestamp,
    //     nonceStr: nonceStr,
    //     signature: signature,
    //     jsApiList: ['openLocation']
    // })
    //
    // wx.ready(function () {
    //     console.log('123')
    // })
    //
    // wx.openLocation({
    //     latitude: parseFloat(params.Latitude_B), // 纬度，浮点数，范围为90 ~ -90
    //     longitude: parseFloat(params.Longitude_B), // 经度，浮点数，范围为180 ~ -180。
    //     name: params.StoreName, // 位置名
    //     address: '', // 地址详情说明
    //     scale: 16, // 地图缩放级别,整形值,范围从1~28。默认为最大
    //     infoUrl: '' // 在查看位置界面底部显示的超链接,可点击跳转
    // })



}])