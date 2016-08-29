'use strict'


angular.module('coo.modules.membership',[
    'ngRoute',
    'ngSanitize',
    'coo.global',
    'coo.components.loader',
    'coo.components.price',
    'coo.components.rating'
])


.controller('membershipCtrl',['$rootScope','$scope','$location','$route','cooGlobal',function ($rootScope,$scope,$location,$route,cooGlobal) {

    $scope.params = $route.current.params

    $scope.path = function (path) {

        if(path == '/membership/package'){
            $location.path(path).search({
                'token': $scope.params.token,
                'lnt': $scope.params.lnt,
                'lat': $scope.params.lat,
                'StoreWXID': $scope.params.StoreWXID,
                'WXID': $scope.params.WXID,
                'vipNo':($scope.membership.obj && $scope.membership.obj.VIPNo) ? $scope.membership.obj.VIPNo :''
            })
        }else {
            $location.path(path).search({
                'token': $scope.params.token,
                'lnt': $scope.params.lnt,
                'lat': $scope.params.lat,
                'StoreWXID': $scope.params.StoreWXID,
                'WXID': $scope.params.WXID
            })
        }
    }

    $scope.confirm = {
        modalVisible: false,
        title: '提示',
        message: '',
        btnText: '确认',
        isError: false,
        callback: angular.noop,
        closable: true
    }


    $scope.packageModalVisible = false
    $scope.loaderVisible = false

    $scope.packageToPay = null

    $scope.membership = {}
    $scope.membership.loading = false
    $scope.membership.init = function () {
        $scope.membership.loading = true
        cooGlobal.resource(cooGlobal.api.membership_query).query(
            {
                "Token": $scope.params.token,
                "StoreWXID": $scope.params.StoreWXID,
                'WXID':$scope.params.WXID
            },
            function (res) {
                $scope.loaded = true

                $scope.membership.loading = false
                $scope.membership.obj = res.ResData[0]
            },
            function () {
                $scope.loaded = true

                $scope.membership.loading = false
                console.log('error')
            }
        )
    }

    $scope.package = {}
    $scope.package.loading = false
    $scope.package.items = []
    $scope.package.init = function () {
        $scope.package.loading = true
        cooGlobal.resource(cooGlobal.api.membership_package_query).query(
            {
                "Token": $scope.params.token,
                "StoreWXID": $scope.params.StoreWXID
            },
            function (res) {
                $scope.package.loading = false
                $scope.package.items = res.ResData
                $scope.packageToPay = $scope.package.items && $scope.package.items.length > 0 ? $scope.package.items[0] : null
            },
            function () {
                $scope.package.loading = false
                console.log('error')
            }
        )
    }

    $scope.package.select = function (item) {
        $scope.packageToPay = item
        $scope.packageModalVisible = false
    }

    $scope.toPay = function () {

        if ($scope.packageToPay == null)
            return

        $scope.confirm = {
            modalVisible: true,
            title: '提示',
            message: '确认购买<br/>[' + $scope.packageToPay.TemplateName + ']套餐?<br/>需要支付' + $scope.packageToPay.Price + '元',
            btnText: '确认',
            isError: false,
            closable: true,
            callback: function () {
                $scope.confirm.modalVisible = false
                $scope.prePay()
            }
        }

    }
    
    $scope.prePay = function () {

        $scope.loaderVisible = true

        cooGlobal.resource(cooGlobal.api.package_order_create).save(
            {
                "Token": $scope.params.token,
                "StoreWXID": $scope.params.StoreWXID,
                "WXID": $scope.params.WXID,
                "PackageID": $scope.packageToPay.TemplateNo,
                "VIPNo": ($scope.membership.obj && $scope.membership.obj.VIPNo) ? $scope.membership.obj.VIPNo : ''
            },
            function (res) {
                $scope.loaderVisible = false

                if(res.ResCode == 0 && res.ResData.PrePayID){
                    $scope.doPay(res.ResData.PrePayID)
                }else if (res.ResCode == 1){
                    $scope.confirm = {
                        modalVisible: true,
                        title: '提示',
                        message: '充值成功',
                        btnText: '确认',
                        isError: false,
                        closable:false,
                        callback: function () {
                            $scope.confirm.modalVisible = false
                            $scope.membership.init()
                        }
                    }
                }else{
                    $scope.confirm = {
                        modalVisible: true,
                        title: '提示',
                        message: '生成订单失败',
                        btnText: '重试',
                        isError: true,
                        closable:true,
                        callback: function () {
                            $scope.confirm.modalVisible = false
                            $scope.prePay()
                        }
                    }
                }

            },
            function () {
                $scope.loaderVisible = false

                $scope.confirm = {
                    modalVisible: true,
                    title: '提示',
                    message: '生成订单失败',
                    btnText: '重试',
                    isError: true,
                    closable:true,
                    callback: function () {
                        $scope.confirm.modalVisible = false
                        $scope.prePay()
                    }
                }
            }
        )
    }
    
    $scope.doPay = function (prepay_id) {
        var wxPayParams = {
            appId: $scope.params.StoreWXID, //cooGlobal.wx.appId,
            nonceStr: cooGlobal.randomString(),
            package: 'prepay_id=' + prepay_id,
            signType: 'MD5',
            timeStamp: new Date().getTime().toString(),
            paySign: ''
        }

        var preSign = 'appId=' + wxPayParams.appId + '&nonceStr=' + wxPayParams.nonceStr + '&package=' + wxPayParams.package + '&signType=' + wxPayParams.signType + '&timeStamp=' + wxPayParams.timeStamp;
        preSign = preSign + '&key='+cooGlobal.wx.key

        var paySign = CryptoJS.MD5(preSign).toString().toUpperCase()

        wxPayParams.paySign = paySign

        function onBridgeReady() {
            WeixinJSBridge.invoke(
                'getBrandWCPayRequest',
                wxPayParams,
                function (res) {
                    if (res.err_msg == "get_brand_wcpay_request：ok") {
                        $scope.membership.init()
                    }else{
                    }
                }
            )
        }

        if (typeof WeixinJSBridge == "undefined") {
            if (document.addEventListener) {
                document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);
            } else if (document.attachEvent) {
                document.attachEvent('WeixinJSBridgeReady', onBridgeReady);
                document.attachEvent('onWeixinJSBridgeReady', onBridgeReady);
            }
        } else {
            onBridgeReady()
        }
    }


    $scope.createPayCode = function () {
        $scope.loaderVisible = true
        cooGlobal.resource(cooGlobal.api.membership_pay_code).query(
            {
                "Token":$scope.params.token,
                "StoreWXID":$scope.params.StoreWXID,
                "WXID":$scope.params.WXID,
                "VIPNo":$scope.membership.obj.VIPNo
            },
            function (res) {
                $scope.loaderVisible = false

                if(res.ResCode == 0 ){
                    $scope.confirm = {
                        modalVisible: true,
                        title: '提示',
                        message: '<div class="paycodenum"><span>您的支付码是</span>' + res.ResData.Code + '<span>有效期至：' + res.ResData.ExpireTime+'</span></div>',
                        btnText: '确认',
                        isError: false,
                        closable: true,
                        callback: function () {
                            $scope.confirm.modalVisible = false
                        }
                    }
                }else {
                    $scope.confirm = {
                        modalVisible: true,
                        title: '提示',
                        message: '生成支付码失败',
                        btnText: '重试',
                        isError: true,
                        closable: true,
                        callback: function () {
                            $scope.confirm.modalVisible = false
                            $scope.createPayCode()
                        }
                    }
                }

            },
            function () {
                $scope.loaderVisible = false

                $scope.confirm = {
                    modalVisible: true,
                    title: '提示',
                    message: '生成支付码失败',
                    btnText: '重试',
                    isError: true,
                    closable:true,
                    callback: function () {
                        $scope.confirm.modalVisible = false
                        $scope.createPayCode()
                    }
                }
            }
        )
    }



    $scope.$watch('membership.loading',function () {
        $scope.loaderVisible = $scope.membership.loading || $scope.package.loading
    })

    $scope.$watch('package.loading',function () {
        $scope.loaderVisible = $scope.membership.loading || $scope.package.loading
    })


    $scope.membership.init()
    $scope.package.init()

}])