'use strict'

const gulp = require('gulp')
const gutil = require('gulp-util')
const concat = require('gulp-concat')
// const uglify = require('gulp-uglify')
const sass = require('gulp-sass')
const sourceMaps = require('gulp-sourcemaps')
// const imagemin = require('gulp-imagemin')
// const minifyCSS = require('gulp-minify-css')
const browserSync = require('browser-sync')
const autoprefixer = require('gulp-autoprefixer')
// const gulpSequence = require('gulp-sequence').use(gulp)
// const shell = require('gulp-shell')
const plumber = require('gulp-plumber')
const nodemon = require('gulp-nodemon')

const autoPrefixBrowserList = ['last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4']

// Compiling our Javascripts
gulp.task('scripts', function () {
  return gulp.src(['src/app/**/*.js'])
    .pipe(plumber())
    .pipe(concat('app.js'))
    .on('error', gutil.log)
    .pipe(gulp.dest('src/public/scripts'))
    .pipe(browserSync.reload({ stream: true }))
})

// Compiling our SCSS files
gulp.task('styles', function () {
  return gulp.src('src/app/global/init.scss')
    .pipe(plumber({
      errorHandler: function (err) {
        console.log(err)
        this.emit('end')
      }
    }))
    .pipe(sourceMaps.init())
    .pipe(sass({
      errLogToConsole: true,
      includePaths: [
        // Additional SCSS come here
      ]
    }))
    .pipe(autoprefixer({
      browsers: autoPrefixBrowserList,
      cascade: true
    }))
    .on('error', gutil.log)
    .pipe(concat('styles.css'))
    .pipe(sourceMaps.write())
    .pipe(gulp.dest('src/public/styles'))
    .pipe(browserSync.reload({ stream: true }))
})

gulp.task('images', function (tmp) {
  browserSync.reload({ stream: true })
})

gulp.task('fonts', function (tmp) {
  browserSync.reload({ stream: true })
})

gulp.task('views', function (tmp) {
  browserSync.reload({ stream: true })
})

gulp.task('browserSync', ['server'], function () {
  console.log('init')
  browserSync.init(null, {
    proxy: 'http://localhost:8080',
    port: 8081
  })
})

gulp.task('server', function (cb) {
  var started = false

  return nodemon({
    script: 'src/lib/index.js',
    watch: ['src/lib/**/*.*'],
    ext: 'js'
  })
    .on('start', function () {
      if (!started) {
        cb()
        started = true
      }
    })
    .on('restart', function () {
      setTimeout(function () {
        browserSync.reload({ stream: true })
      }, 1000)
    })
})

gulp.task('default', ['browserSync', 'scripts', 'styles'], function () {
  gulp.watch('src/app/**/*.js', ['scripts'])
  gulp.watch('src/app/**/*.scss', ['styles'])
  gulp.watch(['src/public/images/**/*.jpg', 'src/public/images/**/*.png'], ['images'])
  gulp.watch(['src/public/fonts/**/*.*'], ['fonts'])
  gulp.watch(['src/app/**/*.pug'], ['views'])
})
