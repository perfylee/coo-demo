'use strict'

module.exports = function (grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        clean: {
            init: ['dist/**'],
            temp: ['dist/app.jstemp', 'dist/public/css/style.csstemp']
        },
        concat: {
            js: {
                src: [
                    'public/lib/jquery/dist/jquery.js',
                    'public/lib/semantic/dist/semantic.js',
                    'public/lib/crypto-js/crypto-js.js',
                    'public/lib/angular/angular.min.js',
                    'public/lib/angular-resource/angular-resource.min.js',
                    'public/lib/angular-route/angular-route.min.js',
                    'public/lib/angular-sanitize/angular-sanitize.min.js',
                    'public/js/Date.js',
                    'components/*/*.js',
                    'modules/*/controller/*.js',
                    'app.global.js',
                    'app.js'
                ],
                dest: 'dist/app.jstemp'
            },
            css: {
                src: [
                    'public/lib/semantic/dist/semantic.css',
                    'public/css/*.css'
                ],
                dest: 'dist/public/css/style.csstemp'
            }
        },
        uglify: {
            js: {
                src: 'dist/app.jstemp',
                dest: 'dist/app.<%= new Date().getTime() %>.js'
            }
        },
        cssmin: {
            options : {
                compatibility : 'ie8', //设置兼容模式
                advanced : false //取消高级特性
            },
            css: {
                files: [{
                    expand: true,
                    cwd: 'dist/public/css/',
                    src: ['style.csstemp'],
                    dest: 'dist/public/css/',
                    ext: '.<%= new Date().getTime() %>.css'
                }]
            }
        },
        copy:{
            images: {
                flatten: true,
                expand: true,
                cwd: 'public/images',
                src: '**',
                dest: 'dist/public/images'
            },
            font: {
                expand: true,
                cwd: 'public/lib/semantic/dist/themes/',
                src: '**',
                dest: 'dist/public/css/themes'
            },
            views: {
                expand: true,
                src: 'modules/*/view/**',
                dest: 'dist'
            },
            index:{
                src: 'index.html',
                dest: 'dist/index.html'
            }
        },
        usemin:{
            html:'dist/index.html'
        }
    })

    grunt.loadNpmTasks('grunt-contrib-clean')
    grunt.loadNpmTasks('grunt-contrib-concat')
    grunt.loadNpmTasks('grunt-contrib-uglify')
    grunt.loadNpmTasks('grunt-contrib-cssmin')
    grunt.loadNpmTasks('grunt-contrib-copy')
    grunt.loadNpmTasks('grunt-usemin')

    grunt.registerTask('default', [
        'clean:init',
        'concat',
        'uglify',
        'cssmin',
        'copy',
        'usemin',
        'clean:temp',
    ])

}