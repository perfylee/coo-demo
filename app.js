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
    'coo.modules.store.list',
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
        .when('/appointment/order/:id/:storeId', {
            templateUrl: 'modules/appointment/view/order.html',
            controller: 'appointmentOrderCtrl'
        })
        .when('/store/:id', {
            templateUrl: 'modules/store/view/index.html',
            controller: 'storeCtrl' //index.js
        })
        .when('/stores', {
            templateUrl: 'modules/store/view/list.html',
            controller: 'storesCtrl' //list.js
        })
        .when('/membership', {
            templateUrl: 'modules/membership/view/index.html',
            controller: 'membershipCtrl' //index.js
        })
        .when('/membership/package', {
            templateUrl: 'modules/membership/view/package.html',
            controller: 'membershipPackageCtrl'
        })
        .when('/membership/paycode', {
            templateUrl: 'modules/membership/view/paycode.html',
            controller: 'membershipPaycodeCtrl'
        })
        // .when('/index', {
        //     template: '',
        //     controller: 'indexCtrl'
        // })
        // .otherwise('/index')

}])
// .controller('indexCtrl',['$location',function ($location) {
//     $location.path('/appointment').search({
//         "token":"49cba881-8550-4605-85e5-746bbed01d84",
//         "lnt":"117.217307",
//         "lat":"31.845957",
//         "StoreWXID":"wxe6cfa3fe641f170e",
//         "WXID":"o0-lIxIKeluec1TSogIRZB9FThiE"
//     })
// }])


