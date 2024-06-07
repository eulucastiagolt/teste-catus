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
    .pipe(sass({ outputStyle: "compressed", errLogToConsole: true, onError: function(err) {
            return notify().write(err);
        } }))
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

async function build(){
  const files = [
    { src: "./assets/css/**/*.css", dest: "./dist/assets/css/" },
    { src: "./assets/js/**/*.js", dest: "./dist/assets/js/" },
    { src: "./index.html", dest: "./dist/" },
  ];
  await files.map(file => {
    return src(file.src).pipe(dest(file.dest));
  });
}

exports.compileSass = compileSass;
exports.javascript = series(javascript);
exports.watch = gwatch;
exports.build = build;
exports.default = parallel(compileSass, series(javascript), fbrowserSync, gwatch);