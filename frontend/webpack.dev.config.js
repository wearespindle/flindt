const { resolve } = require('path');

const port = process.env.npm_package_config_port;

module.exports = {
  entry: [resolve('./', 'src', 'index.js')],
  // preLoaders: [
  //    // Javascript
  //    { test: /\.jsx?$/, loader: 'eslint', exclude: /node_modules/ },
  // ],
  output: {
    path: __dirname,
    publicPath: 'dist',
    filename: 'bundle.js'
  },
  // eslint: {
  //     configFile: './.eslintrc',
  //     emitWarning: true,
  // },
  devtool: 'inline-source-map',
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules)/,
        loader: 'babel-loader'
      }
    ]
  },
  devServer: {
    port,
    historyApiFallback: true,
    contentBase: '.'
  }
};
/*
loaders: [
  {
    exclude: /node_modules/,
    loader: 'babel-loader',
    query: {
      presets: ['react', 'es2015', 'stage-1']
    }
  }
];*/
