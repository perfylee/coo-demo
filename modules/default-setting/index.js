'use strict'

angular.module('coo.modules.default-setting',[
    'ngRoute'
])

.controller('defaultSettingCtrl',['$scope',function ($scope) {

    $scope.cars = [
        {type: 0, name: '皖APF630', sub: '大众迈腾', default: true},
        {type: 0, name: '皖APF631', sub: '布加迪威龙', default: false},
        {type: 3, name: '上次选择的车辆', sub: '皖APF630', default: false}
    ]

    $scope.shops = [
        {type: 0, name: '最常去门店', sub: '速途驰加中铁国际城店', default: true},
        {type: 1, name: '距离最近门店', sub: '合肥徽派汽修服务中心', default: false},
        {type: 2, name: '指定的门店', sub: '速途驰加中铁国际城店', default: false},
        {type: 3, name: '上次选择的门店', sub: '速途驰加中铁国际城店', default: false}
    ]

}])