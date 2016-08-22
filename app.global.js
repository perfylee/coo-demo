'use strict'

angular.module('coo.global',[
    'ngResource'
])

.constant('globalConfig', {
    mode: 'pub', // dev,pub
    api: {
        dev: {
            path: 'testData/',
            appointment_save: 'appointment_save.json',
            appointment_default: 'appointment_default_:AppointmentType.json',
            preference_query:'preference.json',
            preference_save:'preference_save.json',
            user_query: 'user.json',
            stores_query: 'stores_:AppointmentType.json',
            store_query:'store.json',
            orders_query:'orders.json',
            order_query:'order.json',
            membership_query:'membership.json',
            membership_package_query:'membership_package.json',
            membership_package_quick_query:'membership_package_quick.json'
        },
        pub: {
            path: 'wxapi/',
            appointment_save: 'Appointment/Appointment',
            appointment_default: 'wx/GetDefaultAppointment',
            preference_query:'wx/GetPreference',
            preference_save:'wx/UpdatePreference',
            user_query: 'Customer/GetCustomerAndCarsInfo',
            stores_query: 'wx/GetStoreList',
            store_query:'',
            orders_query:'Appointment/GetAppointmentList',
            order_query:'Appointment/GetAppointmentDetail',
            membership_query:'wx/GetVIPCards',
            membership_package_query:'wx/GetStoreVIPPackageList'
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