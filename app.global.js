'use strict'

angular.module('coo.global',[
    'ngResource'
])

.constant('globalConfig', {
    mode: 'dev', // dev,pub
    api: {
        dev: {
            path: '/testData/',
            defaultAppointment: 'defaultAppointment.json',
            customerAndCarsInfo:'customerAndCarsInfo.json'
        },
        pub: {
            path: 'http://localhost:300/wx/',
            defaultAppointment: 'GetDefaultAppointment',
            customerAndCarsInfo:'GetCustomerAndCarsInfo'
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