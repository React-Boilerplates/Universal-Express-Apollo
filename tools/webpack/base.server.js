const CleanWebpackPlugin = require('clean-webpack-plugin');
const MakeDirWebpackPlugin = require('make-dir-webpack-plugin');
const nodeExternals = require('webpack-node-externals');
const path = require('path');
const { sssLoader } = require('./constants');

const __DEV__ = process.env.NODE_ENV === 'development'; // eslint-disable-line no-underscore-dangle

module.exports = {
  entry: './server/index.jsx',
  externals: [nodeExternals()],
  context: path.join(process.cwd()),
  resolve: {
    extensions: ['.webpack.js', '.web.js', '.js', '.json', '.jsx']
  },
  resolveLoader: {
    modules: ['node_modules', path.join(__dirname, 'loaders')]
  },
  output: {
    path: path.join(process.cwd(), 'build'),
    filename: '[name].js'
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
              env: 'server'
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
          //       env: 'client'
          //     }
          //   }
          // },
          {
            loader: 'image-loader',
            options: {
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
              dataUri: false,
              sizes: []
            }
          }
        ],
        sideEffects: !__DEV__
      }
    ]
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        commons: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendor',
          chunks: 'all'
        }
      }
    }
  },
  plugins: [
    new CleanWebpackPlugin(['build', 'logs'], {
      root: process.cwd()
    }),
    new MakeDirWebpackPlugin({
      dirs: [{ path: './logs' }]
    })
  ],
  target: 'node'
};
