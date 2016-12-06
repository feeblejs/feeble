const gulp = require("gulp")
const ts = require("gulp-typescript")
const tsProject = ts.createProject("tsconfig.json")
const babel = require('gulp-babel')

gulp.task("default", function () {
  return tsProject.src()
    .pipe(tsProject()).js
    .pipe(babel())
    .pipe(gulp.dest("lib"))
});
