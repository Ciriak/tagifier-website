var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var sass = require('gulp-sass');
var htmlmin = require('gulp-htmlmin');
var jsonminify = require('gulp-jsonminify');
var install = require("gulp-install");
var del = require('del');
var imageop = require('gulp-image-optimization');
var ngmin = require('gulp-ngmin');
var bower = require('gulp-bower');
var plumber = require('gulp-plumber');  //prevent watch crash
var gulpsync = require('gulp-sync')(gulp);

gulp.task('sass', function () {
  return gulp.src('./src/style/**/*.scss')
    .pipe(plumber())
    .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
    .pipe(gulp.dest('./dist/css'));
});

gulp.task('clean:dist', function() {
  return del('./dist/**/*');
});

gulp.task('clean:build', function() {
  return del('./build/**/*');
});

gulp.task('install-dependencies', function() {
  return bower({ cwd: './src',interactive:true });
});

gulp.task('scripts', function() {
  return gulp.src('./src/js/**/*.js')
    .pipe(plumber())
    .pipe(ngmin())
  	.pipe(uglify({mangle: false}))
    .pipe(concat('tagifier.js'))
    .pipe(gulp.dest('./dist/js/'));
});

gulp.task('images', function(cb) {
    gulp.src(['src/**/*.png','src/**/*.jpg','src/**/*.gif','src/**/*.jpeg','src/**/*.svg','src/**/*.ico']).pipe(imageop({
        optimizationLevel: 5,
        progressive: true,
        interlaced: true
    })).pipe(gulp.dest('./dist')).on('end', cb).on('error', cb);
});

gulp.task('copy-dependencies', function() {
  gulp.src('./src/bower_components/**/*')
  .pipe(gulp.dest('./dist/dep/'));
});

gulp.task('html', function() {
  return gulp.src('src/**/*.html')
    .pipe(plumber())
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest('./dist'))
});

gulp.task('watch', function () {
  gulp.watch('./src/style/**/*.scss', ['sass']);
  gulp.watch('./src/**/*.html', ['html']);
  gulp.watch('./src/**/*.js', ['scripts']);
});

gulp.task('prepare-dev-env', gulpsync.sync([
    // sync
    'clean:dist',
    ['install-dependencies'],
    [
        // async
        'sass',
        'scripts',
        'html',
        'copy-dependencies',
        'images'
    ]
]));

gulp.task('default', gulpsync.sync([
    ['prepare-dev-env'],
    ['watch']
]));
