import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import potrace from 'potrace';
import uuidV4 from 'uuid/v4';
import logger from '../../../../logger';

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

const DataURI = require('datauri').promise;

class ResolveAfterCount {
  constructor(count, resolve, reject) {
    this.count = count;
    this.resolve = resolve;
    this.reject = reject;
    this.items = [];
    this.errors = [];
    this.resolves = [];
  }
  addItem(item) {
    this.items.push(item);
    this.errors.push(undefined);
    this.attemptCallback();
  }

  attemptCallback() {
    if (this.items.length >= this.count) {
      if (this.items.every(value => value === undefined))
        return this.reject(this.errors);
      this.resolves.forEach(resolve => {
        resolve(this.items);
      });
      this.resolve(this.items);
    }
  }

  addError(error) {
    this.errors.push(error);
    this.items.push(undefined);
    this.attemptCallback();
  }

  addCallbacks(...callbacks) {
    callbacks.forEach(callback => {
      this.callbacks.push(callback);
    });
  }
}

const { promisify } = require('util');

const unlinkAsync = promisify(fs.unlink);
const lstatAsync = promisify(fs.lstat);

const mkdirAsync = promisify(fs.mkdir);

export const uploadDir = path.join(process.cwd(), 'uploads');
const dirExists = async path => {
  try {
    const stats = await lstatAsync(path);
    return stats.isDirectory();
  } catch (e) {
    return false;
  }
};
export const createUploadDir = async dir => {
  try {
    if (!(await dirExists(dir))) {
      await mkdirAsync(dir);
    }
  } catch (e) {
    //
  }
  return undefined;
};

// createUploadDir(uploadDir);

const storeFS = ({ stream, filename, id = uuidV4() }) => {
  const url = `/${id}-${filename}`;
  const filepath = `${uploadDir}${url}`;
  return new Promise((resolve, reject) =>
    stream
      .on('error', async error => {
        if (stream.truncated)
          // Delete the truncated file
          await unlinkAsync(filepath);
        reject(error);
      })
      .pipe(fs.createWriteStream(filepath))
      .on('error', reject)
      .on('finish', () => resolve({ id, url, filepath }))
  );
};

export const createAlternateImageSizes = (
  { stream, id, sizes, filename, ...data },
  db
) => {
  if (!sizes.length) return Promise.resolve({ images: [] });

  // return Promise.reject();
  const pipeline = sharp().sharpen();
  return new Promise(async (resolve, reject) => {
    const resolveAfter = new ResolveAfterCount(
      sizes.length,
      images => resolve({ images }),
      reject
    );
    try {
      await sizes.forEach(async width => {
        const fileDir = path.join(uploadDir, '' + width);
        await createUploadDir(fileDir);
        const url = `/${id}-${filename}`;
        const filepath = `${fileDir}${url}`;
        const sizeId = uuidV4();
        const transformStream = pipeline.clone().resize(width);

        transformStream
          .on('error', async error => {
            if (transformStream.truncated)
              // Delete the truncated file
              await unlinkAsync(filepath);
            resolveAfter.addError(error);
            logger.error(error);
          })
          .pipe(fs.createWriteStream(filepath))
          .on('finish', async () => {
            const { height } = await sharp(filepath).metadata();
            const dataUri = await DataURI(filepath);
            const file = await db.models.File.create({
              id: sizeId,
              path: filepath,
              url,
              dataUri,
              filename,
              height,
              width,
              ...data
            });
            resolveAfter.addItem(file.toJSON());
          });
      });
      stream.pipe(pipeline).on('error', reject);
      // .on('finish', resolve);
    } catch (e) {
      reject(e);
    }

    // finalStream.on('finish', () => {
    //   resolve({ images });
    // });
  });
};

const storeDB = async (file, db) => {
  const instance = await db.models.File.create(file);
  return instance.toJSON();
};

export const processFile = async (upload, context) => {
  await createUploadDir(uploadDir);
  const { stream, filename, mimetype, encoding } = await upload;
  const { id, filepath, url } = await storeFS({ stream, filename });
  return storeDB(
    { id, filename, mimetype, encoding, path: filepath, url },
    context
  );
};

export const processImage = async (upload, sizes, context) => {
  await createUploadDir(uploadDir);
  const id = uuidV4();
  const { stream, filename, mimetype, encoding } = await upload;

  const { filepath, url } = await storeFS({ stream, filename, id });
  const dataUri = await DataURI(filepath);
  const [{ width, height }, svg] = await Promise.all([
    sharp(filepath).metadata(),
    createSvg(filepath)
  ]);
  const svgDataUri = await optimize(svg);
  await storeDB(
    {
      id,
      url,
      filename,
      svg: svgDataUri,
      mimetype,
      width,
      height,
      dataUri,
      encoding,
      path: filepath
    },
    context
  );
  const rs = fs.createReadStream(filepath);
  await createAlternateImageSizes(
    { stream: rs, id, sizes, filename, mimetype, encoding },
    context
  );
};
