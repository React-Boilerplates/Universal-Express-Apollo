import fs from 'fs';
import rimraf from 'rimraf';
import casual from 'casual';
import path from 'path';
import { createDb } from '../../../../../../test_utilities';

process.cwd = () => path.resolve('./');
const {
  createAlternateImageSizes,
  uploadDir,
  processFile,
  processImage
} = require('../functions');

const removeFolder = done => {
  rimraf(uploadDir, () => {
    fs.mkdir(uploadDir, () => {
      done();
    });
  });
};

const emptyFolder = done => {
  rimraf(uploadDir, () => {
    fs.mkdir(uploadDir, () => {
      done();
    });
  });
};

const filename = 'cats.jpg';

const imagePath = path.join(__dirname, filename);

const mimetype = filename;
const encoding = filename;

const createStream = () => fs.createReadStream(imagePath);

describe('Functions', () => {
  describe('createAlternateImageSizes', () => {
    const id = casual.uuid;
    it('should process the stream', async () => {
      await createAlternateImageSizes(
        {
          stream: createStream(),
          id,
          sizes: [20, 80, 60],
          filename
        },
        createDb()
      );
    });
    afterAll(done => {
      removeFolder(done);
    });
  });
  describe('processFile', () => {
    it('should process the stream', async () => {
      await processFile(
        { stream: createStream(), filename, mimetype, encoding },
        createDb()
      );
    });
    afterAll(done => {
      removeFolder(done);
    });
  });
  describe('processImage', () => {
    it('should process the stream', async () => {
      await processImage(
        { stream: createStream(), filename, mimetype, encoding },
        [],
        createDb()
      );
    });
    afterAll(done => {
      removeFolder(done);
    });
  });
  describe('scaffolding', () => {
    xdescribe('dry-run', () => {
      beforeAll(removeFolder);
      it('should create folders', () => {
        require('../functions');
      });
    });
    xdescribe('main folder exists', () => {
      beforeAll(emptyFolder);
      it('should create folders', async () => {
        const id = casual.uuid;

        await createAlternateImageSizes(
          {
            stream: createStream(),
            id,
            sizes: [20, 80, 60],
            filename
          },
          createDb()
        );
      });
    });
  });
});
