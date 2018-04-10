/* eslint-disable import/no-extraneous-dependencies */
const webpack = require('webpack');
const webpackDev = require('webpack-dev-middleware');
const webpackHot = require('webpack-hot-middleware');
const logger = require('../logger');
// const chokidar = require('chokidar');
/* eslint-enable import/no-extraneous-dependencies */
const compression = require('compression');
const config = require('../../tools/webpack/development.client');
const express = require('express');

const compiler = webpack(config);

const func = app => {
  // const watcher = chokidar.watch(
  //   ['**/server/routes/**/*.js', '**/server/models/**/*.js'],
  //   {
  //     ignored: ['node_modules', 'bower_components', 'build']
  //   }
  // );

  // watcher.on('ready', () => {
  //   console.log('watcher is READY!');
  //   watcher.on('all', () => {
  //     Object.keys(require.cache).forEach(id => {
  //       if (/server\/(models|routes)/.test(id)) {
  //         console.log('deleting cache for module:', id);
  //         try {
  //           delete require.cache[id];
  //           require(id); // eslint-disable-line global-require, import/no-dynamic-require
  //         } catch (e) {
  //           console.log(e);
  //         }
  //       }
  //     });
  //   });
  // });
  logger.log('Applying Development Middleware!');
  app.use(compression());
  app.use(express.static('public'));
  app.use(
    webpackDev(compiler, {
      publicPath: config.output.publicPath
    })
  );
  app.use(webpackHot(compiler));
  return app;
};

module.exports = func;
