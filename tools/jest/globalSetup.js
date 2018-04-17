/* eslint-disable no-console */

const env = process.env.NODE_ENV;
process.env.NODE_ENV = 'development';

const config = require('../webpack/base.testing');
const webpack = require('webpack');

module.exports = () =>
  new Promise(resolve => {
    console.log('Global Setup Initializing!!');
    webpack(config, err => {
      if (err) console.error(err);
      process.env.NODE_ENV = env;
      resolve();
    });
  });
