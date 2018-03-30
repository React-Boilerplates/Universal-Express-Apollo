const config = require('./base.server');
const webpack = require('webpack');
const { envVariables } = require('./constants');

// const envVariables = Object.assign({}, process.env);
config.plugins.unshift(
  new webpack.DefinePlugin({
    'process.env': envVariables
  })
);

module.exports = config;
