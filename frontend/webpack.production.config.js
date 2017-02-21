var webpack = require('webpack');
var path = require('path');

module.exports = {
    entry: [
        './src/index.js',
    ],
    output: {
        path: path.resolve(__dirname, './dist'),
        filename: 'bundle.js',
    },
    module: {
        loaders: [{
            exclude: /node_modules/,
            loader: 'babel',
            query: {
                presets: ['react', 'es2015', 'stage-1'],
            },
        }],
    },
    resolve: {
        extensions: ['', '.js', '.jsx'],
    },
    devServer: {
        historyApiFallback: true,
        contentBase: './',
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                // This has effect on the react lib size
                NODE_ENV: JSON.stringify('production'),
            },
        }),
        new webpack.IgnorePlugin(/^\.\/locale$/, [/moment$/]),
        new webpack.optimize.DedupePlugin(),
        new webpack.optimize.UglifyJsPlugin({
            beautify: false,
            mangle: {
                screw_ie8: true,
            },
            compress: {
                screw_ie8: true,
            },
            comments: false,
        }),
        new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.optimize.AggressiveMergingPlugin(),
    ],
};
