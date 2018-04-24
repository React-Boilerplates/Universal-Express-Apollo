/* eslint-disable no-console */
// const path = require('path');
const fs = require('fs');

const DataURI = require('datauri');
const validateOptions = require('schema-utils');
const { getOptions, interpolateName } = require('loader-utils');

const defaultOptions = {
  emitFile: true,
  width: undefined,
  sizeOpts: {
    dataUri: false,
    emitFile: true
  },
  svgOptimize: { multipass: true, floatPrecision: 1 },
  svgOpts: {
    threshold: 180,
    steps: 1,
    color: '#880000'
  },
  dataUri: false,
  sizes: []
};

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

const optimize = (svg, options = { multipass: true, floatPrecision: 1 }) => {
  // eslint-disable-next-line global-require
  const SVGO = require(`svgo`);
  const svgo = new SVGO(options);
  return new Promise((resolve, reject) =>
    svgo
      .optimize(svg)
      .then(({ data }) => resolve(encodeOptimizedSVGDataUri(data)))
      .catch(reject)
  );
};

const potrace = require('potrace');

const createSvg = (
  content,
  options = {
    threshold: 180,
    steps: 1,
    color: '#880000'
  }
) =>
  new Promise((resolve, reject) => {
    potrace.posterize(content, options, (err, svg) => {
      if (err) return reject(err);
      return resolve(svg);
    });
  });
const sharp = require('sharp');

const createTempPath = path => `<public-path>/${path}`;
const transformPaths = string =>
  string.replace(
    // eslint-disable-next-line no-useless-escape
    /"(<public-path>\/)([\/\d\w.-]*)"/g,
    '__webpack_public_path__ + "$2"'
  );

const schema = {
  type: 'object',
  properties: {
    sizeOpts: {
      type: 'object',
      properties: {
        dataUri: {
          type: 'boolean'
        },
        emitFile: {
          type: 'boolean'
        }
      }
    },
    svgOptimize: {
      type: 'object',
      properties: {
        multipass: {
          type: 'boolean'
        },
        floatPrecision: {
          type: 'number'
        }
      }
    },
    width: {
      type: 'string'
    },
    svgOpts: {
      type: 'object',
      properties: {
        threshold: {
          type: 'number'
        },
        steps: {
          type: 'number'
        },
        color: {
          type: 'string'
        }
      }
    },
    dataUri: {
      type: 'boolean'
    },
    sizes: {
      type: 'array',
      properties: {}
    },
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

const checkIfInlineIsOption = context => {
  const count = context.loaders
    .map((value, index) => Object.assign({}, value, { index }))
    .filter(({ path }) => /tools\/webpack\/loaders\/image-loader/g.test(path));
  if (count.length <= 1) return true;
  const inlineVersion = count.find(
    ({ options }) => typeof options === 'string'
  );
  if (
    count.length >= 2 &&
    inlineVersion &&
    context.loaderIndex === inlineVersion.index
  ) {
    return true;
  }
  return false;
};

module.exports = async function loader(content) {
  const callback = this.async();
  try {
    if (!checkIfInlineIsOption(this)) return callback(null, '');
    // console.log(this.loaders, this.loaderIndex);
    const options = Object.assign({}, defaultOptions, getOptions(this));

    if (typeof this.query === 'string') {
      content = fs.readFileSync(this.resourcePath);
    }
    if (options.width) {
      content = await sharp(content)
        .resize(options.width)
        .toBuffer();
    }
    validateOptions(schema, options, 'image-loader');

    return Promise.all(
      options.sizes.map(size => {
        return Promise.all([
          sharp(content)
            .resize(+size)
            .toBuffer(),
          sharp(content)
            .resize(+size)
            .metadata()
        ]).then(([buffer, { width, height, format }]) => {
          let dataUri;
          const name = interpolateName(this, `${size}/[hash:8]-[name].[ext]`, {
            content: buffer
          });
          if (options.sizeOpts.dataUri) {
            const datauri = new DataURI();
            datauri.format(format, buffer);
            dataUri = datauri.content;
          }
          if (options.sizeOpts.emitFile) {
            this.emitFile(name, buffer);
          }
          return {
            width,
            height,
            format,
            dataUri,
            url: createTempPath(name)
          };
        });
      })
    )
      .then(images => {
        const name = interpolateName(this, `[hash:8]-[name].[ext]`, {
          content
        });
        if (options.emitFile) {
          this.emitFile(name, content);
        }
        return Promise.all([
          sharp(content).metadata(),
          options.svgOpts.dataUri
            ? createSvg(content, options.svgOpts).then(svg =>
                optimize(svg, options.svgOptimize)
              )
            : Promise.resolve()
        ]).then(async ([{ width, height, format }, svg]) => {
          let dataUri;
          if (options.dataUri) {
            const datauri = new DataURI();
            const inline = await sharp(content)
              .resize(20)
              .jpeg()
              .toBuffer();
            datauri.format('jpeg', inline);
            dataUri = datauri.content;
          }
          const output =
            `` +
            Object.entries({
              width,
              height,
              dataUri,
              svg,
              format,
              url: createTempPath(name),
              images
            })
              .filter(value => value[1] !== undefined)
              .map(
                ([key, value]) =>
                  `
export const ${key} = ${JSON.stringify(value)};`
              )
              .join('');
          const result = transformPaths(output);
          console.log(result);
          return callback(null, result);
        });
      })
      .catch(err => {
        console.error(err);
        return callback(err);
      });
  } catch (e) {
    return callback(e);
  }
};

module.exports.raw = true;
