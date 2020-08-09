import { Configuration } from 'webpack';
import { Configuration as Dev } from 'webpack-dev-server';
const resolve = require('path').resolve;
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const Dotenv = require('dotenv-webpack');
const CopyPlugin = require('copy-webpack-plugin');
// const WebpackBundleAnalyzer = require('webpack-bundle-analyzer');

interface C extends Dev, Configuration {}

const config: C = {
  entry: {
    index: `${__dirname}/src/index.tsx`,
  },
  output: {
    path: resolve(__dirname, 'dist'),
    chunkFilename: '[name].chunk.js',
    filename: '[name].bundle.js',
    publicPath: '/',
  },

  plugins: [
    new CopyPlugin({
      patterns: [{ from: './public/_redirects', to: '.' }],
    }),
    new Dotenv(),
    new HtmlWebpackPlugin({
      template: `${__dirname}/public/index.html`,
      favicon: `${__dirname}/public/favicon.png`,
    }),
    new ForkTsCheckerWebpackPlugin(),
    // new WebpackBundleAnalyzer.BundleAnalyzerPlugin()
  ],
  module: {
    rules: [
      {
        test: /\.s[ac]ss$/i,
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              transpileOnly: true,
            },
          },
        ],
        exclude: [/node_modules/],
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    alias: {
      react: 'preact/compat',
      'react-dom/test-utils': 'preact/test-utils',
      'react-dom': 'preact/compat',
    },
  },
  devServer: {
    historyApiFallback: true,
    allowedHosts: ['localhost'],
    publicPath: '/',
  },
  optimization: {
    // minimize: false,
    splitChunks: {
      chunks: 'all',
    },
  },
};

module.exports = config;
