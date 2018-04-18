/* eslint-disable import/no-extraneous-dependencies, node/no-missing-require, no-useless-escape */
import chokidar from 'chokidar';
import chalk from 'chalk';
// eslint-disable-next-line no-unused-vars
import fetch from 'isomorphic-unfetch';

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
const friendlySyntaxErrorLabel = 'Syntax error:';
function formatMessage(message) {
  return (
    message
      // Make some common errors shorter:
      .replace(
        // Babel syntax error
        'Module build failed: SyntaxError:',
        friendlySyntaxErrorLabel
      )
      .replace(
        // Webpack file not found error
        /Module not found: Error: Cannot resolve 'file' or 'directory'/,
        'Module not found:'
      )
      // Internal stacks are generally useless so we strip them
      .replace(/^\s*at\s.*:\d+:\d+[\s\)]*\n/gm, '') // at ... ...:x:y
      // Webpack loader names obscure CSS filenames
      .replace('./~/css-loader!./~/postcss-loader!', '')
  );
}

function isLikelyASyntaxError(message) {
  return message.indexOf(friendlySyntaxErrorLabel) !== -1;
}

const func = app => {
  global.fetch = fetch;
  const watcher = chokidar.watch(
    ['**/server/routes/**/*.js', '**/server/models/**/*.js'],
    {
      ignored: ['node_modules', 'bower_components', 'build']
    }
  );

  compiler.plugin('done', function(stats) {
    // Setup Clearing Cache in Future
    // logger.log('Clearing /client/ module cache from server');
    // Object.keys(require.cache).forEach(id => {
    //   if (/[\/\\]client[\/\\]/.test(id)) delete require.cache[id];
    // });
    const hasErrors = stats.hasErrors();
    const hasWarnings = stats.hasWarnings();
    if (!hasErrors && !hasWarnings) {
      logger.log(chalk.green('Compiled successfully!'));
      logger.log('');
      logger.log(
        chalk.gray('Note that the development build is not optimized.')
      );
      logger.log(
        chalk.gray(
          'To create a production build, use ' +
            chalk.cyan('npm run build') +
            '.'
        )
      );
      logger.log('');
      return;
    }
    const json = stats.toJson({}, true);
    let formattedErrors = json.errors.map(
      message => 'Error in ' + formatMessage(message)
    );
    const formattedWarnings = json.warnings.map(
      message => 'Warning in ' + formatMessage(message)
    );
    if (hasErrors) {
      logger.log(chalk.red('Failed to compile.'));
      logger.log();
      if (formattedErrors.some(isLikelyASyntaxError)) {
        // If there are any syntax errors, show just them.
        // This prevents a confusing ESLint parsing error
        // preceding a much more useful Babel syntax error.
        formattedErrors = formattedErrors.filter(isLikelyASyntaxError);
      }
      formattedErrors.forEach(message => {
        logger.log(message);
        logger.log();
      });
      // If errors exist, ignore warnings.
      return;
    }
    if (hasWarnings) {
      logger.log(chalk.yellow('Compiled with warnings.'));
      logger.log();
      formattedWarnings.forEach(message => {
        logger.log(message);
        logger.log();
      });
      // Teach some ESLint tricks.
      logger.log('You may use special comments to disable some warnings.');
      logger.log(
        'Use ' +
          chalk.yellow('// eslint-disable-next-line') +
          ' to ignore the next line.'
      );
      logger.log(
        'Use ' +
          chalk.yellow('/* eslint-disable */') +
          ' to ignore all warnings in a file.'
      );
      logger.log();
    }
  });

  watcher.on('ready', () => {
    logger.log('watcher is READY!');
    watcher.on('all', () => {
      Object.keys(require.cache).forEach(id => {
        if (/[\/\\]server[\/\\]/.test(id)) {
          logger.log('deleting cache for module:', id);
          try {
            delete require.cache[id];
          } catch (e) {
            logger.log(e);
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
