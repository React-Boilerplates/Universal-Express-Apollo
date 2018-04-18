const path = require('path');
const validateOptions = require('schema-utils');
const { getOptions, interpolateName } = require('loader-utils');

const potrace = require('potrace');
const sharp = require('sharp');

const pathMaker = (outputPath, prefix, ...options) => {
  const urlPath = JSON.stringify(
    `${prefix}/${options.join('-')}-${outputPath}`.replace('//', '/')
  );
  return urlPath;
};

const optimize = (svg, options = { multipass: true, floatPrecision: 2 }) => {
  // eslint-disable-next-line global-require
  const SVGO = require(`svgo`);
  const svgo = new SVGO(options);
  return new Promise((resolve, reject) =>
    svgo
      .optimize(svg)
      .then(({ data }) => resolve(data))
      .catch(reject)
  );
};

const createPublicPath = outputPath =>
  ` __webpack_public_path__ + ${outputPath}`;

const promisePotrace = (key, content, options, url, context) =>
  new Promise((resolve, reject) => {
    let outputPath = url;

    if (context.outputPath) {
      if (typeof context.outputPath === 'function') {
        outputPath = context.outputPath(url);
      } else {
        outputPath = path.posix.join(context.outputPath, url);
      }
    }

    const filepath = pathMaker(
      outputPath.replace(/\..[^.]*$/gm, '.svg'),
      'trace/',
      'vector'
    );

    return potrace.posterize(content, options, (err, svg) => {
      if (err) return reject(err);
      if (options.optimize) {
        return optimize(svg, options.optimize).then(result => {
          resolve([key, result].concat([filepath]));
        });
      }
      return resolve([key, svg].concat([filepath]));
    });
  });

function encodeOptimizedSVGDataUri(svgString) {
  const uriPayload = encodeURIComponent(svgString) // encode URL-unsafe characters
    .replace(/%0A/g, ``) // remove newlines
    .replace(/%20/g, ` `) // put spaces back in
    .replace(/%3D/g, `=`) // ditto equals signs
    .replace(/%3A/g, `:`) // ditto colons
    .replace(/%2F/g, `/`) // ditto slashes
    .replace(/%22/g, `'`); // replace quotes with apostrophes (may break certain SVGs)

  return `data:image/svg+xml,${uriPayload}`;
}

const potraceToDataUri = (content, options) =>
  new Promise((resolve, reject) => {
    potrace.posterize(content, options, (err, svg) => {
      if (err) return reject(err);

      if (options.optimize) {
        return optimize(svg, options.optimize)
          .then(data => {
            const string = encodeOptimizedSVGDataUri(data);
            resolve(string);
          })
          .catch(error => {
            console.log(error);
            reject(error);
          });
      }
      return resolve(encodeOptimizedSVGDataUri(svg));
    });
  });

const promiseSharp = (key, content, options, url, context) =>
  new Promise((resolve, reject) => {
    let result = sharp(content);

    let outputPath = url;

    if (context.outputPath) {
      if (typeof context.outputPath === 'function') {
        outputPath = context.outputPath(url);
      } else {
        outputPath = path.posix.join(context.outputPath, url);
      }
    }
    if (options.size) result = result.resize(options.size);
    return result
      .toBuffer()
      .then(data =>
        resolve(
          [key, data.toString()].concat([
            pathMaker(
              outputPath.replace(/\..[^.]*$/gm, options.fileType),
              'img/vars/',
              options.size
            )
          ])
        )
      )
      .catch(reject);
  });

const schema = {
  type: 'object',
  properties: {
    name: {},
    regExp: {},
    context: {
      type: 'string'
    },
    publicPath: {},
    outputPath: {},
    useRelativePath: {
      type: 'boolean'
    },
    emitFile: {
      type: 'boolean'
    }
  },
  additionalProperties: true
};

module.exports = function loader(content) {
  const options = getOptions(this);
  validateOptions(schema, options, 'Image Loader');
  const callback = this.async();
  this.addDependency('potrace');
  // console.log(this);
  const context =
    options.context ||
    this.rootContext ||
    (this.options && this.options.context);

  const url = interpolateName(this, options.name, {
    context,
    content,
    regExp: options.regExp
  });

  Promise.all(
    [
      options.trace &&
        promisePotrace('trace', content, options.trace, url, options)
    ].concat(
      options.sizes
        ? options.sizes.map(option =>
            promiseSharp(option.size, content, option, url, options)
          )
        : []
    )
  )
    .then(results =>
      potraceToDataUri(content, options.trace).then(() => {
        const filesString = results
          .map(([key, data, outputPath]) => {
            if (options.emitFile) this.emitFile(JSON.parse(outputPath), data);
            return `${key}:${createPublicPath(outputPath)}`;
          })
          .join(',');

        callback(null, `module.exports = {${filesString}};`);
      })
    )
    .catch(callback);
  // potrace.posterize(content, options.trace, (err, svg) => {
  //   if (err) throw err;
  //   console.log(options.trace);
  //   this.emitFile(outputPath, svg);
  //   callback(null, `module.exports = ${ publicPath }; `);
  // });

  // return `export default ${ JSON.stringify(content) } `;
};

module.exports.raw = true;
