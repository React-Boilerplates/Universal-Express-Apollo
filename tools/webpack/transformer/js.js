const babel = require('@babel/core');
const UglifyJS = require('uglify-js');

const jsTransformer = content =>
  new Promise((resolve, reject) => {
    babel.transform(
      content.toString(),
      { minified: true, envName: 'client' },
      (err, { code }) => {
        if (err) return reject(err);
        const result = UglifyJS.minify(code, { output: { comments: /^!/ } });
        return resolve(result.code);
      }
    );
  });

module.exports = jsTransformer;
