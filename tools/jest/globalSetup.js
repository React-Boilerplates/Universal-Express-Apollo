const config = require('../webpack/base.testing');
const webpack = require('webpack');

module.exports = () =>
  new Promise(resolve => {
    webpack(config, err => {
      if (err) console.error(err);
      else resolve();
    });
  });
