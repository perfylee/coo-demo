'use strict'

angular.module('coo.reservation',[
    'ngRoute'
])

.config(['$routeProvider',function ($routeProvider) {
    $routeProvider.when('/index', {
        templateUrl: 'modules/index/index.html',
        controller: 'indexCtrl'
    })

}])

.controller('indexCtrl',['$scope',function ($scope) {


    var confirmModal = angular.element(document.querySelector('.confirmModal'))
    confirmModal.modal({
        closable:false,
        //inverted:false,
        //blurring: true,
        //transition:'fly up',
        transition:'fly down',
        queue:true,
        selector:{
            close:'.buttons .ui.button.close'
        },
        onDeny    : function(){
            //window.alert('Wait not yet!')
        },
        onApprove : function() {
            //$location.path('/login')
        }
    })

    var carModal = angular.element(document.querySelector('.carModal'))
    carModal.modal({
        closable:false,
        //inverted:false,
        //blurring: true,
        //transition:'fly up',
        transition:'fly up',
        queue:true,
        selector:{
            close:'.buttons .ui.button.close'
        }
    })

    $scope.confirmOrder = function () {
        confirmModal.modal('show')
    }

    $scope.selectCar = function () {
        carModal.modal('show')
        carModal.css({top:null,bottom:0})
    }

}])