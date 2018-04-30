import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
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
) => {
  // eslint-disable-next-line global-require
  const potrace = require('potrace');
  return new Promise((resolve, reject) => {
    potrace.posterize(content, options, (err, svg) => {
      if (err) return reject(err);
      return resolve(svg);
    });
  });
};

const DataURI = require('datauri');

const { promisify } = require('util');

const unlinkAsync = promisify(fs.unlink);
const lstatAsync = promisify(fs.lstat);

const mkdirAsync = promisify(fs.mkdir);

export const uploadDir = path.join(process.cwd(), 'uploads');
const dirExists = async dirPath => {
  await mkdirAsync(uploadDir).catch(() => Promise.resolve());
  try {
    const stats = await lstatAsync(dirPath);
    return stats.isDirectory();
  } catch (e) {
    //
    return Promise.resolve(false);
  }
};
export const createUploadDir = async dir => {
  await mkdirAsync(uploadDir).catch(() => Promise.resolve());
  try {
    if (!(await dirExists(dir))) {
      await mkdirAsync(dir);
    }
    return undefined;
  } catch (e) {
    //
    return Promise.resolve(undefined);
  }
};

// createUploadDir(uploadDir);

const storeFS = ({ stream, filename, id = uuidV4() }) => {
  const url = `/${id}-${filename}`;
  const filepath = `${uploadDir}${url}`;
  const writeStream = fs.createWriteStream(filepath);
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      // console.log('Error in storeFS!');
      reject(new Error('Process was taking too long!!'));
    }, 4800);
    stream
      .on('error', async error => {
        if (stream.truncated) {
          try {
            // Delete the truncated file
            await unlinkAsync(filepath);
          } catch (e) {
            return reject(e);
          }
        }
        reject(error);
      })
      .pipe(writeStream)
      .on('error', reject)
      .on('finish', () => {
        clearTimeout(timeout);
        resolve({ id, url, filepath });
      });
  });
};

export const createAlternateImageSizes = (
  { filepath, id, sizes, filename, ...data },
  db
) => {
  if (!sizes.length) return Promise.resolve({ images: [] });

  // return Promise.reject();
  const pipeline = sharp().sharpen();
  return new Promise(async (resolve, reject) => {
    try {
      const images = await Promise.all(
        sizes.map(async width => {
          const fileDir = path.join(uploadDir, '' + width);
          await createUploadDir(fileDir);
          return new Promise((resolve, reject) => {
            const stream = fs.createReadStream(filepath);
            const url = `/${id}-${filename}`;
            const newFilePath = `${fileDir}${url}`;
            const writeStream = fs.createWriteStream(newFilePath);
            const sizeId = uuidV4();
            const transformStream = pipeline.resize(width);
            const errorFn = async err => {
              // try {
              //   return Promise.reject(err);
              // } catch (error) {
              //   return Promise.reject(error);
              // }
              return reject(err);
            };
            writeStream.on('error', errorFn);
            stream.on('error', errorFn);
            transformStream
              .on('error', async err => {
                try {
                  if (transformStream.truncated)
                    // Delete the truncated file
                    await unlinkAsync(newFilePath);
                  logger.error(err);
                  return reject(err);
                } catch (error) {
                  logger.error(error);
                  return reject(error);
                }
              })
              .pipe(writeStream)
              .on('finish', async () => {
                try {
                  const { height } = await sharp(newFilePath).metadata();
                  const file = await db.models.File.create({
                    id: sizeId,
                    path: newFilePath,
                    url,
                    filename,
                    height,
                    width,
                    ...data
                  });
                  return resolve(file.toJSON());
                } catch (error) {
                  // console.error(error);
                  return reject(error);
                }
              });
            stream.pipe(pipeline).on('error', reject);
          });
        })
      );
      resolve(images);
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
  try {
    const instance = await db.models.File.create(file);
    return instance.toJSON();
  } catch (error) {
    logger.log(error);
    return new Error('ERROR Saving!');
  }
};

export const processFile = async (upload, context) => {
  try {
    await createUploadDir(uploadDir);
    const { stream, filename, mimetype, encoding } = await upload;
    const { id, filepath, url } = await storeFS({ stream, filename });
    return storeDB(
      { id, filename, mimetype, encoding, path: filepath, url },
      context
    );
  } catch (error) {
    logger.log(error);
    return;
  }
};

export const processImage = async (upload, sizes, context) => {
  try {
    await createUploadDir(uploadDir);
    const id = await uuidV4();
    const { stream, filename, mimetype, encoding } = await upload;

    const { filepath, url } = await storeFS({ stream, filename, id });
    const dataURI = await new DataURI();

    const [{ width, height }, svg, dataUriBuffer] = await Promise.all([
      sharp(filepath).metadata(),
      createSvg(filepath).then(optimize),
      sharp(filepath)
        .resize(10)
        .jpeg()
        .toBuffer()
    ]);
    dataURI.format('.jpeg', dataUriBuffer);
    const dataUri = dataURI.content;
    await storeDB(
      {
        id,
        url,
        filename,
        svg,
        mimetype,
        width,
        height,
        dataUri,
        encoding,
        path: filepath
      },
      context
    );

    await createAlternateImageSizes(
      { filepath, id, sizes, filename, mimetype, encoding },
      context
    );
    return Promise.resolve();
  } catch (e) {
    //
    logger.log(e);
    return Promise.resolve();
  }
};
