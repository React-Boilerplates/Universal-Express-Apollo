const config = require('./base.client');
const path = require('path');
const webpack = require('webpack');
const { envVariables } = require('./constants');
const WebpackPwaManifest = require('webpack-pwa-manifest');

// const port = process.env.PORT;
config.entry.app.unshift('webpack-hot-middleware/client');
config.plugins.unshift(new webpack.HotModuleReplacementPlugin());
config.plugins.unshift(
  new webpack.DefinePlugin({
    'process.env': envVariables
  }),
  new WebpackPwaManifest({
    name: envVariables.PWA_NAME,
    short_name: envVariables.PWA_SHORTNAME,
    description: envVariables.PWA_DESCRIPTION,
    theme_color: envVariables.PWA_THEME_COLOR,
    background_color: envVariables.PWA_BACKGROUND_COLOR,
    display: 'minimal-ui',
    start_url: '/',
    serviceworker: {
      src: 'sw.js'
    },
    icons: [
      {
        src: path.resolve('static/favicon.png'),
        sizes: [96, 128, 192, 256, 384, 512] // multiple sizes
      },
      {
        src: path.resolve('static/assets/large-icon.png'),
        size: '1024x1024' // you can also use the specifications pattern
      }
    ]
  })
);
config.mode = 'development';
// config.devServer = {
//   host: 'localhost',
//   port,
// };

module.exports = config;
