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
    'coo.modules.membership'
])

.config(['$locationProvider','$routeProvider',function ($locationProvider,$routeProvider) {
    $locationProvider.hashPrefix('!')


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
        .otherwise({redirectTo: '/appointment'})

}])
