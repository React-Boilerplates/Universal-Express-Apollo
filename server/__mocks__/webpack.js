const webpack = () => {
  return {
    plugin: (string, callback) => {
      const stats = {
        hasErrors: () => false,
        hasWarnings: () => false,
        toJson: () => ({
          errors: [],
          warnings: []
        })
      };
      callback(stats);
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
