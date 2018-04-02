const config = require('./base.client');
const webpack = require('webpack');
const { envVariables } = require('./constants');
const pkg = require('../../package-lock.json');
const moduleToCdn = require('module-to-cdn');

// const envVariables = Object.assign({}, process.env);
config.plugins.unshift(
  new webpack.DefinePlugin({
    'process.env': envVariables
  })
);

const getExternalVar = name => {
  const details = moduleToCdn(name, pkg.dependencies[name].version);
  return details.var;
};

config.externals = {
  react: getExternalVar('react'),
  'react-dom': getExternalVar('react-dom'),
  lodash: '_',
  'react-router-dom': getExternalVar('react-router-dom'),
  'react-router': 'ReactRouter',
  'styled-components': 'styled',
  'babel-polyfill': '_babelPolyfill'
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

module.exports = config;
