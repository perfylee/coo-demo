'use strict'


angular.module('coo.modules.appointment.complete',[
    'coo.global',
    'coo.components.modal',
    'coo.components.loader'
])


.controller('appointmentCompleteCtrl',['$rootScope','$scope','$location',function ($rootScope,$scope,$location) {
    $scope.path = function (path) {
        $location.path(path)
    }

    if($rootScope.appointment == null || $rootScope.appointment.store == null){
        $location.path('/appointment')
        return
    }


    $scope.store = $rootScope.appointment.store
    $scope.service = $rootScope.appointment.service
    $scope.time = $rootScope.appointment.time


    $rootScope.appointment.store = null
    $rootScope.appointment.service = null
    $rootScope.appointment.time = null

    $scope.goBack = function () {
        $location.path('/appointment')
    }

}])