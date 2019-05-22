"use strict";

var gulp = require("gulp");
var plumber = require("gulp-plumber");
var sourcemap = require("gulp-sourcemaps");
var rename = require("gulp-rename");

var sass = require("gulp-sass");
var wait = require("gulp-wait");
var postcss = require("gulp-postcss");
var autoprefixer = require("autoprefixer");
var scco= require("gulp-csso");
var purgecss = require("gulp-purgecss");
var uglify = require("gulp-uglify");
var htmlmin = require("gulp-htmlmin");
var imagemin = require("gulp-imagemin");
var webp = require("gulp-webp");
var svgstore = require("gulp-svgstore");
var posthtml = require("gulp-posthtml");
var include = require("posthtml-include");
var del = require("del");
var server = require("browser-sync").create();

gulp.task("css", function () {
  return gulp.src("source/sass/style.scss")
    .pipe(wait(200))  //задержка для нормальной работы
    .pipe(plumber())  //плагин для отображения ошибок и бесперебойной работы gulp
    .pipe(sourcemap.init())  //отслеживание изменений для создания sourcemap
    .pipe(sass())  //преобразует scss в css
    .pipe(postcss([  //плагин postcss со своим плагином autoprefixer
      autoprefixer()
    ]))
    .pipe(scco())  //минификация css
    .pipe(gulp.dest("source/css"))
    .pipe(rename("style.min.css"))  //переименовываем минифицированный файл
    .pipe(sourcemap.write("."))  //запись sourcemap-файла в папку, куда будет записан основной файл стилей
    .pipe(gulp.dest("build/css"))  //запись полученного файла
    .pipe(server.stream());
});

gulp.task("purgecss", function () {  //чистка css (тут анимательно, т.к. иногда чистит нужное...)
  return gulp.src("build/css/*.css")
      .pipe(purgecss({
          content: ["build/*.html"]
      }))
      .pipe(gulp.dest("build/css"));
});

gulp.task("compress", function () { //минификация js
  return gulp.src("source/js/*.js")
    .pipe(uglify())
    .pipe(rename({
      extname: ".min.js"
    }))
    .pipe(gulp.dest("build/js"));
});

gulp.task("minify", function () {  //минификация html
  return gulp.src("build/*.html")
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest("build"));
});

gulp.task("images", function () {  // оптимизация графики
  return gulp.src("source/img/**/*.{png,jpg,svg}")
  .pipe(imagemin([
  imagemin.optipng({optimizationLevel: 3}),
  imagemin.jpegtran({progressive: true}),
  imagemin.svgo()
  ]))
  .pipe(gulp.dest("build/img"));
});

gulp.task("webp", function () {  //конвертация графики в webp
  return gulp.src("source/img/**/*.{png,jpg}")
  .pipe(webp({quality: 75}))
  .pipe(gulp.dest("build/img"));
});

gulp.task("sprite", function () {  //создание svg-спрайта
  return gulp.src("source/img/sprite/*.svg")
  .pipe(svgstore({
    inlineSvg: true
  }))
  .pipe(rename("sprite.svg"))
  .pipe(gulp.dest("build/img"));
});

gulp.task("html", function () {  //плагин posthtml для тэга include
  return gulp.src("source/*.html")
  .pipe(posthtml([
  include()
  ]))
  .pipe(gulp.dest("build"));
});

gulp.task("server", function () {
  server.init({ //запускает локальный сервер
    server: "build/", //путь к источникам
    notify: false,
    open: true,
    cors: true,
    ui: false
  });

  gulp.watch("source/sass/**/*.{scss,sass}", gulp.series("css")); //следит за файлами {scss,sass} внутри всех подпапок source/sass/ и при изменении любого запускает gulp.task "css"
  gulp.watch("source/*.html", gulp.series("html", "refresh"));
  gulp.watch("source/img/sprite/*.svg", gulp.series("sprite", "html", "refresh"));
});

gulp.task("refresh", function (done) {
  server.reload();
  done();
});

gulp.task("copy", function () {
  return gulp.src([
  "source/fonts/**/*.{woff,woff2}",
  "source/img/**",
  "source/js/support/**",
  "source/*.ico"
  ], {
  base: "source"
  })
  .pipe(gulp.dest("build"));
});

gulp.task("clean", function () {
  return del("build");
});

gulp.task("build", gulp.series(
  "clean",
  "copy",
  "webp",
  "css",
  "compress",
  "sprite",
  "html",
  "minify"
  ));

gulp.task("start", gulp.series("build", "server"));
