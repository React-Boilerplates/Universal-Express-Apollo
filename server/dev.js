import webpack from 'webpack';
import logger from './logger';

import config from '../tools/webpack/development.client';

webpack(config, err => {
  if (err) logger.log(err);
  const processPort = process.env.PORT;
  require('.').startServer(processPort); // eslint-disable-line global-require
});
