'use strict'

angular.module('coo.modules.index',[
    'coo.global',
    'coo.components.modal'
])

.controller('indexCtrl',['$rootScope','$scope','cooGlobal',function ($rootScope,$scope,cooGlobal) {

    /*wx params*/
    $scope.wxParams = {
        Token: '60781269-278c-40ba-9554-fcde75bc2707',
        WXID: '123456',
        lng: '117.217307',
        lat: '31.845957'
    }



    /*top*/
    $scope.top = {}
    $scope.top.day =  new Date().getDate() < 10 ?'0':''+ new Date().getDate()
    $scope.top.month = cooGlobal.enMonth[new Date().getMonth()]
    $scope.top.slogan = '生活不是只有诗和远方，还有洗车'

    /*top end*/


    /*category*/
    $scope.category = {}
    $scope.category.items = [
        {name:'保养',en:'Maintenance',sort:0},
        {name:'洗车',en:'Vehicle Cleaning',sort:1},
        {name:'维修',en:'Maintenance',sort:2}
    ]
    $scope.category.select = function (item) {

        if(item.sort == 1)
            return

        var currIndex = $scope.category.items.indexOf(item)
        var prevIndex = (index - 1 < 0) ? 2 : (index - 1)
        var nextIndex = (index + 1 > 2) ? 0 : (index + 1)

        $scope.category.items[prevIndex].sort = 0
        $scope.category.items[currIndex].sort = 1
        $scope.category.items[nextIndex].sort = 2

        $scope.appointment.category = item

    }

    /*category end*/




    /*car*/
    $scope.car = {}
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


    $scope.car.query = function () {

    }


    /*store*/
    $scope.store = {}
    $scope.store.items = []
    $scope.store.modalVisible = false

    /*time*/
    $scope.time = {}
    $scope.time.items = []
    $scope.time.modalVisible = false


    /*appointment*/
    $rootScope.appointment || ($rootScope.appointment = {
        category: null,
        car: null,
        store: null,
        service: null,
        time: null
    })


    $rootScope.appointment.category || ($rootScope.appointment.category = $scope.category.items[1])


    $scope.init = function () {

        //customer cars
        cooGlobal.resource(cooGlobal.api.customerAndCarsInfo).query(
            $scope.wxParams,
            function (res) {
                $scope.car.items = res.ResData.Cars
            },
            function () {
                console.log('error')
            }
        )

        //default appointment
        cooGlobal.resource(cooGlobal.api.defaultAppointment).query(
            angular.extend($scope.wxParams, {AppointmentType: $rootScope.appointment.category.name}),
            function (res) {
                $rootScope.appointment.car = $rootScope.appointment.car || res.ResData.DefaultCar
                $rootScope.appointment.store = $rootScope.appointment.store || res.ResData.StoreItem

            },
            function () {
                console.log('error')
            }
        )
    }


    $scope.init()


}])