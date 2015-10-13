var gulp = require('gulp');

//include plugins
var jshint = require('gulp-jshint');
var changed = require('gulp-changed');
var plumber = require('gulp-plumber');
var imagemin = require('gulp-imagemin');
var cssMinify = require('gulp-minify-css');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var notify = require('gulp-notify');
var sass = require('gulp-sass');
var browsersync = require('browser-sync').create();
var reload = browsersync.reload;

//custom path url
var SRC = './application/assets/js/*.js';
var DEST = 'dist';

gulp.task('serve', ['sass'], function() {
    browsersync.init({
        server: "./application/"
    });
    
    gulp.watch(['./application/assets/img/**/*'], reload);
    gulp.watch("./application/assets/js/**/*.js", ['jshint', 'jscompress', reload]);
    gulp.watch("./application/assets/scss/**/*.scss", ['sass', reload]);
    gulp.watch(['./application/*.*'], reload);
});



gulp.task('sass', function(){
    gulp.src('./application/assets/scss/**/*.scss')
        .pipe(sass())
        .pipe(gulp.dest('./application/assets/css'))
});

gulp.task('imagemin', function() {
    return gulp.src('./application/assets/img/*')
        .pipe(plumber())
        .pipe(imagemin({ progressive: true, optimizationLevel: 5 }))
        .pipe(gulp.dest(DEST + '/images'));
});

gulp.task('cssMinify', function() {
    return gulp.src('./application/assets/css/*')
        .pipe(plumber())
        .pipe(cssMinify({
            keepSepecialComments: 1
        }))
        .pipe(gulp.dest(DEST + '/css'))
});


gulp.task('jscompress', function() {
  return gulp.src('./application/assets/js/dev-js/*.js')
    .pipe(concat('main.min.js')) //the name of the resulting file
    .pipe(uglify())
    .pipe(gulp.dest('./application/assets/js'))
    .pipe(notify({ message: 'Finished minifying JavaScript'}));
});

gulp.task('changed', function() {
    return gulp.src(SRC)
        .pipe(plumber())
        .pipe(changed(DEST))
        .pipe(gulp.dest(DEST + '/js'));
});

gulp.task('jshint', function() {
    gulp.src('./application/assets/js/main.js')
        .pipe(plumber())
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

gulp.task('watch', function() {
    gulp.watch(SRC, ['sass']);
});


gulp.task('default', ['serve']);