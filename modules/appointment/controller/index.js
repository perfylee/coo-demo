'use strict'

angular.module('coo.modules.appointment',[
    'ngRoute',
    'coo.global',
    'coo.components.modal',
    'coo.components.loader'
])

.controller('appointmentCtrl',['$rootScope','$scope','$location','$route','cooGlobal',function ($rootScope,$scope,$location,$route,cooGlobal) {

    /*url params*/
    var params = $route.current.params


    /*path*/
    $scope.path = function (path) {
        $location.path(path)
    }

    /*error*/
    $scope.error = {}
    $scope.error.closable = false
    $scope.error.message = ''
    $scope.error.modalVisible = false
    $scope.error.retry = angular.noop()
    
    var execError = function (message,retry,closable) {
        closable = closable || false
        $scope.error.modalVisible = true
        $scope.error.closable = closable
        $scope.error.message = message
        $scope.error.retry = function () {
            $scope.error.modalVisible = false
            retry()
        }
    }

    /*loader*/
    $scope.loaderVisible = false
    $scope.updateLoading = function () {
        if($scope.user.loading == false && $scope.store.loading == false && $scope.appointment.loading == false) {
            $scope.loaderVisible = false
        }
    }

    /*top*/
    $scope.top = {}
    $scope.top.day =  new Date().getDate() < 10 ?'0':''+ new Date().getDate()
    $scope.top.month = cooGlobal.enMonth[new Date().getMonth()]
    $scope.top.slogan = '生活不是只有诗和远方，还有洗车'



    /*category*/
    $scope.category = {}
    $scope.category.items = [
        {name:'保养',value:'保养',en:'Maintenance',sort:0},
        {name:'洗车',value:'洗车',en:'Vehicle Cleaning',sort:1},
        {name:'轮胎',value:'轮胎',en:'TireService',sort:2}
    ]
    $scope.category.order = function (category) {
        var currIndex = 0
        for(var i = 0;i< 3 ;i++) {
            if($scope.category.items[i].name == category.name){
                currIndex = i
                break
            }
        }

        var prevIndex = (currIndex - 1 < 0) ? 2 : (currIndex - 1)
        var nextIndex = (currIndex + 1 > 2) ? 0 : (currIndex + 1)

        $scope.category.items[prevIndex].sort = 0
        $scope.category.items[currIndex].sort = 1
        $scope.category.items[nextIndex].sort = 2
    }
    $scope.category.select = function (item) {

        if(item.sort == 1)
            return

        $scope.category.order(item)
        $rootScope.appointment.category = item

        //重新加载门店和时间
        $rootScope.appointment.store = null
        $rootScope.appointment.service = null
        $rootScope.appointment.time = null

        $scope.appointment.init()
        $scope.store.init()

    }



    /*user && car*/
    $scope.user = {}
    $scope.user.loading = false

    $scope.car = {}
    $scope.car.items = []
    $scope.car.modalVisible = false
    $scope.car.select = function (item) {
        if(item.CarGuid != $rootScope.appointment.car.CarGuid) {
            $rootScope.appointment.car = item
            $scope.car.modalVisible = false
        }
    }

    $scope.user.init = function () {
        $scope.user.loading = true
        //customer cars
        cooGlobal.resource(cooGlobal.api.user_query).query(
            {'Token': params.Token},
            function (res) {
                $scope.user.loading = false
                if(res.ResCode == 0) {
                    $scope.car.items = res.ResData.Cars
                    $scope.user = res.ResData.Customer
                }else {
                    execError('查询用户和车辆信息失败', $scope.user.init)
                }
            },
            function () {
                $scope.user.loading = false
                execError('查询用户和车辆信息失败', $scope.user.init)

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
                'Token': params.Token,
                'lng': params.lng,
                'lat': params.lat,
                'StoreWXID': params.StoreID,
                'AppointmentType': $rootScope.appointment.category.value
            },
            function (res) {
                $scope.store.loading = false
                if(res.ResCode == 0) {
                    $scope.store.items = res.ResData
                    $scope.store.mapStore = res.ResData[0]
                    $scope.store.mapStoreIndex = 0
                }else {
                    execError('查询门店信息失败', $scope.store.init)
                }
            },
            function () {
                console.log('error')
                $scope.store.loading = false

                execError('查询门店信息失败', $scope.store.init)
            }
        )
    }
    $scope.store.select = function (store) {
        if(store.StoreID != $rootScope.appointment.store.StoreID){

            $rootScope.appointment.store = null
            $rootScope.appointment.service = null
            $rootScope.appointment.time = null

            $scope.appointment.update(store)

            $scope.store.modalVisible = false


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
    $rootScope.appointment.category || ($rootScope.appointment.category = $scope.category.items[1])
    $scope.category.order($rootScope.appointment.category)


    $scope.appointment.loading = false
    $scope.appointment.submitVisible = false
    $scope.appointment.init = function () {
        $scope.appointment.loading = true
        //default appointment
        cooGlobal.resource(cooGlobal.api.appointment_default).query(
            {
                'Token': params.Token,
                'lng': params.lng,
                'lat': params.lat,
                'StoreWXID': params.StoreID,
                'AppointmentType': $rootScope.appointment.category.value
            },
            function (res) {
                $scope.appointment.loading = false
                if(res.ResCode == 0){
                    $rootScope.appointment.car = $rootScope.appointment.car || res.ResData.DefaultCar
                    $scope.appointment.update(res.ResData.StoreItem)
                }else {
                    execError('查询预约信息失败', $scope.appointment.init, true)
                }
            },
            function () {
                console.log('error')
                $scope.appointment.loading = false
                execError('查询预约信息失败', $scope.appointment.init, true)
            }
        )
    }
    $scope.appointment.update = function (store) {

        $rootScope.appointment.store = $rootScope.appointment.store || store
        $rootScope.appointment.service = $rootScope.appointment.service || store.StoreWorkPlace[0]

        $scope.time.quickItems = []

        for (var i = 0; i < $rootScope.appointment.service.TypeWorkPlaces.length; i++) {
            var time = $rootScope.appointment.service.TypeWorkPlaces[i]
            if (time.IsUsed == 0)
                $scope.time.quickItems.push(time)

            if ($scope.time.quickItems.length == 4)
                break;
        }

        $rootScope.appointment.time =  $rootScope.appointment.time || $scope.time.quickItems[0]

        $scope.time.items = [[], [], []]
        angular.forEach(store.StoreWorkPlace[0].TypeWorkPlaces, function (value) {
            var index = new Date(value.AccurateStartTime.replace(/-/g, "/")).dateDiff(new Date(), 'd')
            if (index >= 0 && index <= 2)
                $scope.time.items[index].push(value)
        })
    }

    $scope.appointment.toSubmit = function () {

        if( $rootScope.appointment.car == null) {
            execError('尚未添加预约车辆', angular.noop, true)
            return
        }

        if( $rootScope.appointment.store == null) {
            execError('暂时没有提供 '+$rootScope.appointment.category.value +' 服务的门店', angular.noop, true)
            return
        }


        $scope.appointment.submitVisible = true



    }
    $scope.appointment.submit = function () {

        var saveParams = {
            "Source": "wechat",
            "Token": params.Token,
            "StoreID": $rootScope.appointment.store.StoreID,
            "CarNum": $rootScope.appointment.car.CarNum,
            "CarGuid": $rootScope.appointment.car.CarGuid,
            "AppointmentType": $rootScope.appointment.service.name,
            "AccurateStartTime": $rootScope.appointment.time.AccurateStartTime,
            "AppointmentSource": "wechat(iphone)"
        }

        $scope.loaderVisible = true


        cooGlobal.resource(cooGlobal.api.appointment_save).save(
            saveParams,
            function (res) {
                if(res.ResCode == 0){
                    $location.path('/appointment/complete')
                }else{
                    execError('预约失败', $scope.appointment.submit,true)
                }

                $scope.loaderVisible = false
            },
            function () {
                $scope.loaderVisible = false
                console.log('error')
                execError('预约失败', $scope.appointment.submit, true)
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


}])