const CopyWebpackPlugin = require('copy-webpack-plugin');
const MakeDirWebpackPlugin = require('make-dir-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');
const path = require('path');

// const FaviconsWebpackPlugin = require('favicons-webpack-plugin');
const AssetsPlugin = require('assets-webpack-plugin');
const cssTransformer = require('./transformer/css');
const jsTransformer = require('./transformer/js');
const { sssLoader } = require('./constants');

const assetsPluginInstance = new AssetsPlugin({
  filename: 'assets.json',
  path: path.join(process.cwd())
});

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
  resolveLoader: {
    modules: ['node_modules', path.join(__dirname, 'loaders')]
  },
  output: {
    path: path.resolve(process.cwd(), 'public'),
    publicPath: '/',
    filename: __DEV__ ? 'assets/[name].[ext]' : 'assets/[name].[hash].[ext]'
  },
  context: path.join(process.cwd()),
  resolve: {
    extensions: ['.webpack.js', '.web.js', '.js', '.json', '.jsx']
  },
  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'eslint-loader'
      },
      // {
      //   test: /\.rs$/,
      //   use: [
      //     {
      //       loader: 'wasm-loader'
      //     },
      //     {
      //       loader: 'rust-native-wasm-loader',
      //       options: {
      //         release: true
      //       }
      //     }
      //   ]
      // },
      {
        test: /\.jsx?$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            cacheIdentifier: {
              env: __DEV__ ? 'client' : 'client:prod'
            }
          }
        }
      },
      {
        test: /\.sss$/,
        use: sssLoader
      },
      {
        test: /\.(jpe?g|png)$/i,
        use: [
          // {
          //   loader: 'babel-loader',
          //   options: {
          //     cacheIdentifier: {
          //       env: __DEV__ ? 'client' : 'client:prod'
          //     }
          //   }
          // },
          {
            loader: 'image-loader',
            options: {
              width: undefined,
              emitFile: true,
              sizeOpts: {
                dataUri: false,
                emitFile: true
              },
              svgOptimize: { multipass: true, floatPrecision: 1 },
              svgOpts: {
                threshold: 180,
                steps: 1,
                color: '#880000'
              },
              dataUri: true,
              sizes: []
            }
          }
        ],
        sideEffects: false
      }
    ]
  },
  plugins: [
    new MakeDirWebpackPlugin({
      dirs: [{ path: './logs' }, { path: './uploads' }]
    }),
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

    assetsPluginInstance
  ],
  target: 'web'
};
