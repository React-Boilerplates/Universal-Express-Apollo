const chokidar = {
  watch: () => {
    return {
      on: (string, callback) => {
        if (string === 'ready') callback();
      }
    };
  }
};

chokidar.HotModuleReplacementPlugin = class HotModuleReplacementPlugin {
  constructor(...args) {
    this.args = args;
  }
  plugin() {
    return '';
  }
};

chokidar.DefinePlugin = class DefinePlugin {
  constructor(...args) {
    this.args = args;
  }
  plugin() {
    return '';
  }
};

module.exports = chokidar;
