'use strict'

angular.module('coo.modules.appointment',[
    'coo.global',
    'coo.components.modal',
    'coo.components.loader'
])

.controller('appointmentCtrl',['$rootScope','$scope','$location','cooGlobal',function ($rootScope,$scope,$location,cooGlobal) {

    $scope.title = '预约洗车'

    /*wx params*/
    $scope.wxParams = {
        Token: '60781269-278c-40ba-9554-fcde75bc2707',
        WXID: '123456',
        lng: '117.217307',
        lat: '31.845957'
    }

    /*path*/
    $scope.path = function (path) {
        $location.path(path)
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

        $scope.loaderVisible = true
        $scope.user.loading = true

        //customer cars
        cooGlobal.resource(cooGlobal.api.user_query).query(
            //QUERY PARAMS
            //{
            //  'Token': '5354bcf5-1351-47b8-be4b-7df254474c58',
            //  'StoreWXID':''
            //}
            $scope.wxParams,
            function (res) {
                $scope.car.items = res.ResData.Cars
                $scope.user = res.ResData.Customer

                $scope.user.loading = false
                $scope.updateLoading()
            },
            function () {
                console.log('error')
                $scope.user.loading = false
                $scope.updateLoading()
            }
        )
    }



    /*store*/

    $scope.store = {}
    $scope.store.loading = false
    $scope.store.items = []
    $scope.store.modalVisible = false
    $scope.store.tabIndex = 'listView' //listView mapView
    $scope.store.init = function () {
        $scope.loaderVisible = true
        $scope.store.loading = true

        //customer cars
        cooGlobal.resource(cooGlobal.api.stores_query).query(
            //根据服务类型获取门店列表含服务
            //{
            //  "Token":"40917313-2112-492a-ae5a-560328a26670",
            //  "lng":"117.217307",
            //  "lat":"31.845957",
            //  "StoreWXID":"test_shangchenghuayuan",
            //  "AppointmentType","洗车"
            //}
            angular.extend($scope.wxParams, {AppointmentType: $rootScope.appointment.category.value}),
            function (res) {
                $scope.store.items = res.ResData
                $scope.store.mapStore = res.ResData[0]
                $scope.store.mapStoreIndex = 0

                $scope.store.loading = false
                $scope.updateLoading()

            },
            function () {
                console.log('error')

                $scope.store.loading = false
                $scope.updateLoading()
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
        $scope.loaderVisible = true
        $scope.appointment.loading = true

        //default appointment
        cooGlobal.resource(cooGlobal.api.appointment_default).query(
            // QUERY PARAMS
            // {
            //     'Token': '5354bcf5-1351-47b8-be4b-7df254474c58',
            //     'StoreWXID':'',
            //     'lng': '117.217307',
            //     'lat': '31.845957',
            //     'AppointmentType': '洗车'
            // }
            angular.extend($scope.wxParams, {AppointmentType: $rootScope.appointment.category.value}),
            function (res) {
                $rootScope.appointment.car = $rootScope.appointment.car || res.ResData.DefaultCar
                $scope.appointment.update(res.ResData.StoreItem)
                $scope.appointment.loading = false
                $scope.updateLoading()
            },
            function () {
                console.log('error')
                // var reRequest = setTimeout(function () {
                //     clearTimeout(reRequest)
                //     $scope.appointment.init()
                // },5000)

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
    $scope.appointment.submit = function () {

        //POST PARAMS
        //{
        //  "Source": "wechat",
        //  "Token": "5354bcf5-1351-47b8-be4b-7df254474c58",
        //  "StoreID": "23b21f20-1cd3-4ac3-adae-8119ebdeeead",
        //  "CarNum": "皖A23333",
        //  "CarGuid": "4b563df8-c4f1-4312-a898-04eed474618d",
        //  "AppointmentType": "普洗",//服务小类
        //  "AccurateStartTime": "2016-08-15 21:20:00",
        //  "AppointmentSource": "wechat(iphone)"
        //}

        var params = {
            "Source": "wechat",
            "Token": $scope.wxParams.Token,
            "StoreID": $rootScope.appointment.store.StoreID,
            "CarNum": $rootScope.appointment.car.CarNum,
            "CarGuid": $rootScope.appointment.car.CarGuid,
            "AppointmentType": $rootScope.appointment.service.name,
            "AccurateStartTime": $rootScope.appointment.time.AccurateStartTime,
            "AppointmentSource": "wechat(iphone)"
        }


        $scope.loaderVisible = true
        cooGlobal.resource(cooGlobal.api.appointment_save).save(
            params,
            function (res) {
                if(res.ResCode == 0){
                    $location.path('/appointment/complete')
                }else{

                }

                $scope.loaderVisible = false
            },
            function () {
                $scope.loaderVisible = false
                console.log('error')
            }
        )



        $scope.appointment.submitVisible = false
        $scope.loaderVisible = true

    }



    //init
    $scope.user.init()
    $scope.store.init()
    $scope.appointment.init()


}])