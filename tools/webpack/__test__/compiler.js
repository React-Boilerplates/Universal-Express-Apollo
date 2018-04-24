// import path from 'path';
import webpack from 'webpack';
import MemoryFs from 'memory-fs';

export default config => {
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
