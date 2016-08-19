'use strict'

module.exports = function (grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concat: {
            js: {
                src: [
                    'public/lib/jquery/dist/jquery.js',
                    'public/lib/semantic/dist/semantic.js',
                    'public/lib/angular/angular.min.js',
                    'public/lib/angular-resource/angular-resource.min.js',
                    'public/lib/angular-route/angular-route.min.js',
                    'js/Date.js',
                    'components/*/*.js',
                    'modules/*/controller/*.js',
                    'app.global.js',
                    'app.js'
                ],
                dest: 'publish/app.js'
            },
            css: {
                src: [
                    'public/lib/semantic/dist/semantic.css',
                    'public/css/basic.css',
                    'public/css/index.css',
                    'public/css/default-setting.css',
                    'public/css/complete.css',
                    'public/css/store.css',
                    'public/css/order.css',
                    'public/css/membership.css'
                ],
                dest: 'publish/public/style.css'
            }
        }
    })

    grunt.loadNpmTasks('grunt-contrib-concat')
    grunt.registerTask('default', ['concat'])

}