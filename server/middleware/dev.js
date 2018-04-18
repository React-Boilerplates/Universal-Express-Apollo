/* eslint-disable import/no-extraneous-dependencies, node/no-missing-require, no-useless-escape, no-console */
import chokidar from 'chokidar';

const logger = require('../logger');

const webpack = require('webpack');
const webpackDev = require('webpack-dev-middleware');
const webpackHot = require('webpack-hot-middleware');
// const chokidar = require('chokidar');
/* eslint-enable import/no-extraneous-dependencies */
const compression = require('compression');
const config = require('../../tools/webpack/development.client');
const express = require('express');

const compiler = webpack(config);

const func = app => {
  const watcher = chokidar.watch(
    ['**/server/routes/**/*.js', '**/server/models/**/*.js'],
    {
      ignored: ['node_modules', 'bower_components', 'build']
    }
  );

  compiler.plugin('done', function() {
    console.log('Clearing /client/ module cache from server');
    Object.keys(require.cache).forEach(id => {
      if (/[\/\\]client[\/\\]/.test(id)) delete require.cache[id];
    });
  });

  watcher.on('ready', () => {
    console.log('watcher is READY!');
    watcher.on('all', () => {
      Object.keys(require.cache).forEach(id => {
        if (/[\/\\]server[\/\\]/.test(id)) {
          console.log('deleting cache for module:', id);
          try {
            delete require.cache[id];
          } catch (e) {
            console.log(e);
          }
        }
      });
    });
  });
  logger.log('Applying Development Middleware!');
  app.use(compression());
  app.use(express.static('public'));
  app.use(
    webpackDev(compiler, {
      publicPath: config.output.publicPath
    })
  );
  app.use(webpackHot(compiler));
  // eslint-disable-next-line global-require
  app.use((req, res, next) => {
    require('../routes').default(req, res, next);
  });
  return app;
};

module.exports = func;
