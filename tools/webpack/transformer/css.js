const cssnano = require('cssnano');
const cssNext = require('postcss-cssnext');
const postcss = require('postcss');
const precss = require('precss');

const cssTransformer = content =>
  postcss([precss, cssNext, cssnano])
    .process(content, { from: '/' })
    .then(({ css }) => css);

module.exports = cssTransformer;
