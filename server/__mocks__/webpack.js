const webpack = () => {
  return {
    stats: {
      hasErrors: () => false,
      hasWarnings: () => false,
      toJson: () => ({
        errors: [],
        warnings: []
      })
    },
    plugin(string, callback) {
      callback(this.stats);
    },
    run(callback) {
      callback(null, this.stats);
    }
  };
};

webpack.HotModuleReplacementPlugin = class HotModuleReplacementPlugin {
  constructor(...args) {
    this.args = args;
  }
  plugin() {
    return '';
  }
};

webpack.DefinePlugin = class DefinePlugin {
  constructor(...args) {
    this.args = args;
  }
  plugin() {
    return '';
  }
};

module.exports = webpack;
