'use strict'

angular.module('coo.modules.appointment.preference',[
    'coo.global'

])

.controller('appointmentPreferenceCtrl',['$scope','$location','cooGlobal',function ($scope,$location,cooGlobal) {
    /*path*/
    $scope.path = function (path) {
        $location.path(path)
    }

    $scope.loaderVisible = false
    $scope.cars = []
    $scope.stores = []

    $scope.init = function () {
        $scope.loaderVisible = true
        cooGlobal.resource(cooGlobal.api.preference_query).query(
            //用户习惯
            //{
            //  'Token': '5354bcf5-1351-47b8-be4b-7df254474c58'
            //  'StoreWXID':''
            //}
            {r: Math.random()},
            function (res) {
                $scope.cars = res.ResData.PreferenceCar
                $scope.stores = res.ResData.PreferenceStore
                $scope.loaderVisible = false

            },
            function () {
                console.log('error')
                $scope.loaderVisible = false
            }
        )

    }

    //category   PreferenceCar,PreferenceStore
    $scope.save = function (category,info) {
        $scope.loaderVisible = true
        cooGlobal.resource(cooGlobal.api.preference_save).save(
            //用户习惯提交
            //{
            //  'Token': '5354bcf5-1351-47b8-be4b-7df254474c58'
            //  'StoreWXID':'',
            //  'Category':'',// Car Store
            //  'Type':'' // ID , 'Last' ,'Nearest','Constantly'
            //}
            {
                'Token': '5354bcf5-1351-47b8-be4b-7df254474c58',
                'StoreWXID':'',
                "Category": category,
                "Type": info.Type,
                "Tag": info.Tag
            },
            function (res) {
                $scope.loaderVisible = false
                if(res.ResCode == 0) {
                    if(category == 'PreferenceCar'){
                        angular.forEach($scope.cars,function (car) {
                            car.IsDefault = car.Type == info.Type && car.Tag == info.Tag
                        })
                    }
                    if(category == 'PreferenceStore') {
                        angular.forEach($scope.stores, function (store) {
                            store.IsDefault = store.Type == info.Type && store.Tag == info.Tag
                        })
                    }
                }else{

                }
            },
            function () {
                console.log('error')
                $scope.loaderVisible = false
            }
        )
    }

    $scope.init()
}])