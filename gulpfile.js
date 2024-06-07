const { src, watch, dest, parallel, series } = require("gulp");
const browserSync = require("browser-sync");
const nodeSass = require("sass");
const gulpSass = require("gulp-sass");
const gulpConcat = require("gulp-concat");
const babel = require("gulp-babel");
const minify = require("gulp-babel-minify");
const rename = require("gulp-rename");

const sass = gulpSass(nodeSass);

function fbrowserSync() {
  try {
    browserSync.init({
      server: {
        baseDir: "./"
      },
      ui: {
        port: 3100,
      },
      open: false,
    });
  } catch (e) {
    console.log(e);
  }
}

function compileSass() {
  return src("./app/sass/styles.scss")
    .pipe(sass({ outputStyle: "compressed" }))
    .pipe(rename({ basename: "styles", suffix: ".min" }))
    .pipe(dest("./assets/css/"))
    .pipe(browserSync.stream({ match: "**/*.css" }));
}

function javascript() {
  return src(["./app/js/**/*.js"])
    .pipe(gulpConcat("scripts.js"))
    .pipe(
      babel({
        presets: ["@babel/env"],
      })
    )
    .pipe(
      minify({
        mangle: {
          keepClassName: true,
        },
      })
    )
    .pipe(dest("./assets/js"))
    .pipe(rename({ suffix: ".min" }))
}

function gwatch() {
  watch("./app/sass/**/*.scss", compileSass);
  watch("./app/js/**/*.js", series(javascript)).on("change", browserSync.reload);
  watch("./*.html").on("change", browserSync.reload);
}

exports.compileSass = compileSass;
exports.javascript = series(javascript);
exports.watch = gwatch;
exports.default = parallel(compileSass, series(javascript), fbrowserSync, gwatch);