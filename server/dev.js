import webpack from 'webpack';

import config from '../tools/webpack/development.client';

webpack(config, err => {
  if (err) console.log(err);
  require('./index');
});
