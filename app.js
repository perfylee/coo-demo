'use strict'

angular.module('coo',[
    'ngRoute',
    'coo.components.modal',
    'coo.modules.index'
])

.config(['$locationProvider','$routeProvider',function ($locationProvider,$routeProvider) {
    $locationProvider.hashPrefix('!')
    $routeProvider.otherwise({redirectTo: '/index'})
}])