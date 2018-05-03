process.env.NODE_ENV = 'production';
const CleanWebpackPlugin = require('clean-webpack-plugin');
const config = require('./base.client');
const path = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const webpack = require('webpack');
const WebpackPwaManifest = require('webpack-pwa-manifest');
const { envVariables, extractTextPlugin } = require('./constants');

// const envVariables = Object.assign({}, process.env);
config.plugins.unshift(
  new webpack.DefinePlugin({
    'process.env': envVariables
  }),
  new WebpackPwaManifest({
    filename: 'web-app-manifest.json',
    name: 'BoilerPlate',
    short_name: 'BoilerPlate',
    description: 'My awesome Progressive Web App!',
    background_color: '#ffffff',
    icons: [
      {
        src: path.resolve('./static/favicon.png'),
        sizes: [96, 128, 192, 256, 384, 512]
      }
    ]
  }),
  ...extractTextPlugin,
  new CleanWebpackPlugin(['public'], {
    root: process.cwd()
  })
);

config.node = {
  fs: 'empty'
};
config.mode = 'production';
config.externals = {
  react: 'React',
  'react-dom': 'ReactDOM',
  lodash: '_',
  redux: 'Redux',
  'react-redux': 'ReactRedux',
  immutable: 'Immutable',
  'redux-form': 'ReduxForm',
  'react-router-dom': 'ReactRouterDOM',
  'react-router': 'ReactRouter',
  'styled-components': 'styled',
  'babel-polyfill': '_babelPolyfill',
  'airbrake-js': 'airbrakeJs'
  // 'react-apollo': '"react-apollo"'
  /*
  'zen-observable': 'apolloLink.zenObservable',
  'apollo-link': 'apolloLink',
  'apollo-utilities': 'apollo.utilities',
  'apollo-link-http-common': 'apolloLink.httpCommon',
  'apollo-link-http': 'apolloLink.http',
  'apollo-link-dedup': 'apolloLink.dedup',
  'apollo-cache': 'apollo.cache',
  'graphql-anywhere': 'graphqlAnywhere',
  'apollo-cache-inmemory': 'apollo.cache.inmemory'
  */

  // 'apollo-client': 'apollo.core',
  // 'apollo-cache': 'apollo.cache.core',
  // 'react-helmet': 'Helmet',
  // 'apollo-cache-inmemory': 'apollo.cache.inmemory'
};

config.optimization = {
  minimize: true,
  minimizer: [new UglifyJsPlugin()]
};

module.exports = config;
