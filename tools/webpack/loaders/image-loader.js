/* eslint-disable no-console */
// const path = require('path');
const fs = require('fs');

const DataURI = require('datauri');
const validateOptions = require('schema-utils');
const { getOptions, interpolateName } = require('loader-utils');

const defaultOptions = {
  emitFile: true,
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
    /"(<public-path>)([\/\d\w.-]*)"/g,
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

const resources = () => ({
  items: []
});

const counter = resources();

module.exports = function loader(content) {
  const options = Object.assign({}, defaultOptions, getOptions(this));
  if (counter.items.includes(this.resourcePath)) return '';
  counter.items.push(this.resourcePath);
  console.log(options);
  if (typeof this.query === 'string') {
    content = fs.readFileSync(this.resourcePath);
  }
  validateOptions(schema, options, 'image-loader');
  const callback = this.async();
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
      ]).then(([{ width, height, format }, svg]) => {
        let dataUri;
        if (options.dataUri) {
          const datauri = new DataURI();
          datauri.format(format, content);
          dataUri = datauri.content;
        }
        const output = JSON.stringify({
          width,
          height,
          dataUri,
          svg,
          format,
          url: createTempPath(name),
          images
        });
        const result = `module.exports = ${transformPaths(output)}`;
        callback(null, result);
      });
    })
    .catch(callback);
};

module.exports.raw = true;
