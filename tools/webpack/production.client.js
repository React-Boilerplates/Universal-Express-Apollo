const config = require('./base.client');
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

config.externals = {
  react: 'React',
  'react-dom': 'ReactDOM'
};

module.exports = config;
