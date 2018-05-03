const path = require('path');

module.exports = {
  entry: {
    sw: ['babel-polyfill', './client/sw.js']
  },
  resolveLoader: {
    modules: ['node_modules', path.join(__dirname, 'loaders')]
  },
  output: {
    path: path.resolve(process.cwd(), 'public'),
    publicPath: '/',
    filename: '[name].js'
  },
  context: path.join(process.cwd()),
  resolve: {
    extensions: ['.webpack.js', '.web.js', '.js', '.json']
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              cacheIdentifier: {
                env: 'service-worker'
              }
            }
          }
        ]
      }
    ]
  },
  plugins: [],
  target: 'webworker'
};
