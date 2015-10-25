var gulp = require('gulp');

//include plugins
var jshint = require('gulp-jshint'),
    changed = require('gulp-changed'),
    plumber = require('gulp-plumber'),
    imagemin = require('gulp-imagemin'),
    cssMinify = require('gulp-minify-css'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    uncss = require('gulp-uncss'),
    notify = require('gulp-notify'),
    sass = require('gulp-sass'),
    browsersync = require('browser-sync').create(),
    reload = browsersync.reload;

//custom path url
var SRC = './application/assets/',
    DEST = 'production';


gulp.task('sass', function(){
    gulp.src(SRC + 'scss/**/*.scss')
        .pipe(sass())
        .on('error', notify.onError(function(error) {
            return "Gulp Error: " + error.message;
        }))
        .pipe(gulp.dest(SRC + 'css/dev-css'))
});

gulp.task('imagemin', function() {
    return gulp.src(SRC + 'img/**/*')
        .pipe(plumber())
        .pipe(imagemin({
            progressive: true,
            optimizationLevel: 5
        }))
        .pipe(gulp.dest(DEST + '/assets/img/'));
});

gulp.task('cssMinify', function() {
    return gulp.src(SRC + 'css/dev-css/*')
        .pipe(concat('main.min.css'))
        .pipe(cssMinify({
            keepSepecialComments: 1
        }))
        .pipe(gulp.dest(SRC + 'css'))
});

gulp.task('jscompress', function() {
  return gulp.src(SRC + 'js/dev-js/*.js')
    .pipe(concat('main.min.js')) //the name of the resulting file
    .pipe(uglify())
    .pipe(gulp.dest(SRC + 'js'))
});

gulp.task('uncss', function () {
    return gulp.src(SRC + 'css/main.min.css')
        .pipe(concat('main.min.css'))
        .pipe(uncss({
            html: ['./application/index.html'],
            ignore: [
                        /\.open/,
                         /(#|\.)fancybox(\-[a-zA-Z]+)?/,
                        /(#|\.)active(\-[a-zA-Z]+)?/,
                        /(#|\.)modal(\-[a-zA-Z]+)?/,
                        // Bootstrap selectors added via JS
                        /\w\.in/,
                        ".fade",
                        ".collapse",
                        ".collapsing",
                        /(#|\.)navbar(\-[a-zA-Z]+)?/,
                        /(#|\.)dropdown(\-[a-zA-Z]+)?/,
                        /(#|\.)(open)/,
                        /^\.scroll(\-)?/,
                        /^\.scrollbar(\-)?/,
                       // currently only in a IE conditional, so uncss doesn't see it
                        ".close",
                        ".alert-dismissible"
                    ]
        }))
        .pipe(gulp.dest(DEST + '/assets/dcss/'));
});


gulp.task('jshint', function() {
    gulp.src(SRC + 'js/main.js')
        .pipe(plumber())
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

gulp.task('watch', function() {
    gulp.watch(SRC, ['sass']);
    gulp.watch(SRC, ['cssMinify']);
});

gulp.task('serve', ['sass', 'cssMinify'], function() {
    browsersync.init({
        server: "./application/"
    });
    gulp.watch([SRC + 'img/**/*'], reload);
    gulp.watch(SRC + "js/**/*.js", ['jshint', 'jscompress', reload]);
    gulp.watch(SRC + "scss/**/*.scss", ['sass', 'cssMinify', reload]);
    gulp.watch(SRC + "css/*.*", ['cssMinify', reload]);
    gulp.watch(['./application/**/*.html'], reload);
    gulp.watch(['./application/**/*.php'], reload);
    gulp.watch(['./application/*'], reload);
    return gulp.on('error', notify.onError(function(error) {
            return "Gulp Error: " + error.message;
        }))
});

gulp.task('copy', function() {
    return gulp.src([
            'application/**',
            '!application/assets/css/{dev-css,dev-css/**}',
            '!application/assets/js/{dev-js,dev-js/**}',
            '!application/assets/{scss,scss/**}',
            '!application/assets/{img,img/**}',
        ], {
            dot: true
        })
        .on('error', notify.onError(function(error) {
            return "Gulp Error: " + error.message;
        }))
        .pipe(gulp.dest('production'))

});

gulp.task('default', ['serve', 'imagemin']);

gulp.task('prod', ['copy', 'imagemin', 'uncss']);