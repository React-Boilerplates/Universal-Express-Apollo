const path = require('path');

module.exports = {
  process(src, filename) {
    const filePath = JSON.stringify(path.basename(filename));
    return `export default () => Promise.resolve(${filePath});`;
  }
};
