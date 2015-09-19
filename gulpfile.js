/* global -$ */
'use strict';

var $ = require('gulp-load-plugins')();
var autoprefixer = require('autoprefixer-core');
var browserSync = require('browser-sync');
var CacheBuster = require('gulp-cachebust');
var del = require('del');
var fs = require('fs');
var gulp = require('gulp');
var mainBowerFiles = require('main-bower-files');
var rsync = require('gulp-rsync');
var s3 = require('gulp-s3');
var wiredep = require('wiredep');

var aws = require('./aws.json');
var cachebust = new CacheBuster();
var reload = browserSync.reload;

gulp.task('styles', function () {
  return gulp.src('app/styles/main.css')
    .pipe($.sourcemaps.init())
    .pipe($.postcss([
      autoprefixer({browsers: ['last 2 versions', '> 1%']})
    ]))
    .pipe($.sourcemaps.write())
    .pipe(gulp.dest('.tmp/styles'))
    .pipe(reload({stream: true}));
});

gulp.task('jshint', function () {
  return gulp.src('app/scripts/**/*.js')
    .pipe(reload({stream: true, once: true}))
    .pipe($.jshint())
    .pipe($.jshint.reporter('jshint-stylish'))
    .pipe($.if(!browserSync.active, $.jshint.reporter('fail')));
});

gulp.task('html', ['styles'], function () {
  var assets = $.useref.assets({searchPath: ['.tmp', 'app', '.']});

  return gulp.src('app/*.html')
    .pipe(assets)
    .pipe($.if('*.js', $.uglify()))
    .pipe($.if('*.js', cachebust.resources()))
    .pipe($.if('*.css', $.csso()))
    .pipe($.if('*.css', cachebust.resources()))
    .pipe(assets.restore())
    .pipe($.useref())
    .pipe($.if('*.html', $.minifyHtml({conditionals: true, loose: true})))
    .pipe($.if('*.html', cachebust.references()))
    .pipe(gulp.dest('dist'));
});

gulp.task('images', function () {
  return gulp.src('app/images/**/*')
    .pipe($.cache($.imagemin({
      progressive: true,
      interlaced: true,
      // don't remove IDs from SVGs, they are often used
      // as hooks for embedding and styling
      svgoPlugins: [{cleanupIDs: false}]
    })))
    .pipe(gulp.dest('dist/images'));
});

gulp.task('fonts', function () {
  return gulp.src(mainBowerFiles({
    filter: '**/*.{eot,svg,ttf,woff,woff2}'
  }).concat('app/fonts/**/*'))
    .pipe(gulp.dest('.tmp/fonts'))
    .pipe(gulp.dest('dist/fonts'));
});

gulp.task('extras', function () {
  return gulp.src([
    'app/*.*',
    '!app/*.html'
  ], {
    dot: true
  }).pipe(gulp.dest('dist'));
});

gulp.task('clean', del.bind(null, ['.tmp', 'dist']));

gulp.task('serve', ['styles', 'fonts'], function () {
  browserSync({
    notify: false,
    online: false,
    port: 9000,
    server: {
      baseDir: ['.tmp', 'app'],
      routes: {
        '/bower_components': 'bower_components'
      }
    }
  });

  // watch for changes
  gulp.watch([
    'app/*.html',
    'app/scripts/**/*.js',
    'app/images/**/*',
    '.tmp/fonts/**/*'
  ]).on('change', reload);

  gulp.watch('app/styles/**/*.css', ['styles']);
  gulp.watch('app/fonts/**/*', ['fonts']);
  gulp.watch('bower.json', ['wiredep', 'fonts']);
});

// inject bower components
gulp.task('wiredep', function () {
  return gulp.src('app/*.html')
    .pipe(wiredep.stream({
      ignorePath: /^(\.\.\/)*\.\./
    }))
    .pipe(gulp.dest('app'));
});

gulp.task('build', ['jshint', 'html', 'images', 'fonts', 'extras'], function () {
  return gulp.src('dist/**/*')
    .pipe($.size({title: 'build', gzip: true}));
});

gulp.task('deploy', ['build'], function() {
  gulp.src(['./dist/**', '!./dist/**.html'])
    .pipe(s3(aws, {
      headers: {'Cache-Control': 'max-age=315360000, no-transform, public'}
    }));
  gulp.src('./dist/**.html')
    .pipe(s3(aws, {
      headers: {
        'Cache-Control': 'no-cache, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': 'Sat, 26 Jul 1997 05:00:00 GMT'
      }
    }));
});

gulp.task('default', ['clean'], function () {
  return gulp.start('build');
});
