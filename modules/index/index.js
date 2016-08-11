'use strict'

angular.module('coo.modules.index',[
    'ngRoute',
    'coo.components.modal'
])

.config(['$routeProvider',function ($routeProvider) {
    $routeProvider.when('/index', {
        templateUrl: 'modules/index/index.html',
        controller: 'indexCtrl'
    })

}])

.controller('indexCtrl',['$scope',function ($scope) {
    $scope.Date = function (date) {
        return new Date(date)
    }
    $scope.FormatTimeLabel = function (label) {
        return label.replace('今天','').replace('点','')
    }

    //当前选项
    $scope.current = {
        service:null,
        car: null,
        time: null,
        shop: null
    }

    //选择服务
    $scope.services = [
        {id:1,name:'保养',en:'Maintenance',sort:0},
        {id:2,name:'洗车',en:'Vehicle Cleaning',sort:1},
        {id:3,name:'维修',en:'Maintenance',sort:2}
    ]
    
    $scope.selectService = function (service) {
        if ($scope.current.service != null && service.id == $scope.current.service.id)
            return

        $scope.current.service = service

        if (service.id == 1) {
            $scope.services[0].sort = 1
            $scope.services[1].sort = 2
            $scope.services[2].sort = 0
        } else if (service.id == 2) {
            $scope.services[0].sort = 0
            $scope.services[1].sort = 1
            $scope.services[2].sort = 2
        } else if (service.id == 3) {
            $scope.services[0].sort = 2
            $scope.services[1].sort = 0
            $scope.services[2].sort = 1
        }
    }

    //选择车辆
    $scope.cars = [
        {id:'1',pn:'皖APF630',model:'大众迈腾'},
        {id:'2',pn:'皖APF631',model:'布加迪威龙'}
    ]
    $scope.current.car = $scope.cars[0]

    $scope.isShowSelectCar = false

    $scope.toggleSelectCar = function () {
        $scope.isShowSelectCar = !$scope.isShowSelectCar
    }

    $scope.selectCar = function (car) {
        if (car.id != $scope.current.car.id) {
            $scope.current.car = car
            $scope.isShowSelectCar = false
        }
    }

    $scope.activeCarCls = function (car) {
        return ($scope.current.car != null && $scope.current.car.id == car.id) ? "active" : ""
    }

    //选择时间
    $scope.times = [
        //today
        [
            {id: 1, time:'2016/08/10 15:00', label:'今天15:00点', status: 1},
            {id: 2, time:'2016/08/10 16:00', label:'今天16:00点', status: 1},
            {id: 3, time:'2016/08/10 17:00', label:'今天17:00点', status: 0},
            {id: 4, time:'2016/08/10 18:00', label:'今天18:00点', status: 1}
        ],
        //tomorrow
        [
            {id: 5,  time:'2016/08/11 09:00', label:'明天09:00点', status: 1},
            {id: 6,  time:'2016/08/11 10:00', label:'明天10:00点', status: 1},
            {id: 7,  time:'2016/08/11 11:00', label:'明天11:00点', status: 0},
            {id: 8,  time:'2016/08/11 12:00', label:'明天12:00点', status: 1},
            {id: 9,  time:'2016/08/11 12:00', label:'明天13:00点', status: 1},
            {id: 10, time:'2016/08/11 14:00', label:'明天14:00点', status: 0},
            {id: 11, time:'2016/08/11 15:00', label:'明天15:00点', status: 0},
            {id: 12, time:'2016/08/11 16:00', label:'明天16:00点', status: 1},
            {id: 13, time:'2016/08/11 17:00', label:'明天17:00点', status: 1},
            {id: 14, time:'2016/08/11 18:00', label:'明天18:00点', status: 1}
        ],
        //the day after tomorrow
        [
            {id: 15, time:'2016/08/12 09:00', label:'后天09:00点', status: 1},
            {id: 16, time:'2016/08/12 10:00', label:'后天10:00点', status: 1},
            {id: 17, time:'2016/08/12 11:00', label:'后天11:00点', status: 0},
            {id: 18, time:'2016/08/12 12:00', label:'后天12:00点', status: 1},
            {id: 19, time:'2016/08/12 12:00', label:'后天13:00点', status: 1},
            {id: 20, time:'2016/08/12 14:00', label:'后天14:00点', status: 0},
            {id: 21, time:'2016/08/12 15:00', label:'后天15:00点', status: 0},
            {id: 22, time:'2016/08/12 16:00', label:'后天16:00点', status: 1},
            {id: 23, time:'2016/08/12 17:00', label:'后天17:00点', status: 1},
            {id: 24, time:'2016/08/12 18:00', label:'后天18:00点', status: 1}
        ]
    ]
    //选择时间
    $scope.times_quick = [
        {id: 1, time:'2016/08/10 15:00', label:'今天15:00点', status: 1},
        {id: 2, time:'2016/08/10 16:00', label:'今天16:00点', status: 1},
        {id: 4, time:'2016/08/10 18:00', label:'今天18:00点', status: 1},
        {id: 5,  time:'2016/08/11 09:00', label:'明天09:00点', status: 1}
    ]

    $scope.current.time = $scope.times_quick[0]

    $scope.isShowSelectTime = false
    $scope.toggleSelectTime = function () {
        $scope.isShowSelectTime = !$scope.isShowSelectTime
    }

    $scope.selectTime = function (time) {
        if (time.id != $scope.current.time.id && time.status == 1) {
            $scope.current.time = time
            $scope.isShowSelectTime = false
        }
    }

    $scope.selectTimeQuick = function (time,$event) {
        $event.stopPropagation()

        if (time.id != $scope.current.time.id && time.status == 1)
            $scope.current.time = time
        return;
    }
    
    $scope.selectTimeCls = function (time) {
        return time.status == 0 ? 'selected' : ($scope.current.time != null && $scope.current.time.id == time.id ? 'current' : '')
    }


    //选择门店

    $scope.isShowSelectShop = false
    $scope.toggleSelectShop = function () {
        $scope.isShowSelectShop = !$scope.isShowSelectShop
    }

    $scope.selectShopTab = 'quickView'

    $scope.shops_quick = [
        {
            id: 1,
            name: '速途驰加中铁国际城店',
            address: '庐阳区清源路中铁国际城一期',
            img: 'http://i1.sinaimg.cn/qc/2011/0729/U260P33DT20110729150612.jpg',
            rate: 5,
            distance: 5.26,
            comment: 36,
            sold: 1607,
            service:'普洗(轿车)',
            price:15,
            category: '最常去'
        },
        {
            id: 2,
            name: '速途驰加中铁国际城店',
            address: '庐阳区清源路中铁国际城一期',
            img: 'http://i1.sinaimg.cn/qc/2011/0729/U260P33DT20110729150612.jpg',
            rate: 5,
            distance: 5.26,
            comment: 36,
            sold: 1607,
            service:'普洗(轿车)',
            price:15,
            category: '最常去'
        },
        {
            id: 3,
            name: '速途驰加中铁国际城店',
            address: '庐阳区清源路中铁国际城一期',
            img: 'http://i1.sinaimg.cn/qc/2011/0729/U260P33DT20110729150612.jpg',
            rate: 5,
            distance: 5.26,
            comment: 36,
            sold: 1607,
            service:'普洗(轿车)',
            price:15,
            category: '最近的'
        },
        {
            id: 4,
            name: '速途驰加中铁国际城店',
            address: '庐阳区清源路中铁国际城一期',
            img: 'http://i1.sinaimg.cn/qc/2011/0729/U260P33DT20110729150612.jpg',
            rate: 5,
            distance: 5.26,
            comment: 36,
            sold: 1607,
            service:'普洗(轿车)',
            price:15,
            category: '最近的'
        }
    ]

    $scope.current.shop = $scope.shops_quick[0]
    
    $scope.selectShop = function (shop) {
        if (shop.id != $scope.current.shop.id) {
            $scope.current.shop = shop
            $scope.toggleSelectShop()
        }
    }


    //提交
    $scope.isShowSubmit = false
    $scope.toggleSubmit = function () {
        $scope.isShowSubmit = !$scope.isShowSubmit
    }


}])