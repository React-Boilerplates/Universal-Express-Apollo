const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');
const MakeDirWebpackPlugin = require('make-dir-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

// const FaviconsWebpackPlugin = require('favicons-webpack-plugin');
const AssetsPlugin = require('assets-webpack-plugin');

const jsTransformer = require('./transformer/js');
const cssTransformer = require('./transformer/css');

const assetsPluginInstance = new AssetsPlugin({ filename: 'assets.json' });

const __DEV__ = process.env.NODE_ENV === 'development'; // eslint-disable-line no-underscore-dangle

const staticFolder = path.join(__dirname, '../../', '/static');

module.exports = {
  entry: {
    app: ['./client/index.jsx'],
    vendor: [
      'react',
      'react-dom',
      'react-apollo',
      'lodash',
      'babel-polyfill',
      'react-router-dom',
      'react-router',
      'loadable-components',
      'react-helmet',
      'apollo-cache-inmemory',
      'apollo-client',
      'apollo-link-http'
    ]
  },
  output: {
    path: path.resolve(process.cwd(), 'public'),
    publicPath: '/',
    filename: __DEV__ ? 'assets/[name].js' : 'assets/[name].[hash].js'
  },
  resolve: {
    extensions: ['.webpack.js', '.web.js', '.js', '.json', '.jsx']
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            cacheIdentifier: {
              env: 'client'
            }
          }
        }
      }
    ]
  },
  plugins: [
    new MakeDirWebpackPlugin({
      dirs: [
        { path: './logs' }
      ]
    })
    new ManifestPlugin({
      fileName: 'assets-manifest.json'
    }),
    // new FaviconsWebpackPlugin('static/favicon.png'),
    new CopyWebpackPlugin([
      {
        from: staticFolder,
        to: 'assets/[name].[ext]',
        ignore: ['!*.css'],
        test: /\.css$/,
        cache: { key: 'my-cache-key' },
        transform: cssTransformer,
        toType: 'template'
      },
      {
        from: staticFolder,
        to: 'assets/',
        ignore: ['!*.js'],
        test: /\.jsx?$/,
        cache: true,
        transform: jsTransformer
      },
      {
        from: 'static/!(favicon.png|favicon.ico|*.css|*.js)',
        to: '[name].[ext]',
        toType: 'template'
      },
      {
        from: 'static/favicon.ico',
        to: '[name].[ext]',
        toType: 'template'
      }
    ]),
    new CleanWebpackPlugin(['public']),
    assetsPluginInstance
  ],
  target: 'web'
};
