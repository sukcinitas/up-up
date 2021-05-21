
import * as sass from 'sass';
// eslint-disable-next-line import/no-extraneous-dependencies
import * as path from 'path';
import * as MiniCssExtractPlugin from 'mini-css-extract-plugin';
import * as CssMinimizerPlugin from 'css-minimizer-webpack-plugin';
import * as HtmlWebpackPlugin from 'html-webpack-plugin';

export default {
  entry: './src/client/index.tsx',
  mode: 'production', // configures DefinePlugin by default since v4
  output: {
    filename: 'main.[contentHash].js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/',
    clean: true,
  },
  optimization: {
    minimize: true,
    minimizer: [new CssMinimizerPlugin()],
  },
  devtool: false,
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].[contentHash].css',
    }),
    new HtmlWebpackPlugin({ template: 'template.html' }),
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
      {
        test: /\.html$/,
        use: ['html-loader'],
      },
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ['babel-loader', 'eslint-loader'],
      },
      {
        test: /\.(ts|tsx)$/,
        exclude: /node_modules/,
        use: ['babel-loader'],
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.json', '.jsx', '.ts', '.tsx'],
  },
};
