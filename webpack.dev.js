const { merge } = require('webpack-merge');
const path = require('path');
const common = require('./webpack.common');

module.exports = merge(common, {
  mode: 'development',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/',
  },
  devtool: 'inline-source-map', // as well as eval increases bundle size and reduce the overall performance
  devServer: {
    historyApiFallback: true,
    hot: true,
    inline: true,
    open: true,
    port: 3000,
    proxy: {
      '/api/*': {
        target: 'http://localhost:8080/',
        secure: false,
      },
    },
  },
  module: {
    rules: [
      {
        test: /\.(scss|css)$/,
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },
    ]
  }
});
