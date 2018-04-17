/* eslint-disable node/no-deprecated-api */
/**
 * BIG NOTE: DO NOT USE THIS ENTRY POINT FOR ANYTHING OTHER THAN DEVELOPMENT
 * There are Hacks and the Production Webpack will obscure these away and give better server side rendering
 *
 */
import webpack from 'webpack';
import logger from './logger';

import config from '../tools/webpack/development.client';

require('@babel/register');

// Hacking the File System to Allow for Development
const extensions = [
  '.jpg',
  '.jpeg',
  '.css',
  '.png',
  '.woff',
  '.svg',
  '.scss',
  '.sss'
];

webpack(config, err => {
  if (err) logger.log(err);

  extensions.forEach(extension => {
    require.extensions[extension] = () => ({});
  });

  const processPort = process.env.PORT;
  require('.').startServer(processPort); // eslint-disable-line global-require
});
