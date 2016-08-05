'use strict'

angular.module('coo.reservation',[
    'ngRoute'
])

.config(['$routeProvider',function ($routeProvider) {
    $routeProvider.when('/reservation', {
        templateUrl: 'modules/reservation/index.html',
        controller: 'reservationCtrl'
    })

}])

.controller('reservationCtrl',['$scope',function ($scope) {

}])