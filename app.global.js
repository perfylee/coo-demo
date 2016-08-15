'use strict'

angular.module('coo.global',[
    'ngResource'
])

.constant('globalConfig', {
    mode: 'dev', // dev,pub
    api: {
        dev: {
            path: '/testData/',
            defaultAppointment: 'defaultAppointment_:AppointmentType.json',
            customerAndCarsInfo: 'customerAndCarsInfo.json',
            stores: 'stores_:AppointmentType.json',
            appointment: 'appointment.json'
        },
        pub: {
            path: 'http://localhost:3000/',
            defaultAppointment: 'wx/GetDefaultAppointment',
            customerAndCarsInfo: 'Customer/GetCustomerAndCarsInfo',
            stores: 'Customer/GetStoreListByToken/GetDefaultAppointment',
            appointment: 'Appointment/Appointment'
        }
    },
    enMonth: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
})


.factory('cooGlobal',['globalConfig','$resource',function (globalConfig,$resource) {

    var config = {}

    //config
    angular.forEach(globalConfig,function (value,key) {
        config[key] = value[globalConfig.mode] || value

        if(key == 'api') {
            angular.forEach(config.api, function (value1, key1) {
                if (key1 != 'path')
                    config.api[key1] = config.api.path + value1
            })
        }

    })
    
    //methods
    config.resource = function (api,params) {
        var method = globalConfig.mode == 'dev' ? 'get' : 'post'
        return $resource(api, params || {}, {
            query: {method: method, isArray: false},
            save: {method: method, isArray: false}
        })
    }

    return config
}])

/*日期格式化1*/
.filter('shortTime',function () {
    //mode 0 含天 今天HH:ss 1 含天 但不显示今天 2 HH:ss
    return function (input,mode) {

        if(input == undefined)
            return '-'

        mode == undefined && (mode = 0)
        var out = '',
            time = new Date(input.replace(/-/g, "/"))

        if (mode == 2)
            return time.toString('HH:mm')

        var today = new Date()

        if (time.dateDiff(today, 'd') == 0) {
            if (mode == 0)
                out = '今天' + time.toString('HH:mm')
            else if (mode == 1)
                out = time.toString('HH:mm')
        }
        else if (time.dateDiff(today, 'd') == 1)
            out = '明天' + time.toString('HH:mm')
        else if (time.dateDiff(today, 'd') == 2)
            out = '后天' + time.toString('HH:mm')
        else
            out = time.toString('HH:mm')

        return out

    }
})