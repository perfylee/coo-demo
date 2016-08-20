'use strict'


angular.module('coo.modules.membership',[
    'coo.global',
    'coo.components.loader',
    'coo.components.price',
    'coo.components.rating'
])


.controller('membershipCtrl',['$rootScope','$scope','$location','cooGlobal',function ($rootScope,$scope,$location,cooGlobal) {

    $scope.path = function (url) {
        $location.path(url)
    }
    $scope.packageModalVisible = false
    $scope.loaderVisible = false

    $rootScope.packageToPay = ($rootScope.packageToPay || null)



    $scope.membership = {}
    $scope.membership.loading = false
    $scope.membership.init = function () {
        $scope.membership.loading = true
        cooGlobal.resource(cooGlobal.api.membership_query).query(
            {
                "Token":"40917313-2112-492a-ae5a-560328a26670",
                "StoreWXID":"gh_3c6b16d565a2"
            },
            function (res) {
                $scope.membership.loading = false
                $scope.membership.obj = res.ResData[0]
            },
            function () {
                $scope.membership.loading = false
                console.log('error')
            }
        )
    }

    $scope.package = {}
    $scope.package.loading = false
    $scope.package.items = []
    $scope.package.init = function () {
        $scope.package.loading = true
        cooGlobal.resource(cooGlobal.api.membership_package_query).query(
            {
                "Token":"40917313-2112-492a-ae5a-560328a26670",
                "StoreWXID":"gh_3c6b16d565a2"
            },
            function (res) {
                $scope.package.loading = false
                $scope.package.items = res.ResData
                $rootScope.packageToPay = $rootScope.packageToPay || ( $scope.package.items && $scope.package.items.length > 0 ? $scope.package.items[0] : null)
            },
            function () {
                $scope.package.loading = false
                console.log('error')
            }
        )
    }
    $scope.package.select = function (item) {
        $rootScope.packageToPay = item
        $scope.packageModalVisible = false
    }


    $scope.$watch('membership.loading',function () {
        $scope.loaderVisible = $scope.membership.loading || $scope.package.loading
    })

    $scope.$watch('package.loading',function () {
        $scope.loaderVisible = $scope.membership.loading || $scope.package.loading
    })


    $scope.membership.init()
    $scope.package.init()

}])