'use strict'

angular.module('coo.modules.appointment',[
    'ngRoute',
    'ngCookies',
    'coo.global',
    'coo.components.modal',
    'coo.components.loader'
])

.controller('appointmentCtrl',['$rootScope','$scope','$location','$route','$window','$cookies','cooGlobal',function ($rootScope,$scope,$location,$route,$window,$cookies,cooGlobal) {


    /*url params*/
    $scope.params = $route.current.params

    /*path*/
    $scope.path = function (path) {
        $location.path(path).search({
            'token': $scope.params.token,
            'lnt': $scope.params.lnt,
            'lat': $scope.params.lat,
            'StoreWXID': $scope.params.StoreWXID,
            'WXID': $scope.params.WXID
        })
    }

    /*error*/

    var defaultError = {
        closable: false,
        message: '未知错误',
        retry: angular.noop,
        btnText: '重试'
    }

    $scope.error = angular.extend({},defaultError, {
        modalVisible: false
    })

    
    var execError = function (error) {
        error = angular.extend({}, defaultError, error)

        $scope.error.modalVisible = true

        $scope.error.closable = error.closable
        $scope.error.message = error.message
        $scope.error.btnText = error.btnText

        $scope.error.retry = function () {
            $scope.error.modalVisible = false
            error.retry()
        }
    }

    /*loader*/
    $scope.loaderVisible = false
    $scope.loaded = false
    $scope.updateLoading = function () {
        if($scope.user.loading == false && $scope.store.loading == false && $scope.appointment.loading == false) {
            $scope.loaderVisible = false
        }
    }


    /*top*/
    $scope.top = {}
    $scope.top.day =  (new Date().getDate() < 10 ?'0':'') + new Date().getDate()
    $scope.top.month = cooGlobal.enMonth[new Date().getMonth()]
    $scope.top.slogan = '生活不是只有诗和远方，还有洗车'



    /*category*/
    $scope.category = {}
    $scope.category.items = [
        {name:'美容清洁',value:'美容清洁'},
        {name:'维修保养',value:'维修保养'},
        {name:'轮胎服务',value:'轮胎相关服务'}
    ]
    $scope.category.all = []
    $scope.category.filter = ''
    $scope.category.modalVisible = false
    $scope.category.select = function (item) {

        $scope.category.modalVisible = false

        if (angular.isString(item))
            item = {name: item, value: item}

        if (item.value == $rootScope.appointment.category.value)
            return

        $rootScope.appointment.category = item

        //重新加载门店和时间
        $rootScope.appointment.store = null
        $rootScope.appointment.service = null
        $rootScope.appointment.time = null

        $scope.appointment.init()
        $scope.store.init()

    }
    $scope.category.more = function () {
        if ($scope.category.all.length == 0) {
            $scope.loaderVisible = true
            cooGlobal.resource(cooGlobal.api.appointment_categories_query).query(
                {
                    "StoreWXID":$scope.params.StoreWXID,
                    "Token":$scope.params.token
                },
                function (res) {
                    if(res.ResCode == 0)
                        $scope.category.all = res.ResData

                    $scope.loaderVisible = false
                    $scope.category.modalVisible = true
                },
                function () {
                    $scope.loaderVisible = false
                    $scope.category.modalVisible = true
                }
            )
        } else {
            $scope.category.modalVisible = true
        }
    }



    /*user && car*/
    $scope.user = {}
    $scope.user.loading = false

    $scope.car = {}
    $scope.car.items = []
    $scope.car.modalVisible = false
    $scope.car.select = function (item) {
        $scope.car.modalVisible = false
        if($rootScope.appointment.car == null || item.CarGuid != $rootScope.appointment.car.CarGuid) {
            $rootScope.appointment.car = item
        }
    }

    $scope.user.init = function () {
        $scope.user.loading = true
        //customer cars
        cooGlobal.resource(cooGlobal.api.user_query).query(
            {
                'Token': $scope.params.token,
                'StoreWXID':$scope.params.StoreWXID
            },
            function (res) {
                $scope.user.loading = false
                if(res.ResCode == 0) {
                    $scope.car.items = res.ResData.Cars
                    $scope.user = res.ResData.Customer
                }else {
                    execError({message: '查询用户和车辆信息失败', retry: $scope.user.init})
                }
            },
            function () {
                $scope.user.loading = false
                execError({message: '查询用户和车辆信息失败', retry: $scope.user.init})
            }
        )
    }

    $scope.$watch('user.loading',function () {
        $scope.loaderVisible = $scope.user.loading || $scope.store.loading ||  $scope.appointment.loading
    })

    /*store*/

    $scope.store = {}
    $scope.store.loading = false
    $scope.store.items = []
    $scope.store.modalVisible = false
    $scope.store.tabIndex = 'listView' //listView mapView
    $scope.store.init = function () {
        $scope.store.loading = true

        //customer cars
        cooGlobal.resource(cooGlobal.api.stores_query).query(
            {
                'Token': $scope.params.token,
                'lng': $scope.params.lnt,
                'lat': $scope.params.lat,
                'StoreWXID': $scope.params.StoreWXID,
                'AppointmentType': $rootScope.appointment.category.value
            },
            function (res) {
                $scope.store.loading = false
                if(res.ResCode == 0) {
                    $scope.store.items = res.ResData
                    $scope.store.mapStore = res.ResData[0]
                    $scope.store.mapStoreIndex = 0
                }else {
                   //execError({message: '查询门店信息失败', retry: $scope.store.init})
                }
            },
            function () {
                console.log('error')
                $scope.store.loading = false
                //execError({message: '查询门店信息失败', retry: $scope.store.init})
            }
        )
    }
    $scope.store.select = function (store) {
        $scope.store.modalVisible = false
        if(store.StoreID != $rootScope.appointment.store.StoreID){

            $rootScope.appointment.store = null
            $rootScope.appointment.service = null
            $rootScope.appointment.time = null
            $scope.appointment.update(store)
        }
    }
    $scope.store.open = function (storeId,$event) {
        $event.stopPropagation()
        $location.path('/store/' + storeId)
    }

    $scope.store.mapStoreIndex = -1
    $scope.store.mapStore = null

    $scope.store.mapStoreChange = function (d,$event) {
        $event.stopPropagation()
        $scope.store.mapStoreIndex += d
        $scope.store.mapStoreIndex = Math.max($scope.store.mapStoreIndex, 0)
        $scope.store.mapStoreIndex = Math.min($scope.store.mapStoreIndex, $scope.store.items.length)
        $scope.store.mapStore = $scope.store.items[$scope.store.mapStoreIndex]

        var point = new BMap.Point($scope.store.mapStore.Longitude_B, $scope.store.mapStore.Latitude_B)
        map.panTo(point)
    }

    var map = null
    var mapBuild = function () {
        var t = setInterval(function () {
            if (map == null)
                map = new BMap.Map('map')

            map.clearOverlays()

            angular.forEach($scope.store.items,function (store) {
                var point = new BMap.Point(store.Longitude_B, store.Latitude_B)
                var marker = new BMap.Marker(point)
                map.addOverlay(marker)
            })

            if($scope.store.mapStore!=null) {
                var point = new BMap.Point($scope.store.mapStore.Longitude_B, $scope.store.mapStore.Latitude_B)
                map.centerAndZoom(point, 16)
            }else{
                var point = new BMap.Point($scope.wxParams.lng, $scope.wxParams.lat)
                map.centerAndZoom(point, 16)
            }

            clearInterval(t)
        }, 500)
    }


    $scope.$watch('store.modalVisible',function () {
        if($scope.store.tabIndex == 'mapView' ) {
            mapBuild()
        }
    })
    $scope.$watch('store.tabIndex',function () {
        if($scope.store.tabIndex == 'mapView' ) {
            mapBuild()
        }
    })
    $scope.$watch('store.loading',function () {
        $scope.loaderVisible = $scope.user.loading || $scope.store.loading ||  $scope.appointment.loading
    })

    /*time*/
    $scope.time = {}
    $scope.time.items = [[],[],[]] //今天,明天,后天
    $scope.time.tabIndex = 0
    $scope.time.quickItems = []
    $scope.time.modalVisible = false
    $scope.time.quickSelect = function (time,$event) {
        $event.stopPropagation()
        $rootScope.appointment.time = time
    }
    $scope.time.select = function (time) {
        if(time.IsUsed == 0) {
            $rootScope.appointment.time = time
            $scope.time.modalVisible = false
        }
    }



    /*appointment*/
    //global scope to record appointment basic info
    $rootScope.appointment || ($rootScope.appointment = {
        category: null,
        car: null,
        store: null,
        service: null,
        time: null
    })
    $rootScope.appointment.category || ($rootScope.appointment.category = $scope.category.items[0])


    $scope.appointment.loading = false
    $scope.appointment.submitVisible = false
    $scope.appointment.init = function () {
        $scope.loaded = false
        $scope.appointment.loading = true
        //default appointment
        cooGlobal.resource(cooGlobal.api.appointment_default).query(
            {
                'Token': $scope.params.token,
                'lng': $scope.params.lnt,
                'lat': $scope.params.lat,
                'StoreWXID': $scope.params.StoreWXID,
                'AppointmentType': $rootScope.appointment.category.value
            },
            function (res) {
                $scope.appointment.loading = false
                if(res.ResCode == 0){
                    if(res.ResData.DefaultCar == null){
                        execError({
                            message: '尚未添加爱车，前往添加',
                            btnText:'确定',
                            retry: function () {
                                $window.location.href = cooGlobal.modules.car+'?token='+$scope.params.token+'&WXID='+$scope.params.WXID+'&StoreWXID='+$scope.params.StoreWXID
                            },
                            closable: false})
                        return
                    }
                    $rootScope.appointment.car = $rootScope.appointment.car || res.ResData.DefaultCar
                    $scope.appointment.update($rootScope.appointment.store || res.ResData.StoreItem)

                    if($cookies.get('introed') == null) {

                        $scope.intro()
                        $cookies.put('introed', true, {expires: new Date().dateAdd(365)})
                    }


                }else {
                    //execError({message: '加载预约信息失败', retry: $scope.appointment.init, closable: true})
                }

                $scope.loaded = true
            },
            function () {
                console.log('error')
                $scope.appointment.loading = false
                execError({message: '加载预约信息失败', retry: $scope.appointment.init, closable: true})

                $scope.loaded = true
            }
        )
    }
    $scope.intro = function () {
        if ($rootScope.appointment.store != null && $rootScope.appointment.service != null && $rootScope.appointment.time != null) {
            introJs().setOptions({
                'disableInteraction':true,
                'prevLabel': '&larr; 上一步',
                'nextLabel': '下一步 &rarr;',
                'skipLabel': '跳过',
                'doneLabel': '完成'
            }).start()
        }
    }
    $scope.appointment.update = function (store) {

        if(store == null) {
            $rootScope.appointment.store = null
            $rootScope.appointment.service = null
            $rootScope.appointment.time = null
            $scope.time.quickItems = []
            return
        }

        $rootScope.appointment.store = $rootScope.appointment.store || store
        $rootScope.appointment.service = $rootScope.appointment.service || store.StoreWorkPlace[0]

        $scope.time.quickItems = []
        $scope.time.items = [[], [], []]

        if($rootScope.appointment.service.TypeWorkPlaces == 0)
            return

        for (var i = 0; i < $rootScope.appointment.service.TypeWorkPlaces.length; i++) {
            var time = $rootScope.appointment.service.TypeWorkPlaces[i]
            if (time.IsUsed == 0)
                $scope.time.quickItems.push(time)

            if ($scope.time.quickItems.length == 4)
                break;
        }

        $rootScope.appointment.time =  $rootScope.appointment.time || $scope.time.quickItems[0]

        angular.forEach(store.StoreWorkPlace[0].TypeWorkPlaces, function (value) {
            var index = new Date(value.AccurateStartTime.replace(/-/g, "/")).dateDiff(new Date(), 'd')
            if (index >= 0 && index <= 2)
                $scope.time.items[index].push(value)
        })
    }

    $scope.appointment.toSubmit = function () {

        if($rootScope.appointment.car == null || $rootScope.appointment.store == null || $rootScope.appointment.service == null || $rootScope.appointment.time == null) {
            return
        }
        // if( $rootScope.appointment.car == null) {
        //     execError({message: '尚未添加预约车辆', retry: angular.noop, btnText: '确定', closable: true})
        //     return
        // }
        //
        // if( $rootScope.appointment.store == null) {
        //     execError({
        //         message: '暂时没有提供 ' + $rootScope.appointment.category.name + ' 服务的门店',
        //         retry: angular.noop,
        //         btnText: '确定',
        //         closable: true
        //     })
        //     return
        // }


        $scope.appointment.submitVisible = true



    }
    $scope.appointment.submit = function () {

        var saveParams = {
            "Source": "wechat",
            "Token": $scope.params.token,
            "StoreWXID": $scope.params.StoreWXID,
            "StoreID": $rootScope.appointment.store.StoreID,
            "CarNum": $rootScope.appointment.car.CarNum,
            "CarGuid": $rootScope.appointment.car.CarGuid,
            "AppointmentType": $rootScope.appointment.service.ServiceType,
            "AccurateStartTime": $rootScope.appointment.time.AccurateStartTime,
            "AppointmentSource": "wechat(" + (['iPad', 'iPhone', 'iPod'].indexOf($window.navigator.platform) >= 0 ? 'iphone' : 'android') + ")"
        }

        console.log($rootScope.appointment.service)

        $scope.loaderVisible = true

        cooGlobal.resource(cooGlobal.api.appointment_save).save(
            saveParams,
            function (res) {
                if(res.ResCode == 0){
                    $location.path('/appointment/complete')
                }else if (res.ResCode == 1){
                    execError({
                        message: '预约位被占用，请重新选择',
                        btnText:'知道了',
                        closable: true
                    })
                }else if (res.ResCode == 2){
                    execError({
                        message: '您还有未完成的预约，不能重复预约',
                        btnText:'知道了',
                        closable: true
                    })
                }else if (res.ResCode == 2){
                    execError({
                        message: '预约位已占用，请重新选择',
                        btnText:'知道了',
                        closable: true
                    })
                }else{
                    execError({
                        message: '预约失败',
                        retry: $scope.appointment.submit,
                        closable: true
                    })
                }

                $scope.loaderVisible = false
            },
            function () {
                $scope.loaderVisible = false
                console.log('error')
                execError({
                    message: '预约失败',
                    retry: $scope.appointment.submit,
                    closable: true
                })
            }
        )



        $scope.appointment.submitVisible = false
        $scope.loaderVisible = true

    }

    $scope.$watch('appointment.loading',function () {
        $scope.loaderVisible = $scope.user.loading || $scope.store.loading || $scope.appointment.loading
    })

    //init

    $scope.user.init()
    $scope.store.init()
    $scope.appointment.init()


    $scope.isPrice = function (price) {
        if(
            price == null ||
            price == undefined ||
            price.toString() == '' ||
            price.toString() == '-1' ||
            price.toString() == '-1,-1' ||
            price.toString() == '-1.00' ||
            price.toString() == '-1.00,-1.00' ||
            price.toString() == '-1|-1'||
            price.toString() == '-1|-1,-1|-1'||
            price.toString() == '-1.00|-1.00'||
            price.toString() == '-1.00|-1.00,-1.00|-1.00') {
            return false
        }
        return true
    }


}])