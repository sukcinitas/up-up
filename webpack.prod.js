const { merge } = require('webpack-merge');
const path = require('path');
const common = require('./webpack.common');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = merge(common, {
  mode: 'production', // configures DefinePlugin by default since v4
  output: {
    filename: 'main.[contentHash].js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/',
  },
  optimization: {
    minimize: true, 
    minimizer: [new TerserPlugin(), new OptimizeCssAssetsPlugin({})],
  },
  devtool: 'source-map',
  plugins: [new MiniCssExtractPlugin({filename:"[name].[contentHash].css"})],
  module: {
    rules: [
      {
        test: /\.(scss|css)$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
      },
    ]
  }
});