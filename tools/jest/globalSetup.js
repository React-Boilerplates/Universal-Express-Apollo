/* eslint-disable no-console */
const compiler = require('../../test_utilities/compilerAsync');
const { execSync } = require('child_process');

const env = process.env.NODE_ENV;
process.env.NODE_ENV = 'development';

const config = require('../webpack/base.testing');

const globalSetup = () =>
  new Promise((resolve, reject) => {
    console.log('Global Setup Initializing!!');
    compiler(config, false)
      .then(() => {
        execSync('npm run build');
        process.env.NODE_ENV = env;
        resolve();
      })
      .catch(reject);
  });

module.exports = globalSetup;

if (require.main === module) {
  globalSetup();
}
