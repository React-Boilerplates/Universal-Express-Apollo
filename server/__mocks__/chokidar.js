const chokidar = {
  watch: () => {
    return {
      on: (string, callback) => {
        if (string === 'ready') callback();
      }
    };
  }
};

module.exports = chokidar;
