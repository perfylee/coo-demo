'use strict'


angular.module('coo.modules.appointment.orders',[
    'coo.global',
    'coo.components.modal',
    'coo.components.loader'
])


.controller('appointmentOrdersCtrl',['$rootScope','$scope','$location','cooGlobal',function ($rootScope,$scope,$location,cooGlobal) {

    $scope.path = function (path) {
        $location.path(path)
    }

    $scope.loaderVisible = false
    $scope.categories = {
        '': {label: '全部', color: ''},
        '未完成': {label: '待完成', color: 'orange'},
        '已完成': {label: '已完成', color: 'green'},
        '已取消': {label: '已取消', color: 'gray'},
        '已失约': {label: '已失约', color: 'red'}
    }


    $scope.category = ''

    $scope.orders = []

    $scope.hasOrders = function () {
        if($scope.category == '')
            return $scope.orders.length > 0

        var cnt = 0
        angular.forEach($scope.orders,function (month) {
            angular.forEach(month.Appointments,function (order) {
                if(order.Status == $scope.category)
                    cnt ++
            })
        })

        return cnt > 0

    }

    $scope.categorySelect = function (category) {
        $scope.category = category
    }

    $scope.init = function () {
        $scope.loaderVisible = true
        cooGlobal.resource(cooGlobal.api.orders_query).query(
            {r:Math.random()},
            function (res) {
                $scope.orders = res.ResData
                $scope.loaderVisible = false
            },
            function () {
                console.log('error')
            }
        )
    }

    $scope.goBack = function () {
        $location.path('/appointment')
    }

    $scope.init()

}])