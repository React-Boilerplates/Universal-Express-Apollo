const babel = require('@babel/core');
const crypto = require('crypto');
const UglifyJS = require('uglify-es');

const serviceWorkerTransformer = content =>
  new Promise((resolve, reject) => {
    // Create a Cache buster Here
    let str = content.toString();
    const hash = crypto
      .createHash('md5')
      .update(str)
      .digest('hex');

    const assetCache = `assets-v${hash}`;
    const dynamicCache = `dynamic-v${hash}`;
    str = str
      .replace(
        "const ASSET_CACHE = 'assets-v1';",
        `const ASSET_CACHE = '${assetCache}';`
      )
      .replace(
        "const DYNAMIC_CACHE = 'dynamic-v1';",
        `const DYNAMIC_CACHE = '${dynamicCache}';`
      );
    babel.transform(
      str,
      { minified: true, envName: 'client' },
      (err, { code }) => {
        if (err) return reject(err);
        // return resolve(code);
        const result = UglifyJS.minify(code);
        return resolve(result.code);
      }
    );
  });

module.exports = serviceWorkerTransformer;
