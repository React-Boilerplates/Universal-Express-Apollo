import path from 'path';
import { getOptions, interpolateName } from 'loader-utils';
import validateOptions from 'schema-utils';

const potrace = require('potrace');
const sharp = require('sharp');

const pathMaker = (outputPath, prefix) => {
  const urlPath = JSON.stringify(`${prefix}/${outputPath}`.replace('//', '/'));
  return urlPath;
};

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

    potrace.posterize(content, options, (err, svg) => {
      if (err) throw reject(err);
      resolve(
        [key, svg].concat([
          pathMaker(outputPath.replace(/\..[^.]*$/gm, '.svg'), 'trace/')
        ])
      );
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
              'img/vars/'
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

export default function(content) {
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

  return Promise.all(
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
    .then(([[key, svg, outputPath]]) => {
      // const finalOutPut = {};
      // files.forEach(([key, svg, outputPath]) => {
      //   finalOutPut[key] = outputPath;
      //   this.emitFile(outputPath, svg);
      // });

      this.emitFile(outputPath, svg);

      console.log(`{${key}: __webpack_public_path__ + ${outputPath}}`);

      callback(
        null,
        `module.exports = {${key}: __webpack_public_path__ + ${outputPath}};`
      );
    })
    .catch(callback);
  // potrace.posterize(content, options.trace, (err, svg) => {
  //   if (err) throw err;
  //   console.log(options.trace);
  //   this.emitFile(outputPath, svg);
  //   callback(null, `module.exports = ${ publicPath }; `);
  // });

  // return `export default ${ JSON.stringify(content) } `;
}

export const raw = true;
