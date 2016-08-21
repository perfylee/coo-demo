'use strict'

angular.module('coo',[
    'ngRoute',
    'coo.global',
    'coo.components.modal',
    'coo.components.loader',
    'coo.components.price',
    'coo.components.rating',

    'coo.modules.appointment',
    'coo.modules.appointment.complete',
    'coo.modules.appointment.preference',
    'coo.modules.appointment.orders',
    'coo.modules.store',
    'coo.modules.membership',
    'coo.modules.membership.package'
])

.config(['$locationProvider','$routeProvider',function ($location,$routeProvider) {
    $location.hashPrefix('!')


    $routeProvider
        .when('/appointment', {
            templateUrl: 'modules/appointment/view/index.html',
            controller: 'appointmentCtrl' //index.js
        })
        .when('/appointment/preference', {
            templateUrl: 'modules/appointment/view/preference.html',
            controller: 'appointmentPreferenceCtrl'
        })
        .when('/appointment/complete', {
            templateUrl: 'modules/appointment/view/complete.html',
            controller: 'appointmentCompleteCtrl'
        })
        .when('/appointment/orders', {
            templateUrl: 'modules/appointment/view/orders.html',
            controller: 'appointmentOrdersCtrl'
        })
        .when('/store/:id', {
            templateUrl: 'modules/store/view/index.html',
            controller: 'storeCtrl' //index.js
        })
        .when('/membership', {
            templateUrl: 'modules/membership/view/index.html',
            controller: 'membershipCtrl' //index.js
        })
        .when('/membership/package', {
            templateUrl: 'modules/membership/view/package.html',
            controller: 'membershipPackageCtrl'
        })
        .when('/index', {
            template:'',
            controller: 'indexCtrl'
        })
        .otherwise('/index')

}])
.controller('indexCtrl',['$location',function ($location) {
    $location.path('/appointment').search({
        "Token":"40917313-2112-492a-ae5a-560328a26670",
        "lng":"117.217307",
        "lat":"31.845957",
        "StoreWXID":"test_shangchenghuayuan",
        "WXID":""
    })
}])
