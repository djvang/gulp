var gulp            = require('gulp');
var sass            = require('gulp-sass');
var less            = require('gulp-less');
var path            = require('path');
var browserSync     = require('browser-sync').create();
var watch           = require('gulp-watch');
var clean           = require('gulp-clean');
var runSequence     = require('run-sequence');
var zip             = require('gulp-zip');
var sourcemaps      = require('gulp-sourcemaps');
var autoprefixer    = require('gulp-autoprefixer');
var include         = require("gulp-include");
var handlebars      = require('gulp-compile-handlebars');
var rename          = require('gulp-rename');

var paths = {
  src:        './src',
  dest:       './dest',
  scss:       '/scss',
  less:       '/less',
  js:         '/js',
  images:     '/images',
  components: '/components'
}

gulp.task('html', function () {
  options = {
    ignorePartials: true,
    batch: [paths.src + paths.components],
    helpers: {
      capitals: function(str){
        return str.toUpperCase();
      }
    }
  }
  return gulp.src(paths.src + '/*.{html,hbs,handlebars}')
    .pipe(handlebars({}, options))
    .pipe(rename(function (path) {
      path.extname = ".html"
    }))
    .pipe(gulp.dest(paths.dest))
    .pipe(browserSync.stream());
});

gulp.task('scss', function() {
    return gulp.src(paths.src + paths.scss + '/**/*.{scss,sass}')
        .pipe(sourcemaps.init())
        .pipe(autoprefixer())
        .pipe(sass({
            includePaths: [
                __dirname + "/bower_components",
                __dirname + "/node_modules"
            ]
        }).on('error', sass.logError))
        .pipe(gulp.dest(paths.dest + '/css'))
        .pipe(sourcemaps.write())
        .pipe(browserSync.stream());
});

gulp.task('less', function() {
    return gulp.src(paths.src + paths.less + '/**/*.less')
        .pipe(sourcemaps.init())
        .pipe(autoprefixer())
        .pipe(less({
            paths: [
                path.join(__dirname, 'less', 'includes'),
                __dirname + "/bower_components",
                __dirname + "/node_modules"
            ]
        }))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(paths.dest + '/css'))
        .pipe(browserSync.stream());
});

gulp.task('js', function() {
    return gulp.src(paths.src + paths.js + '/main.js')
        .pipe(include({
          includePaths: [
            __dirname + "/bower_components",
            __dirname + "/node_modules"
          ]
        }))
        .pipe(gulp.dest(paths.dest + paths.js))
        .pipe(browserSync.stream());
});

gulp.task('js:vendor', function() {
    return gulp.src(paths.src + paths.js + '/vendor/**/*.{js,json}')
        .pipe(gulp.dest(paths.dest + paths.js))
        .pipe(browserSync.stream());
});

gulp.task('images', function() {
    return gulp.src(paths.src + paths.images + '/**/*.{png,jpg,svg}')
        .pipe(gulp.dest(paths.dest + paths.images))
        .pipe(browserSync.stream());
});

gulp.task('zip', function() {
    gulp.src(paths.dest + '/**/*.*')
        .pipe(zip(path.basename(__dirname) + '.zip'))
        .pipe(gulp.dest('./'))
});

gulp.task('clean', function() {
    return gulp.src(paths.dest + '/')
        .pipe(clean({ force: true }));
});

gulp.task('watch', function() {
    watch(paths.src + '/**/*.html', function() {
        gulp.start('html');
    });
    watch(paths.src + paths.scss + '/**/*.scss', function() {
        gulp.start('scss');
    });
    watch(paths.src + paths.less + '/**/*.less', function() {
        gulp.start('less');
    });
    watch(paths.src + paths.js + '/**/*.{js,json}', function() {
        gulp.start('js');
    });
    watch(paths.src + paths.js + '/vendor/**/*.{js,json}', function() {
        gulp.start('js:vendor');
    });
    watch(paths.src + paths.images + '/**/*.{png,jpg,svg}', function() {
        gulp.start('images');
    });
});

gulp.task('dev', ['scss', 'less', 'html', 'js', 'js:vendor', 'images'], function() {
    browserSync.init({
        server: paths.dest
    });
    gulp.start('watch');
});

gulp.task('build', function() {
    runSequence('clean', ['scss', 'less', 'html', 'js', 'js:vendor', 'images'],
      'zip');
});
