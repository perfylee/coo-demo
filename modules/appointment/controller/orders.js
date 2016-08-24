'use strict'


angular.module('coo.modules.appointment.orders',[
    'ngRoute',
    'coo.global',
    'coo.components.modal',
    'coo.components.loader'
])


.controller('appointmentOrdersCtrl',['$rootScope','$scope','$location','$route','$window','cooGlobal',function ($rootScope,$scope,$location,$route,$window,cooGlobal) {

    var params = $route.current.params

    $scope.path = function (path) {
        $location.path(path)
    }

    $scope.loaderVisible = false
    $scope.isLoaded = false
    $scope.errorModalVisible = false

    $scope.categories = [
        {name:'',label: '全部', color: ''},
        {name:'未完成',label: '待完成', color: 'blue'},
        {name:'已完成',label: '已完成', color: 'green'},
        {name:'已取消',label: '已取消', color: 'gray'},
        {name:'已失约',label: '已失约', color: 'red'}
    ]

    $scope.categoryLabels = []
    angular.forEach($scope.categories,function (value) {
        $scope.categoryLabels.push(value.name)
    })


    $scope.category = 0
    $scope.orders = []

    $scope.categorySelect = function (category) {
        $scope.category = category
        $scope.init()
    }

    $scope.init = function () {
        $scope.loaderVisible = true
        $scope.errorModalVisible = false
        cooGlobal.resource(cooGlobal.api.orders_query).query(
            //预约纪录
            //{
            //  "Token":"5354bcf5-1351-47b8-be4b-7df254474c58",
            //  "PageNum":"1",
            //  "PageSize":"10",
            //  "Condition":"0"
            //}
            //Condition
            //0 - 全部
            //1 - 未完成
            //2 - 已完成
            //3 - 已取消
            //4 - 已失约
            {
                "Token":params.token,
                "PageNum":"1",
                "PageSize":"100",
                "Condition":$scope.category
            },
            function (res) {
                $scope.loaderVisible = false
                if(res.ResCode == 0) {
                    $scope.orders = angular.isArray(res.ResData)?res.ResData:[]
                }else {
                    $scope.errorModalVisible = true
                }

                $scope.isLoaded = true
            },
            function () {
                console.log('error')
                $scope.loaderVisible = false
                $scope.errorModalVisible = true
            }
        )
    }

    $scope.cancelAppointment = null
    $scope.cancelModalVisible = false
    $scope.toCancel = function (appointment) {
        $scope.cancelAppointment = appointment
        $scope.cancelModalVisible = true
    }

    $scope.cancel = function () {
        $scope.cancelModalVisible = false
        $scope.loaderVisible = true
        cooGlobal.resource(cooGlobal.api.order_cancel).save(
            {
                "Source":"wechart",
                "Token":params.token,
                "StoreID":$scope.cancelAppointment.StoreID,
                "AppointmentID":$scope.cancelAppointment.AppointmentID,
            },
            function (res) {
                $scope.loaderVisible = false
                if(res.ResCode == 0)
                    $scope.init()
            },
            function () {
                $scope.loaderVisible = false
            }
        )
    }

    $scope.detail = function (appointment) {
        if (appointment.Status == '未完成')
            return

        $window.location.href = cooGlobal.modules.appointmentDetail + '?token=' + params.token + '&StoreID=' + appointment.StoreID + '&ReservationID=' + appointment.AppointmentID
    }

    $scope.init()

}])