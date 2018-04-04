/* eslint-disable import/no-extraneous-dependencies */
const webpack = require('webpack');
const webpackDev = require('webpack-dev-middleware');
const webpackHot = require('webpack-hot-middleware');
/* eslint-enable import/no-extraneous-dependencies */
const compression = require('compression');
const config = require('../../tools/webpack/development.client');
const express = require('express');

const compiler = webpack(config);

const func = app => {
  console.log('Applying Development Middleware!');
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
