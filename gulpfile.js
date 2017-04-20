var gulp        = require('gulp');
var sass        = require('gulp-sass');
var less        = require('gulp-less');
var path        = require('path');
var browserSync = require('browser-sync').create();
var watch       = require('gulp-watch');
var clean       = require('gulp-clean');
var runSequence = require('run-sequence');
var zip         = require('gulp-zip');

gulp.task('scss', function () {
  return gulp.src('./src/scss/**/*.{scss,sass}')
  .pipe(sass().on('error', sass.logError))
  .pipe(gulp.dest('./dist/css'))
  .pipe(browserSync.stream());
});

gulp.task('images', function () {
  return gulp.src('./src/images/**/*.{png,jpg,svg}')
  .pipe(gulp.dest('./dist/images'))
  .pipe(browserSync.stream());
});

gulp.task('less', function () {
  return gulp.src('./src/less/**/*.less')
    .pipe(less({
      paths: [ path.join(__dirname, 'less', 'includes') ]
    }))
    .pipe(gulp.dest('./dist/css'));
});

gulp.task('html', function () {
  return gulp.src('./src/**/*.html')
    .pipe(gulp.dest('./dist'))
    .pipe(browserSync.stream());
});

gulp.task('zip', function(){
    gulp.src('dist/*')
        .pipe(zip('archive.zip'))
        .pipe(gulp.dest('./'))
});

gulp.task('watch', function () {
    watch('src/scss/**/*.scss', function () {
        gulp.start('scss');
    });
    watch('src/less/**/*.less', function () {
        gulp.start('less');
    });
    watch('src/images/**/*.{png,jpg,svg}', function () {
        gulp.start('images');
    });
    watch('src/*.html', function () {
        gulp.start('html');
    });
});

gulp.task('clean', function () {
    return gulp.src('dist/')
        .pipe(clean({force: true}));
});


gulp.task('build', function(callback) {
  runSequence('clean',['scss', 'less', 'html', 'images'], 'zip', callback);
});

gulp.task('dev', ['scss', 'less', 'html', 'images'], function() {
    browserSync.init({
        server: "./dist"
    });
    gulp.start('watch');
});