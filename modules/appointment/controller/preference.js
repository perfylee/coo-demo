'use strict'

angular.module('coo.modules.appointment.preference',[
    'ngRoute',
    'coo.global'

])

.controller('appointmentPreferenceCtrl',['$scope','$location','$route','cooGlobal',function ($scope,$location,$route,cooGlobal) {


    $scope.params = $route.current.params


    /*path*/
    $scope.path = function (path) {
        $location.path(path).search({
            'token': $scope.params.token,
            'lnt': $scope.params.lnt,
            'lat': $scope.params.lat,
            'StoreWXID': $scope.params.StoreWXID,
            'WXID': $scope.params.WXID
        })
    }

    $scope.loaderVisible = false
    $scope.cars = []
    $scope.stores = []

    $scope.init = function () {
        $scope.loaderVisible = true
        cooGlobal.resource(cooGlobal.api.preference_query).query(
            {
                'Token': $scope.params.token,
                'StoreWXID': $scope.params.StoreWXID,
                'lng': $scope.params.lnt,
                'lat': $scope.params.lat
            },
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

        var types = {
            'Car': [info.Tag, '', '', 'Last'],
            'Store': [info.Tag, 'Constantly', 'Nearest', 'Last']
        }

        cooGlobal.resource(cooGlobal.api.preference_save).save(
            //用户习惯提交
            //{
            //  'Token': '5354bcf5-1351-47b8-be4b-7df254474c58'
            //  'StoreWXID':'',
            //  'Category':'',// Car Store
            //  'Type':'' // ID , 'Last' ,'Nearest','Constantly'
            //}
            {
                'Token': $scope.params.token,
                'StoreWXID': $scope.params.StoreWXID,
                "Category": category,
                "Type": types[category][info.Type]
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

                    $scope.init()
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