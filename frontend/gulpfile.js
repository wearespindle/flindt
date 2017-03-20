const autoprefixer = require('gulp-autoprefixer');
const exec = require('child_process').exec;
const del = require('del');
const gulp = require('gulp');
const historyApiFallback = require('connect-history-api-fallback');
const ifElse = require('gulp-if-else');
const imagemin = require('gulp-imagemin');
const path = require('path');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const webpack = require('webpack');
const webpackStream = require('webpack-stream');
const WebpackDevServer = require('webpack-dev-server');
const gutil = require('gulp-util');

const webpackConfig = require('./webpack.config.js');

const config = {
    paths: {
        browser: './',
        fonts: './assets/fonts',
        html: './**/*.html',
        img: './assets/images',
        sass: {
            src: './assets/stylesheets/**/*.scss',
            sassIndex: './assets/stylesheets/scss/styles.scss',
        },
    },
    env: process.env.NODE_ENV || 'development',
};

let isProduction = (config.env === 'production');

gulp.task('js', () =>
    gulp.src('src/entry.js')
    .pipe(webpackStream(webpackConfig))
    .pipe(gulp.dest('dist/'))
);

gulp.task('js-production', (cb) =>
    exec('npm run build', (err, stdout, stderr) => {
        cb(err);
    })
);


/**
 * Generate a compiled CSS file from the scss files. Add sourcemaps & autoprefix
 * files for the last two browser versions.
 */
gulp.task('sass', () =>
    gulp.src(config.paths.sass.sassIndex)
        .pipe(ifElse(!isProduction, () => sourcemaps.init()))
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
        }))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('./dist/css'))
);


/**
 * Watch sourcefiles and execute tasks upon changing the files, after that
 * refresh the browser.
 */
gulp.task('watch', () => {
    gulp.watch(config.paths.sass.src, ['sass']);
});


/**
 * Process all images. Currently they are only copied to the /dist/images
 * directory. Later we can add some functionality here.
 */
gulp.task('images', () =>
    gulp.src(path.join(config.paths.img, '**'))
        .pipe(ifElse(!isProduction, () => imagemin()))
        .pipe(gulp.dest('./dist/images'))
    );


/**
 * Webpack server sets up a server on localhost:8080 to serve the frontend.
 */
gulp.task('webpack-dev-server', (callback) => {
    new WebpackDevServer(webpack(webpackConfig), {
        stats: {
            colors: true,
        },
        hot: true,
        historyApiFallback: true,
        contentBase: webpackConfig.output.path,
        publicPath: webpackConfig.output.publicPath,
    }).listen(8080, '0.0.0.0', (err) => {
        if (err) throw new gutil.PluginError('webpack-dev-server', err);
        gutil.log('[webpack-dev-server]', 'http://localhost:8080/webpack-dev-server/build/index.html');
    });
});


/**
 * Process all fonts.
 */
gulp.task('fonts', () =>
    gulp.src(path.join(config.paths.fonts, '**'))
    .pipe(gulp.dest('./dist/fonts'))
);


/**
 * Clean the assets folder before building
 */
gulp.task('clean', () => del(['./dist']));


/**
 * Copies and compiles the right files to the /dist folder.
 * This tasks takes a bit of time as the js-production task compiles, bundles
 * and minifies all React related code and dependencies.
 */
gulp.task('build-production', ['clean'], () => {
    isProduction = true;
    gulp.start('fonts');
    gulp.start('sass');
    gulp.start('images');
    gulp.start('js-production');
});


/**
 * Default gulp task.
 */
gulp.task('default', ['js', 'sass', 'fonts', 'images', 'webpack-dev-server', 'watch']);
