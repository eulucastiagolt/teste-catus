import { src, watch, dest, parallel, series } from "gulp";
import browserSync from "browser-sync";
import * as nodeSass from "sass";
import gulpSass from "gulp-sass";
import gulpConcat from "gulp-concat";
import babel from "gulp-babel";
import minify from "gulp-babel-minify";
import rename from "gulp-rename";
// import { deleteAsync } from "del";
// import copy from 'gulp-copy';
import * as fs from 'node:fs/promises';
import autoprefixer from "gulp-autoprefixer";

const sass = gulpSass(nodeSass);

export async function fbrowserSync() {
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

export async function compileSass() {
  return src("./app/sass/styles.scss")
    .pipe(sass({ outputStyle: "compressed", errLogToConsole: true }))
    .on("error", sass.logError)
    .pipe(autoprefixer())
    .pipe(rename({ basename: "styles", suffix: ".min" }))
    .pipe(dest("./assets/css/"))
    .pipe(browserSync.stream({ match: "**/*.css" }));
}

export async function javascript() {
  return src(["./app/js/plugins/**/*.js", "./app/js/functions.js"])
    .pipe(gulpConcat("scripts.js"))
    // .pipe(
    //   babel({
    //     presets: ["@babel/env"],
    //   })
    // )
    // .pipe(
    //   minify({
    //     mangle: {
    //       keepClassName: true,
    //     },
    //   })
    // )
    .pipe(rename({ suffix: ".min" }))
    .pipe(dest("./assets/js"));
}

export async function gwatch() {
  watch("./app/sass/**/*.scss", compileSass);
  watch("./app/js/**/*.js", series(javascript)).on("change", browserSync.reload);
  watch("./*.html").on("change", browserSync.reload);
}

// async function delDist() {
//   return deleteAsync(["./dist/**"]);
// }

export async function build(cb){
  await fs.rm("./dist", { recursive: true, force: true });

  await fs.cp("./assets", "./dist/assets", { recursive: true }, (err) => {
    if (err) {
      console.log(err);
    }
  });

  await fs.cp("./index.html", "./dist/index.html", {}, (err) => {
    if (err) {
      console.log(err);
    }
  });
  cb();
}

// export const build = series(delDist, build_function);

export async function rename_images(cb) {
  const images = await fs.readdir("./assets/img");
  
  images.forEach(image => {
    const new_name = image.replace(' ', '_');
    fs.rename(`./assets/img/${image}`, `./assets/img/${new_name}`, err => {
      if(err){
        console.log(`ERROR: ${err}`);
      }
    });
  });
  
  cb();
  // return src('./assets/img/**/*')
  // .pipe(copy('./'))
  // .pipe(dest('./assets/img/'));
}

// exports.compileSass = compileSass;
// exports.javascript = series(javascript);
// exports.watch = gwatch;
// exports.build = series(delDist, build);
// exports.default = parallel(compileSass, series(javascript), fbrowserSync, gwatch);

export default parallel(compileSass, series(javascript), fbrowserSync, gwatch);;