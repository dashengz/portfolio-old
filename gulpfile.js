const gulp = require('gulp');
const babel = require('gulp-babel');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const googleWebFonts = require('gulp-google-webfonts');
const sass = require('gulp-sass');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const rename = require('gulp-rename');
const sourcemaps = require('gulp-sourcemaps');
const adjuster = require('gulp-css-url-adjuster');
const browserify = require('browserify');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const log = require('gulplog');
const del = require('del');


const processJs = () =>
    gulp.src(['src/js/**/*'])
        .pipe(babel())
        .pipe(gulp.dest('dist/js'));

const processModules = () =>
    browserify({
        entries: 'dist/js/main.js',
        debug: true
    }).bundle()
        .pipe(source('src/page/*.js'))
        .pipe(buffer())
        .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(uglify())
        .on('error', log.error)
        .pipe(rename('main.js'))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('./dist/js/'));

const getFonts = () =>
    gulp.src('./fonts.list')
        .pipe(googleWebFonts({
            cssFilename: 'fonts.css'
        }))
        .pipe(gulp.dest('src/fonts'));

const adjustFontsPath = () =>
    gulp.src('src/fonts/fonts.css')
        .pipe(adjuster({
            prepend: '/fonts/'
        }))
        .pipe(rename('fonts.scss'))
        .pipe(gulp.dest('src/fonts'));

const processCss = () =>
    gulp.src('src/css/*.scss')
        .pipe(concat('main.scss'))
        .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(postcss([
            autoprefixer({
                add: true,
                browsers: ["> 0.1%"]
            }),
            cssnano({
                discardComments: {
                    removeAll: true
                }
            })
        ]))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('dist/css'));

const copyNormalize = () =>
    gulp.src(['node_modules/normalize.css/normalize.css'])
        .pipe(rename('normalize.scss'))
        .pipe(gulp.dest('src/vendor/css'));
const copyCss = () =>
    gulp.src(['dist/css/main.css'])
        .pipe(gulp.dest('src/css'));
const copyProjectFiles = () =>
    gulp.src(['src/manifest.json', 'src/*.html'])
        .pipe(gulp.dest('dist'));
const copyProjectFolders = () =>
    gulp.src(['src/favicon/**/*', 'src/img/**/*', 'src/fonts/**/*.woff'], {base: 'src'})
        .pipe(gulp.dest('dist'));

const clean = () =>
    del('dist/js/page/**', {force: true});

const build = gulp.parallel(
    gulp.series(
        gulp.parallel(
            gulp.series(getFonts, adjustFontsPath), copyNormalize
        ),
        processCss,
        gulp.parallel(copyCss, copyProjectFiles, copyProjectFolders)
    ),
    gulp.series(processJs, processModules, clean)
);
gulp.task('default', build);