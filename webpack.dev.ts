// eslint-disable-next-line import/no-extraneous-dependencies
import * as path from 'path';
import merge from 'webpack-merge';
import common from './webpack.common';

export default merge(common, {
  mode: 'development',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/',
  },
  devtool: 'inline-source-map', // as well as eval increases bundle size and reduces the overall performance
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
      {
        test: /\.(js|jsx)$/,
        use: ['source-map-loader'],
        enforce: 'pre',
      },
    ],
  },
});
