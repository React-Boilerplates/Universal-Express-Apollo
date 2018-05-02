const compiler = require('./compiler');
const config = require('../service-worker');
const crypto = require('crypto');
const path = require('path');
const webpack = require('webpack');

// Created this to Transform the SW and not store it in memory

const serviceWorkerTransformer = production => content =>
  new Promise(async (resolve, reject) => {
    const prod = production ? 'prod' : 'dev';
    // Create a Cache buster Here
    const str = content.toString();
    const hash = crypto
      .createHash('md5')
      .update(str)
      .digest('hex');
    const assetCache = `assets-v${hash}-${prod}`;
    const dynamicCache = `dynamic-v${hash}-${prod}`;
    config.plugins.unshift(
      new webpack.DefinePlugin({
        __assets__: JSON.stringify(assetCache),
        __dynamic__: JSON.stringify(dynamicCache)
      })
    );
    if (!production) config.mode = 'development';
    let code;
    try {
      const [d, fs] = await compiler(config);

      code = fs
        .readFileSync(path.join(process.cwd(), 'public', 'sw.js'))
        .toString();
    } catch (error) {
      console.error(error);
      reject(error);
    }
    return resolve(code);
  });

module.exports = serviceWorkerTransformer;
