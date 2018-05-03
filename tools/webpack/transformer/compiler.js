// import path from 'path';
const MemoryFs = require('memory-fs');
const webpack = require('webpack');

module.exports = config => {
  const compiler = webpack(config);
  const fs = new MemoryFs();
  compiler.outputFileSystem = fs;

  return new Promise((resolve, reject) => {
    compiler.run((err, stats) => {
      if (err) reject(err);

      resolve([stats, fs]);
    });
  });
};
