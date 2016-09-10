'use strict'

angular.module('coo.global',[
    'ngResource'
])

.constant('globalConfig', {
    mode: 'pub', // dev,pub
    api: {
        // dev: {
        //     path: 'testData/',
        //     appointment_save: 'appointment_save.json',
        //     appointment_default: 'appointment_default_:AppointmentType.json',
        //     preference_query: 'preference.json',
        //     preference_save: 'preference_save.json',
        //     user_query: 'user.json',
        //     stores_query: 'stores_:AppointmentType.json',
        //     store_query: 'store.json',
        //     orders_query: 'orders.json',
        //     order_query: 'order.json',
        //     membership_query: 'membership.json',
        //     membership_package_query: 'membership_package.json',
        //     membership_package_quick_query: 'membership_package_quick.json'
        // },
        dev: {
            path: 'cswxapi/',
            appointment_save: 'Appointment/Appointment',
            appointment_default: 'wx/GetDefaultAppointment',
            appointment_categories_query: 'wx/GetAppiontmentTypes',
            preference_query: 'wx/GetPreference',
            preference_save: 'wx/UpdatePreference',
            user_query: 'Customer/GetCustomerAndCarsInfo',
            stores_query: 'wx/GetStoreList',
            stores_query_fromcard: 'Customer/GetStoreListByStoreTag',
            store_query: 'wx/GetSingleStore',
            orders_query: 'Appointment/GetAppointmentList',
            order_query: 'Appointment/GetAppointmentDetail',
            order_cancel: 'Appointment/CancleAppointment',
            membership_query: 'wx/GetVIPCards',
            membership_package_query: 'wx/GetStoreVIPPackageList',
            package_order_create: 'wx/WeChatOrdering',
            membership_pay_code: 'wx/GetVipCardCheckCode'
        },
        pub: {
            path: 'wxapi/',
            appointment_save: 'Appointment/Appointment',
            appointment_default: 'wx/GetDefaultAppointment',
            appointment_categories_query: 'wx/GetAppiontmentTypes',
            preference_query: 'wx/GetPreference',
            preference_save: 'wx/UpdatePreference',
            user_query: 'Customer/GetCustomerAndCarsInfo',
            stores_query: 'wx/GetStoreList',
            stores_query_fromcard: 'Customer/GetStoreListByStoreTag',
            store_query: 'wx/GetSingleStore',
            orders_query: 'Appointment/GetAppointmentList',
            order_query: 'Appointment/GetAppointmentDetail',
            order_cancel: 'Appointment/CancleAppointment',
            membership_query: 'wx/GetVIPCards',
            membership_package_query: 'wx/GetStoreVIPPackageList',
            package_order_create: 'wx/WeChatOrdering',
            membership_pay_code: 'wx/GetVipCardCheckCode'
        }
    },
    wx: {
        dev: {
            key: 'MrCarTest12345678901234567890123'
        },
        pub: {
            key: 'SoToMrCarqaswedfrtghyujkioplkiju'
        }
    },

    enMonth: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    modules: {
        car: '/car/addcar.htm',
        wxToken: '/weixin/Active.aspx',
        appointmentDetail: '/my/MyReservationDetail.htm',
    }


})

.factory('cooGlobal',['globalConfig','$resource',function (globalConfig,$resource) {

    var config = {}

    /*** config ***/
    angular.forEach(globalConfig,function (value,key) {
        config[key] = value[globalConfig.mode] || value

        if(key == 'api') {
            angular.forEach(config.api, function (value1, key1) {
                if (key1 != 'path')
                    config.api[key1] = config.api.path + value1
            })
        }

    })
    
    /*** methods ***/
    //api request
    config.resource = function (api,params) {
        var method = globalConfig.mode == 'dev' ? 'post' : 'post'
        return $resource(api, params || {}, {
            query: {method: method, isArray: false},
            save: {method: method, isArray: false},
            form: {
                method: 'POST',
                isArray: false,
                transformRequest: angular.identity,
                headers: {'Content-Type': undefined}
            }
        })
    }

    //random string gen
    config.randomString = function () {
        var length = 16
        var chars = 'abcdefghijklmnopqrstuvwxyz0123456789'
        var str = ''
        for (var i = 0; i < length; i++) {
            str += chars[Math.round(Math.random() * chars.length)]
        }
        return str
    }

    //wx signature
    config.wxSignature = function (jsApiTickect,noncestr,timestamp,url) {
        var signature = config.wx.signatureTemp
        signature = signature.replace('{0}', jsApiTickect)
        signature = signature.replace('{1}', noncestr)
        signature = signature.replace('{3}', timestamp)
        signature = signature.replace('{4}', url)
        return config.sha1hex(signature)
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