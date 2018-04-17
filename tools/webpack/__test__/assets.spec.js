/* eslint-env jest */
process.env.NODE_ENV = 'development';

const config = require('../base.testing');
const fs = require('fs');
const path = require('path');
const webpack = require('webpack');

const compiler = webpack(config);
const assetsPath = path.join(process.cwd(), 'assets.json');

describe('Assets', () => {
  beforeAll(done => {
    compiler.run((err, stats) => {
      if (err || stats.hasErrors()) {
        console.error(err);
      }
      done();
    });
  });
  it('should exist', () => {
    // eslint-disable-next-line global-require, import/no-dynamic-require
    expect(require(assetsPath)).toEqual({
      app: { js: '/assets/app.js' },
      vendor: { js: '/assets/vendor.js' }
    });
    // expect(assetsPath).toEqual(1);
    expect(fs.existsSync(assetsPath)).toEqual(true);
  });
});
