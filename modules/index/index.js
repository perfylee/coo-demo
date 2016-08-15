'use strict'

angular.module('coo.modules.index',[
    'coo.global',
    'coo.components.modal',
    'coo.components.loader'
])

.controller('indexCtrl',['$rootScope','$scope','$location','cooGlobal',function ($rootScope,$scope,$location,cooGlobal) {

    /*wx params*/
    $scope.wxParams = {
        Token: '60781269-278c-40ba-9554-fcde75bc2707',
        WXID: '123456',
        lng: '117.217307',
        lat: '31.845957'
    }


    /*loader*/
    $scope.loaderVisible = false
    $scope.updateLoading = function () {
        if($scope.car.loading == false && $scope.store.loading == false && $scope.appointment.loading == false) {
            $scope.loaderVisible = false
        }
    }


    /*user*/
    $scope.user = null




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



    /*car*/
    $scope.car = {}
    $scope.car.loading = false
    $scope.car.items = [
        // {
        //     "CarGuid": "312d34cb-b880-4db3-baf9-15afb0e0c12e",
        //     "CustomerGuid": "0b24f435-bd77-4ba2-afaf-90a856f169f0",
        //     "CarNum": "皖G55555",
        //     "CarBrand": "五菱汽车",
        //     "CarModel": "五菱宏光",
        //     "BrandImage": "http://file.cheoo.net/CarBrand/WuLingQiChe.jpg"
        // },
        // {
        //     "CarGuid": "22106a86-f101-4e82-bbb3-5f367f4d4f97",
        //     "CustomerGuid": "0b24f435-bd77-4ba2-afaf-90a856f169f0",
        //     "CarNum": "皖A23333",
        //     "CarBrand": "本田",
        //     "CarModel": "思域(海外)",
        //     "BrandImage": "http://file.cheoo.net/CarBrand/BenTian.jpg"
        // }
    ]
    $scope.car.modalVisible = false
    $scope.car.select = function (item) {
        if(item.CarGuid != $rootScope.appointment.car.CarGuid) {
            $rootScope.appointment.car = item
            $scope.car.modalVisible = false
        }
    }
    $scope.car.init = function () {

        $scope.loaderVisible = true
        $scope.car.loading = true

        //customer cars
        cooGlobal.resource(cooGlobal.api.customerAndCarsInfo).query(
            $scope.wxParams,
            function (res) {
                $scope.car.items = res.ResData.Cars
                $scope.user = res.ResData.Customer

                $scope.car.loading = false
                $scope.updateLoading()
            },
            function () {
                console.log('error')

                $scope.car.loading = false
                $scope.updateLoading()
            }
        )
    }



    /*store*/
    $scope.store = {}
    $scope.store.loading = false
    $scope.store.items = []
    $scope.store.modalVisible = false
    $scope.store.tabIndex = 'listView'
    $scope.store.init = function () {
        $scope.loaderVisible = true
        $scope.store.loading = true

        //customer cars
        cooGlobal.resource(cooGlobal.api.stores).query(
            angular.extend($scope.wxParams, {AppointmentType: $rootScope.appointment.category.value}),
            function (res) {
                $scope.store.items = res.ResData

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
        cooGlobal.resource(cooGlobal.api.defaultAppointment).query(
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

        var service, times
        angular.forEach(store.TypeWorkPlaces, function (value, name) {
            service = {name: name, price: null}
            times = value
        })

        $rootScope.appointment.store = $rootScope.appointment.store || store
        $rootScope.appointment.service = service

        $scope.time.quickItems = []

        for (var i = 0; i < times.length; i++) {
            if (times[i].IsUsed == 0)
                $scope.time.quickItems.push(times[i])

            if ($scope.time.quickItems.length == 4)
                break;

        }

        $rootScope.appointment.time =  $rootScope.appointment.time || $scope.time.quickItems[0]

        $scope.time.items = [[], [], []]
        angular.forEach(times, function (value) {
            var index = new Date(value.AccurateStartTime.replace(/-/g, "/")).dateDiff(new Date(), 'd')
            $scope.time.items[index].push(value)
        })
    }
    $scope.appointment.submit = function () {

        var params = {
            "Source":"wechat",
            "Token":$scope.wxParams.Token,
            "StoreID":$rootScope.appointment.store.StoreID,
            "CarNum":$rootScope.appointment.car.CarNum,
            "CarGuid":$rootScope.appointment.car.CarGuid,
            "AppointmentType":$rootScope.appointment.service.name,
            "AccurateStartTime":$rootScope.appointment.time.AccurateStartTime,
            "AppointmentSource":"wechat(iphone)"
        }


        $scope.loaderVisible = true
        cooGlobal.resource(cooGlobal.api.appointment).save(
            params,
            function (res) {
                if(res.ResCode == 0){
                    $location.path('/index/complete')
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
    $scope.car.init()
    $scope.store.init()
    $scope.appointment.init()



}])