'use strict'


angular.module('coo.modules.membership.package',[
    'ngRoute',
    'ngSanitize',
    'coo.global',
    'coo.components.loader',
    'coo.components.price',
    'coo.components.rating'
])


.controller('membershipPackageCtrl',['$rootScope','$scope','$location','$route','$window','cooGlobal',function ($rootScope,$scope,$location,$route,$window,cooGlobal) {
    $scope.params = $route.current.params
    $scope.path = function (path) {
        $location.path(path)
    }

    $scope.loaderVisible = false
    $scope.confirm = {
        modalVisible: false,
        title: '提示',
        message: '',
        btnText: '确认',
        isError: false,
        callback: angular.noop,
        closable: true
    }

    $scope.toPay = function (packageToPay) {

        $scope.confirm = {
            modalVisible: true,
            title: '提示',
            message: '确认购买<br/>[' + packageToPay.TemplateName + ']套餐?</br>需要支付' + packageToPay.Price + '元',
            btnText: '确认',
            isError: false,
            closable: true,
            callback: function () {
                $scope.confirm.modalVisible = false
                $scope.prePay(packageToPay)
            }
        }

    }

    $scope.prePay = function (packageToPay) {

        $scope.loaderVisible = true

        cooGlobal.resource(cooGlobal.api.package_order_create).save(
            {
                "Token": $scope.params.token,
                "StoreWXID": $scope.params.StoreWXID,
                "WXID": $scope.params.WXID,
                "PackageID": packageToPay.TemplateNo,
                "VIPNo": $scope.params.vipNo
            },
            function (res) {
                $scope.loaderVisible = false

                if (res.ResCode == 0 && res.ResData.PrePayID) {
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
                            $scope.path('/membership')
                        }
                    }
                } else {
                    $scope.confirm = {
                        modalVisible: true,
                        title: '提示',
                        message: '生成订单失败',
                        btnText: '重试',
                        isError: true,
                        closable: true,
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
                    closable: true,
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
                        $scope.path('/membership')
                    }else{
                        $scope.confirm = {
                            modalVisible: true,
                            title: '提示',
                            message: '充值失败，请重试',
                            btnText: '确定',
                            isError: true,
                            closable: true,
                            callback: function () {
                                $scope.confirm.modalVisible = false
                            }
                        }
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


    $scope.packages = []
    $scope.init = function () {
        $scope.loaderVisible = true
        cooGlobal.resource(cooGlobal.api.membership_package_query).query(
            {
                "Token": $scope.params.token,
                "StoreWXID": $scope.params.StoreWXID
            },
            function (res) {
                $scope.loaderVisible = false
                $scope.packages = res.ResData
            },
            function () {
                $scope.loaderVisible = false
            }
        )
    }

    $scope.init()



}])