const config = require('./base.client');
const webpack = require('webpack');
const { envVariables } = require('./constants');

// const envVariables = Object.assign({}, process.env);
config.plugins.unshift(
  new webpack.DefinePlugin({
    'process.env': envVariables
  })
);

config.externals = {
  react: 'React',
  'react-dom': 'ReactDOM',
  lodash: '_',
  'react-router-dom': 'ReactRouterDOM',
  'react-router': 'ReactRouter',
  'styled-components': 'styled'
  // 'apollo-client': 'apollo.core',
  // 'apollo-cache': 'apollo.cache.core',
  // 'react-helmet': 'Helmet',
  // 'apollo-cache-inmemory': 'apollo.cache.inmemory'
};

module.exports = config;
