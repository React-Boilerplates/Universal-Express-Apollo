import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import Sequelize from 'sequelize';
import logger from '../../../../logger';

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
const createUploadDir = async dir => {
  try {
    if (!(await dirExists(dir))) {
      await mkdirAsync(dir);
    }
  } catch (e) {
    //
  }
  return undefined;
};

createUploadDir(uploadDir);

const storeFS = ({ stream, filename }) => {
  const id = Sequelize.UUIDV4();
  const filepath = `${uploadDir}/${id}-${filename}`;
  return new Promise((resolve, reject) =>
    stream
      .on('error', async error => {
        if (stream.truncated)
          // Delete the truncated file
          await unlinkAsync(filepath);
        reject(error);
      })
      .pipe(fs.createWriteStream(filepath))
      .on('error', error => reject(error))
      .on('finish', () => resolve({ id, filepath }))
  );
};

export const createAlternateImageSizes = (
  { stream, id, sizes, filename, ...data },
  db
) => {
  if (!sizes.length) return Promise.resolve({ images: [] });

  // return Promise.reject();
  const pipeline = sharp().sharpen();
  const images = [];
  return new Promise(async (resolve, reject) => {
    await sizes.forEach(async width => {
      const fileDir = path.join(uploadDir, '' + width);
      await createUploadDir(fileDir);
      const filepath = `${fileDir}/${id}-${filename}`;
      const sizeId = Sequelize.UUIDV4();
      let height;
      const transformStream = pipeline
        .clone()
        .resize(width)
        .on('info', info => {
          height = info.height;
        });

      transformStream
        .on('error', async error => {
          if (stream.truncated)
            // Delete the truncated file
            await unlinkAsync(filepath);
          logger.error(error);
        })
        .pipe(fs.createWriteStream(filepath))
        .on('finish', async () => {
          const file = await db.models.File.create({
            id: sizeId,
            path: filepath,
            filename,
            height,
            width,
            ...data
          });
          images.push(file.toJSON());
        })
        .on('error', async error => {
          if (stream.truncated)
            // Delete the truncated file
            await unlinkAsync(filepath);
          logger.error(error);
        });
    });
    const finalStream = stream.pipe(pipeline);
    finalStream.on('finish', () => {
      resolve({ images });
    });
    finalStream.on('error', error => {
      logger.error(error);
      reject(error);
    });
  });
};

const storeDB = async (file, db) => {
  const instance = await db.models.File.create(file);
  return instance.toJSON();
};

export const processFile = async (upload, context) => {
  createUploadDir(uploadDir);
  const { stream, filename, mimetype, encoding } = await upload;
  const { id, filepath } = await storeFS({ stream, filename });
  return storeDB({ id, filename, mimetype, encoding, path: filepath }, context);
};

export const processImage = async (upload, sizes, context) => {
  createUploadDir(uploadDir);
  const { stream, filename, mimetype, encoding } = await upload;

  const { id, filepath } = await storeFS({ stream, filename });
  const { width, height } = sharp(filepath).metadata();
  await storeDB(
    { id, filename, mimetype, width, height, encoding, path: filepath },
    context
  );
  await createAlternateImageSizes(
    { stream, id, sizes, filename, mimetype, encoding },
    context
  );
};
