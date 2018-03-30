const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const postcss = require('postcss');
const precss = require('precss');
const cssnano = require('cssnano');
const autoprefixer = require('autoprefixer');
const babel = require('@babel/core');
const AssetsPlugin = require('assets-webpack-plugin');

const assetsPluginInstance = new AssetsPlugin({ filename: 'assets.json' });

const __DEV__ = process.env.NODE_ENV === 'development'; // eslint-disable-line no-underscore-dangle

const UglifyJS = require('uglify-js');

const staticFolder = path.join(__dirname, '../../', '/static');

const cssTransformer = content =>
  postcss([precss, autoprefixer, cssnano])
    .process(content, { from: '/' })
    .then(({ css }) => css);

const jsTransformer = content =>
  new Promise((resolve, reject) => {
    babel.transform(
      content.toString(),
      { minified: true, envName: 'client' },
      (err, { code }) => {
        if (err) return reject(err);
        const result = UglifyJS.minify(code, { output: { comments: /^!/ } });
        return resolve(result.code);
      }
    );
  });

module.exports = {
  entry: {
    app: ['./client/index.jsx'],
    vendor: [
      'react',
      'react-dom',
      'react-apollo',
      'react-router-dom',
      'styled-components',
      'loadable-components',
      'react-helmet',
      'apollo-cache-inmemory',
      'apollo-client',
      'apollo-link-http'
    ]
  },
  output: {
    path: path.resolve(process.cwd(), 'public'),
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
        from: 'static/!(*.css|*.js)',
        to: __DEV__ ? '[name].[ext]' : '[name].[ext]',
        toType: 'template'
      },
      {
        from: 'static/favicon.ico',
        to: '[name].[ext]',
        toType: 'template'
      }
    ]),
    assetsPluginInstance
  ],
  target: 'web'
};
