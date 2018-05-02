process.env.NODE_ENV = 'production';
const config = require('./base.server');
const webpack = require('webpack');
const { envVariables, extractTextPlugin } = require('./constants');

// const envVariables = Object.assign({}, process.env);
config.plugins.unshift(
  new webpack.DefinePlugin({
    'process.env': envVariables
  }),
  ...extractTextPlugin
);

config.mode = 'production';

module.exports = config;
