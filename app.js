'use strict'

angular.module('coo',[
    'ngRoute',
    'coo.reservation'
])

.config(['$locationProvider','$routeProvider',function ($locationProvider,$routeProvider) {
    $locationProvider.hashPrefix('!')
    $routeProvider.otherwise({redirectTo: '/index'})
}])