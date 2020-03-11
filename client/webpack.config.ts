import { Configuration } from 'webpack';
import { resolve } from 'path';
import HtmlWebpackPlugin = require('html-webpack-plugin');
// import WebpackBundleAnalyzer = require('webpack-bundle-analyzer');

const config: Configuration = {
  entry: {
    index: `${__dirname}/src/index.tsx`
  },
  output: {
    path: resolve(__dirname, 'dist'),
    filename: '[name].bundle.js'
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
        use: 'ts-loader',
        exclude: [/node_modules/]
      },
      {
        test: /\.html$/,
        exclude: [/node_modules/, /public/],
        use: ['html-loader']
      }
    ]
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.html']
  }
};

export default config;
