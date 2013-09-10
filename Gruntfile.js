/*
    @墨智
    1. 压缩 HTML、JS、CSS。
    2. 合并 Magix View 的 HTML 模板和 JS。
*/
'use strict';
module.exports = function(grunt) {

    var dest = 'build/<%= grunt.template.today("yyyymmdd-HH") %>/',
        destapp = dest + 'app/';

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        componentjs: {
            componentjs: {
                files: {
                    'build/<%= grunt.template.today("yyyymmdd-HH") %>/components/': "components/"
                }
            }
        },
        clean: {
            before: ["build/"],
            after: {
                expand: true,
                cwd: destapp,
                src: [ '**/*-min.html']
            }
        },
        concat: {
            options: {
                separator: ';'
            },
            dist: {}
        },
        viewconcat: {
            options: {},
            view: {
                expand: true,
                cwd: destapp,
                src: ['**/*.html'],
                dest: destapp,
                ext: '.js'
            }
        },
        uglify: {
            options: {
                // banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
            },
            app: {
                expand: true,
                cwd: destapp,
                src: ['**/*.js', '!**/*-min.js'],
                dest: destapp,
                ext: '-min.js' // '-min.js'
            }
        },
        cssmin: {
            options: {},
            assets: {
                expand: true,
                cwd: dest+'assets/',
                src: ['**/*.css', '!**/*-min.css'],
                dest: dest+'assets/',
                ext: '-min.css'
            }
        },
        htmlmin: {
            options: {
                removeComments: true,
                collapseWhitespace: true,
                collapseBooleanAttributes: true
            },
            app: {
                expand: true,
                cwd: 'app/',
                src: ['**/*.html'], // , '!**/*-min.html'
                dest: destapp,
                ext: '.html'
            }
        },
        jshint: {
            files: ['Gruntfile.js', 'package.json', 'tasks/**/*.js', 'app/**/*.js', 'components/**/*.js'], // 
            options: {
                jshintrc: '.jshintrc'
            }
        },
        csslint: {
            options: {
                csslintrc: '.csslintrc'
            },
            strict: {
                options: {
                    "import": 2
                },
                src: ['assets/**/*.css', '!**/*-min.css']
            },
            lax: {
                options: {
                    "import": false
                },
                src: ['<%= csslint.strict.src %>']
            }
        },
        qunit: {
            files: ['test/**/*.html']
        },
        watch: {
            dev: {
                files: ['<%= jshint.files %>', 'app/**/*.*', 'test/**/*.*'],
                tasks: ['base-dev']
            },
            build: {
                files: ['<%= jshint.files %>', 'app/**/*.*'],
                tasks: ['base-build']
            }

        },
        connect: {
            server: {
                options: {
                    port: 5000,
                    base: '.',
                    host: '0.0.0.0'
                }
            }
        },
        copy: {
            build: {
                files: [{
                    expand: true,
                    src: ['assets/**'],
                    dest: dest,
                },{
                    expand: true,
                    src: ['app/**/*.js'],
                    dest: dest,
                }]
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-qunit');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-csslint');
    grunt.loadNpmTasks('grunt-contrib-copy');

    // tasks
    grunt.loadTasks('tasks');

    // Default task. 日常开发
    grunt.registerTask('base-dev', ['jshint', 'csslint:lax', 'qunit']);
    grunt.registerTask('dev', ['base-dev', 'connect']);

    // Build task 发布
    grunt.registerTask('default', [
        'copy',
        'cssmin',
        'htmlmin',
        'viewconcat',
        'uglify',
        'componentjs'
    ]);
    grunt.registerTask('build', ['base-dev','default']);

};