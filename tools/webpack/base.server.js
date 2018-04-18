const CleanWebpackPlugin = require('clean-webpack-plugin');
const MakeDirWebpackPlugin = require('make-dir-webpack-plugin');
const nodeExternals = require('webpack-node-externals');
const path = require('path');
const { sssLoader } = require('./constants');

module.exports = {
  entry: './server/index.jsx',
  externals: [nodeExternals()],
  context: path.join(process.cwd()),
  resolve: {
    extensions: ['.webpack.js', '.web.js', '.js', '.json', '.jsx']
  },
  output: {
    path: path.join(process.cwd(), 'build'),
    filename: '[name].js'
  },
  mode: 'production',
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
        loader: path.resolve('./tools/webpack/loaders/image-loader.js'),
        options: {
          emitFile: false,
          trace: {
            threshold: 180,
            steps: 4,
            color: '#880000',
            optimize: {
              multipass: true,
              floatPrecision: 2,
              plugins: [
                { removeDoctype: false },
                { convertColors: { shorthex: false } },
                { removeRasterImages: { param: true } }
              ]
            }
          },
          sizes: [{ size: 500, fileType: '.png' }]
        }
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
