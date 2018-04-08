/* eslint-env jest */
// const webpack = require('webpack');
const fs = require('fs');
const path = require('path');

const assetsPath = path.join(process.cwd(), 'assets.json');
const assetFile = require(assetsPath); // eslint-disable-line import/no-dynamic-require

describe('Assets', () => {
  it('should exist', () => {
    // expect(assetsPath).toEqual(1);
    expect(fs.existsSync(assetsPath)).toEqual(true);
  });
  it('should have the right assets', () => {
    expect(assetFile).toEqual({
      app: { js: '/assets/app.js' },
      vendor: { js: '/assets/vendor.js' }
    });
  });
});
