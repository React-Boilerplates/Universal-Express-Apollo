const config = require('./base.server');
const webpack = require('webpack');
const dotEnv = require('dotenv');

dotEnv.config();

// const envVariables = Object.assign({}, process.env);
config.plugins.unshift(
  new webpack.DefinePlugin({
    'process.env': {
      NODE_ENV: 'production'
    }
  })
);

module.exports = config;
