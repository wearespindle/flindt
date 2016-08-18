'use strict';

let autoprefixer = require('gulp-autoprefixer');
let babelify = require('babelify');
let watchify = require('watchify');
let browserify = require('browserify');
let browserSync = require('browser-sync');
let gulp = require('gulp');
let historyApiFallback = require('connect-history-api-fallback');
var notify = require('gulp-notify');
let path = require('path');
let sass = require('gulp-sass');
let source = require('vinyl-source-stream');
let sourcemaps = require('gulp-sourcemaps');

let dependencies = [
    'react',
    'react-dom',
];

// Put browserSync reload method in a variable for easier use.
let reload = browserSync.reload;

let scriptsCount = 0;

let paths = {
    browser: './',
    fonts: './assets/fonts',
    html: './**/*.html',
    img: './assets/images',
    js: {
        src: './assets/js/**/*.js',
        jsIndex: './assets/js/index.js',
    },
    sass: {
        src: './assets/stylesheets/**/*.scss',
        sassIndex: './assets/stylesheets/scss/styles.scss',
    },
};


/**
 * Show errors in the console and prevent Gulp from running when an error
 * occurs.
 */
function handleErrors() {
    var args = Array.prototype.slice.call(arguments);
    notify.onError({
        title: 'Compile Error',
        message: '<%= error.message %>',
    }).apply(this, args);
    this.emit('end'); // Keep gulp from hanging on this task.
}


/**
 * Build all the JavaScript files and transpile them when neccessary.
 * @param {Bool} isProduction. When true bundle all JavaScript in to one file
 * (vendor/app).
 */
function bundleApp(isProduction) {
    var appBundler = browserify({
        entries: './assets/js/index.js',
        debug: true,
    });

    scriptsCount++;

    // If it's not for production, a separate vendors.js file will be created
    // the first time gulp is run so that we don't have to rebundle things like
    // react everytime there's a change in the js file.
    if (!isProduction && scriptsCount === 1) {
        // Create vendors.js for dev. environment.
        browserify({
            require: dependencies,
            debug: true,
        })
        .bundle()
        .on('error', handleErrors)
        .pipe(source('vendors.js'))
        .pipe(gulp.dest('./compiled-assets/vendor/'));
    }
    if (!isProduction) {
        // Make the dependencies external so they dont get bundled by the
        // app bundler. Dependencies are already bundled in vendors.js for
        // dev. environments.
        dependencies.forEach(function(dep) {
            appBundler.external(dep);
        });
    }

    appBundler
        .transform('babelify', {presets: ['es2015', 'react']})
        .bundle()
        .on('error', handleErrors)
        .pipe(source('index.js'))
        .pipe(gulp.dest('./compiled-assets/scripts/'));
}


/**
 * Run JavaScript related tasks.
 * Execute the bundleApp function with true to bundle all the JavaScript files
 * vendor and app into one file. Set to false to split vendor and app JS
 * for faster development (eg. not compiling vendor JS on every save).
 */
gulp.task('js', function() {
    bundleApp(false);
});


/**
 * Setup local server for static files.
 */
gulp.task('browser-sync', function() {
    browserSync({
        // we need to disable clicks and forms for when we test multiple rooms
        server: {},
        middleware: [historyApiFallback()],
        ghostMode: false,
    });
});


/**
 * Generate a compiled CSS file from the scss files. Add sourcemaps & autoprefix
 * files for the last two browser versions.
 */
gulp.task('sass', function() {
    return gulp.src(paths.sass.sassIndex)
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
        }))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('./compiled-assets/css'))
        .pipe(reload({stream: true}));
});


/**
 * Watch sourcefiles and execute tasks upon changing the files, after that
 * refresh the browser.
 */
gulp.task('watch', function() {
    gulp.watch(paths.js.src, ['js']);
    gulp.watch(paths.sass.src, ['sass']);
    gulp.watch(paths.html, function() {
        return gulp.src('')
            .pipe(reload({stream: true}));
    });
});


/**
 * Process all images. Currently they are only copied to the compiled-assets
 * directory. Later we can add some other tasks here.
 */
gulp.task('images', () => {
    return gulp.src(path.join(paths.img, '**'))
    .pipe(gulp.dest('./compiled-assets/images'))
    .pipe(reload({stream: true}));
});


/**
 * Process all fonts.
 */
gulp.task('fonts', () => {
    return gulp.src(path.join(paths.fonts, '**'))
    .pipe(gulp.dest('./compiled-assets/fonts'))
    .pipe(reload({stream: true}));
});

gulp.task('default', ['js', 'sass', 'watch', 'images', 'fonts', 'browser-sync']);
