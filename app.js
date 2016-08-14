'use strict'

angular.module('coo',[
    'ngRoute',
    'coo.global',
    'coo.components.modal',
    'coo.modules.index',
    'coo.modules.default-setting'
])

.config(['$locationProvider','$routeProvider',function ($locationProvider,$routeProvider) {
    $locationProvider.hashPrefix('!')


    $routeProvider
        .when('/index', {
            templateUrl: 'modules/index/index.html',
            controller: 'indexCtrl'
        })
        .when('/defaultSetting', {
            templateUrl: 'modules/default-setting/index.html',
            controller: 'defaultSettingCtrl'
        })
        .when('/test',{
            templateUrl: 'testData/customerAndCarsInfo.json',
        })
        .otherwise({redirectTo: '/index'})

}])