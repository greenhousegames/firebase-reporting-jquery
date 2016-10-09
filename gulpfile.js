'use strict';

var gulp = require('gulp');
var panini = require('panini');

// Build the "dist" folder by running all of the below tasks
gulp.task('default', function() {
  return gulp.src('app/html/pages/**/*.{html,hbs,handlebars}')
    .pipe(panini({
      root: 'app/html/pages/',
      layouts: 'app/html/layouts/',
      partials: 'app/html/partials/',
      data: 'app/html/data/',
      helpers: 'app/html/helpers/'
    }))
    .pipe(gulp.dest('public'));
});
