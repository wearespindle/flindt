module.exports = {
    entry: [
        './src/index.js',
    ],
    preLoaders: [
       // Javascript
       { test: /\.jsx?$/, loader: 'eslint', exclude: /node_modules/ },
    ],
    output: {
        path: __dirname,
        publicPath: '/',
        filename: 'bundle.js',
    },
    eslint: {
        configFile: './.eslintrc',
        emitWarning: true,
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
};
