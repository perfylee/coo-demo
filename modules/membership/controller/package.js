'use strict'


angular.module('coo.modules.membership.package',[
    'coo.global',
    'coo.components.loader',
    'coo.components.price',
    'coo.components.rating'
])


.controller('membershipPackageCtrl',['$rootScope','$scope','$location','cooGlobal',function ($rootScope,$scope,$location,cooGlobal) {

    $scope.path = function (path) {
        $location.path(path)
    }

    $scope.loaderVisible = false
    $scope.packages = []
    $scope.init = function () {
        $scope.loaderVisible = true

        cooGlobal.resource(cooGlobal.api.membership_package_query).query(
            {},
            function (res) {
                $scope.loaderVisible = false
                $scope.packages = res.ResData
            },
            function () {
                $scope.loaderVisible = false
            }
        )
    }

}])