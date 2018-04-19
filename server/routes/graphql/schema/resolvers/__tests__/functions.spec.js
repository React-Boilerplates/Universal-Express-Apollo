import fs from 'fs';
import rimraf from 'rimraf';
import path from 'path';
import Sequelize from 'sequelize';
import {
  createAlternateImageSizes,
  uploadDir,
  processFile,
  processImage
} from '../functions';

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

const createDb = () => ({
  models: {
    File: {
      create: () => ({
        toJSON() {
          return {};
        }
      })
    }
  }
});

const createStream = () => fs.createReadStream(imagePath);

describe('Functions', () => {
  describe('createAlternateImageSizes', () => {
    const id = Sequelize.UUIDV4();
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
    describe('dry-run', () => {
      beforeEach(removeFolder);
      it('should create folders', () => {
        require('../functions');
      });
    });
    describe('main folder exists', () => {
      beforeEach(emptyFolder);
      it('should create folders', async () => {
        const id = Sequelize.UUIDV4();
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
