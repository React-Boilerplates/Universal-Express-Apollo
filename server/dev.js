import webpack from 'webpack';
import logger from './logger';

import config from '../tools/webpack/development.client';

webpack(config, err => {
  if (err) logger.log(err);
  require('.').createServer(); // eslint-disable-line global-require
});
