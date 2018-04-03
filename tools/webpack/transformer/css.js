const postcss = require('postcss');
const precss = require('precss');
const cssnano = require('cssnano');
const autoprefixer = require('autoprefixer');

const cssTransformer = content =>
  postcss([precss, autoprefixer, cssnano])
    .process(content, { from: '/' })
    .then(({ css }) => css);

module.exports = cssTransformer;
