'use strict';

var gulp = require('gulp');
var sass =  require('gulp-sass');

gulp.task('default', function(){
  return gulp.src('./styles/styles.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./public/'));
});

gulp.task('watch', function(){
  gulp.watch('./styles/*.scss', ['default']);
});
