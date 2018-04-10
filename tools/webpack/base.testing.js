const baseClient = require('./base.client');

module.exports = {
  entry: baseClient.entry,
  output: baseClient.output,
  resolve: baseClient.resolve,
  plugins: baseClient.plugins,
  target: baseClient.target
};
