/* eslint-env jest */
process.env.NODE_ENV = 'development';

const webpack = require('webpack');
const config = require('../development.client');
const fs = require('fs');
const path = require('path');

const assetsPath = path.join(process.cwd(), 'assets.json');

describe.skip('Assets', () => {
  it('should exist', () => {
    // expect(assetsPath).toEqual(1);
    expect(fs.existsSync(assetsPath)).toEqual(true);
  });
  it('should have the right assets', done => {
    webpack(config, () => {
      const assetFile = require(assetsPath); // eslint-disable-line import/no-dynamic-require, global-require
      expect(assetFile).toEqual({
        app: { js: '/assets/app.js' },
        vendor: { js: '/assets/vendor.js' }
      });
      done();
    });
  });
});
