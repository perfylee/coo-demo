'use strict'

angular.module('coo',[
    'ngRoute',
    'coo.global',
    'coo.components.modal',
    'coo.components.loader',

    'coo.modules.index',
    'coo.modules.index.complete',
    'coo.modules.default-setting'
])

.config(['$locationProvider','$routeProvider',function ($locationProvider,$routeProvider) {
    $locationProvider.hashPrefix('!')


    $routeProvider
        .when('/index', {
            templateUrl: 'modules/index/index.html',
            controller: 'indexCtrl'
        })
        .when('/index/setting', {
            templateUrl: 'modules/default-setting/index.html',
            controller: 'defaultSettingCtrl'
        })
        .when('/index/complete', {
            templateUrl: 'modules/index/complete.html',
            controller: 'completeCtrl'
        })
        .otherwise({redirectTo: '/index'})

}])