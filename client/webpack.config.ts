import { Configuration } from 'webpack';
import { Configuration as Dev } from 'webpack-dev-server';
const resolve = require('path').resolve;
const HtmlWebpackPlugin = require('html-webpack-plugin');
// const WebpackBundleAnalyzer = require('webpack-bundle-analyzer');

interface C extends Dev, Configuration {}

const config: C = {
  entry: {
    index: `${__dirname}/src/index.tsx`
  },
  output: {
    path: resolve(__dirname, 'dist'),
    chunkFilename: '[name].chunk.js',
    filename: '[name].bundle.js',
    publicPath: '/'
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: `${__dirname}/public/index.html`
    })
    // new WebpackBundleAnalyzer.BundleAnalyzerPlugin()
  ],
  module: {
    rules: [
      {
        test: /\.s[ac]ss$/i,
        use: ['style-loader', 'css-loader', 'sass-loader']
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.tsx?$/,
        use: ['ts-loader'],
        exclude: [/node_modules/]
      }
    ]
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    alias: {
      react: 'preact/compat',
      'react-dom/test-utils': 'preact/test-utils',
      'react-dom': 'preact/compat'
    }
  },
  devServer: {
    historyApiFallback: true,
    allowedHosts: ['localhost'],
    publicPath: '/'
  },
  optimization: {
    // minimize: false,
    splitChunks: {
      chunks: 'all',
      minSize: 2000
    }
  }
};

module.exports = config;
