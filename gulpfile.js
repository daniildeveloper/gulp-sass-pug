var gulp = require('gulp');
var pug = require('gulp-pug');
var sass = require('gulp-sass');
var cleancss = require('gulp-clean-css');
var browserify = require('browserify');
var watch = require('gulp-watch');
var path = require('path');
var sourcemaps = require("gulp-sourcemaps");
var mincss = require("gulp-minify-css");
var concat = require('gulp-concat');

gulp.task('default', ['images-to-dist', 'fonts-prepare', "bootstrap-prepare", 'less-prebuild', 'js-prepare'], function () {
    browserSync.init({
        server: {
            baseDir: "./dist"
        }
    });
    //watch to changing of html files
    watch("./src/html/*.html", function () {
        console.log("html changed");
        gulp.src("./src/html/*.html")
            .pipe(gulp.dest('./dist'));
        reload();
    });
    watch("./src/img/*", function () {
        console.log("image changed");
        return gulp.src("./src/img/*")
            .pipe(gulp.dest("./dist/img"));
        reload();
    });

    //reload if dist file is changed
    gulp.watch("./dist/css/main.css").on("change", reload);
    gulp.watch('./dist/*.html').on("change", function () {
        console.log('html changed');
        reload();
    });

    //watch for less files
    watch("./src/less/**/*.less", function () {
        console.log("less changed")
        return gulp.src("./src/less/main.less")
            .pipe(sourcemaps.init())
            .pipe(less())
            .pipe(sourcemaps.write())
            .pipe(mincss())
            // .pipe(concat("style.css"))
            .pipe(gulp.dest("./dist/css/"))
        // .pipe(reload());
    });

    watch('./src/pug/**/*.pug', function () {
        console.log('pug changed');
        return gulp.src('./src/pug/**/*.pug')
            .pipe(pug())
            .pipe(gulp.dest('./dist/'))
            .pipe(reload({
                stream: true
            }));
    });

    //watch images change
    watch('./src/img/**/*.{svg, jpg, png, gif}', function () {
        console.log('image changed');
        gulp.src('./src/img/**/*')
            .pipe(gulp.dest('./dist/img/'));
    })
});


/**
 * ===============================
 * demo gulp tasks
 * ===============================
 */
/**
 * sass
 */
gulp.task('sass', function () {
    return gulp.src('./sass/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('./css'));
});

gulp.task('sass:watch', function () {
    gulp.watch('./sass/**/*.scss', ['sass']);
});

//all images from sources to production
gulp.task("images-to-dist", function () {
    gulp.src("./src/img/**/*")
        .pipe(gulp.dest("./dist/img/"));
});

//prepare less files for development enviroment
gulp.task('less-prebuild', function () {
    gulp.src("./src/less/**/*.less")
        .pipe(sourcemaps.init())
        .pipe(less({
            paths: [path.join(__dirname, 'less', 'includes')]
        }))
        .pipe(sourcemaps.write())
        .pipe(mincss())
        .pipe(concat("style.css"))
        .pipe(gulp.dest("./dist/css"));
})

gulp.task("fonts-prepare", function () {
    gulp.src("./node_modules/bootstrap/fonts/**/*")
        .pipe(gulp.dest("./dist/fonts/"));
    gulp.src("./src/fonts/**/*")
        .pipe(gulp.dest("./dist/fonts/"));
    gulp.src('./node_modules/font-awesome/fonts/**/*')
        .pipe(gulp.dest('./dist/fonts/'));
    gulp.src('./node_modules/font-awesome/css/font-awesome.min.css')
        .pipe(gulp.dest('./dist/css/'));
});

gulp.task("normalize", function () {
    gulp.src("./src/css/normalize.css")
        .pipe(gulp.dest("./dist/css"));
});
gulp.task("bootstrap-prepare", function () {
    gulp.src("vendors/bootstrap/dist/css/bootstrap.min.css")
        .pipe(gulp.dest("./dist/css"));
    gulp.src("vendors/bootstrap/dist/js/bootstrap.min.js")
        .pipe(gulp.dest("./dist/js"));
    gulp.src("./vendors/jquery/dist/jquery.min.js").pipe(gulp.dest("./dist/js"));
    gulp.src("./vendors/tether/dist/css/tether.min.css").pipe(gulp.dest("./dist/css"));
    gulp.src("./vendors/tether/dist/js/tether.min.js")
        .pipe(gulp.dest("./dist/js"))

});

gulp.task("css", function () {
    gulp.src("./node_modules/bootstrap/dist/css/bootstrap.min.css")
        .pipe(gulp.dest('./dist/css/'));
});