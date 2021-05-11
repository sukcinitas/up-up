import { merge } from 'webpack-merge';
import * as sass from 'sass';
// eslint-disable-next-line import/no-extraneous-dependencies
import * as path from 'path';
import * as MiniCssExtractPlugin from 'mini-css-extract-plugin';
import * as CssMinimizerPlugin from 'css-minimizer-webpack-plugin';
import * as TerserPlugin from 'terser-webpack-plugin';
import common from './webpack.common';

export default merge(common, {
  mode: 'production', // configures DefinePlugin by default since v4
  output: {
    filename: 'main.[contentHash].js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/',
  },
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin(), new CssMinimizerPlugin()],
  },
  devtool: false,
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].[contentHash].css',
    }),
  ],
  module: {
    rules: [
      {
        test: /\.(scss|css)$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          {
            loader: 'sass-loader',
            options: {
              implementation: sass,
            },
          },
        ],
      },
    ],
  },
});
