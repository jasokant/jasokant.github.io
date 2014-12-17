var gulp = require('gulp');
var gulpMerge = require('gulp-merge');

var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var sass = require('gulp-sass');
var htmlSrc = require('gulp-dom-src');

var htmlReplace = require('gulp-html-replace');
var sourcemaps = require('gulp-sourcemaps');
var ngAnnotate = require('gulp-ng-annotate');

gulp.task('scripts', function(){
    
    htmlSrc({ file: 'index.html', selector: 'script', attribute: 'src'})
        .pipe(ngAnnotate())
        .pipe(concat('realm.all.js'))
        .pipe(gulp.dest('dist'));      
});

gulp.task('styles', function(){
    
    var stateStyles = gulp.src('states/**/*.scss')
        .pipe(sass())
        .pipe(concat('realm.all-states.css'))
        .pipe(gulp.dest('dist'));
    
    var linkedStyles = htmlSrc({ file: 'index.html', selector: 'link[rel="stylesheet"]', attribute: 'href'})
        .pipe(concat('realm.all-links.css'))
        .pipe(gulp.dest('dist'));

});

gulp.task('copy-files', function(){
    gulp.src(['states/**/*'])
        .pipe(gulp.dest('dist/states'));
    
    gulp.src(['images/**/*'])
        .pipe(gulp.dest('dist/images'));
    
    gulp.src(['core/**/*'])
        .pipe(gulp.dest('dist/images'));
});

gulp.task('default',['scripts','styles','copy-files']);