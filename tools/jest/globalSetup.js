const webpack = require('webpack');
const config = require('../webpack/base.testing');

module.exports = async () =>
  new Promise(resolve => {
    webpack(config, err => {
      if (err) console.error(err);
      else resolve();
    });
  });
