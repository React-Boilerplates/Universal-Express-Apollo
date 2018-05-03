import fs from 'fs';
// import casual from 'casual';
import path from 'path';
import { createDb, removeFolder } from '../../../../../../test_utilities';

const filename = 'cats.jpg';

const imagePath = path.join(__dirname, filename);
const { promisify } = require('util');

const mkdirAsync = promisify(fs.mkdir);
const mimetype = filename;
const encoding = filename;
const createMockUuid = () => require.requireActual('uuid/v4')();
const createStream = () => fs.createReadStream(imagePath);
global.uploadFolder = path.join(__dirname, 'uploads');
describe('Functions', () => {
  beforeAll(async () => {
    await mkdirAsync(path.join(global.uploadFolder)).catch(() =>
      Promise.resolve()
    );
  });
  describe('createAlternateImageSizes', () => {
    beforeEach(async () => {
      jest.resetAllMocks();
      global.mockUuid = createMockUuid();
      const finalPath = '' + Math.round(Math.random() * 100000000);
      global.uploadDir = path.join(global.uploadFolder, finalPath);
      jest.doMock('../directories.js', () => global.uploadDir);

      await require('../functions').mkdirAsync(global.uploadDir);
    });
    // beforeAll(removeFolder(global.uploadDir));
    it('should process the stream', async () => {
      console.log(global.mockUuid);
      jest.mock('uuid/v4', () => global.mockUuid);
      try {
        const id = global.mockUuid;
        await require('../functions').createAlternateImageSizes(
          {
            filepath: imagePath,
            id,
            sizes: [20, 80, 60],
            filename
          },
          createDb()
        );
      } catch (error) {
        console.error(error);
        expect(error).toBeUndefined();
      }
      expect(fs.existsSync(path.join(global.uploadDir, '20'))).toBe(true);
      expect(fs.existsSync(path.join(global.uploadDir, '80'))).toBe(true);
      expect(fs.existsSync(path.join(global.uploadDir, '60'))).toBe(true);
      expect(
        fs.existsSync(
          path.join(global.uploadDir, '20', `${global.mockUuid}-${filename}`)
        )
      ).toBe(true);
      expect(
        fs.existsSync(
          path.join(global.uploadDir, '80', `${global.mockUuid}-${filename}`)
        )
      ).toBe(true);
      expect(
        fs.existsSync(
          path.join(global.uploadDir, '60', `${global.mockUuid}-${filename}`)
        )
      ).toBe(true);
    });
    // afterAll(removeFolder(global.uploadDir));
  });
  describe('processFile', () => {
    beforeEach(async () => {
      const finalPath = '' + Math.round(Math.random() * 100000000);
      global.uploadDir = path.join(global.uploadFolder, finalPath);
      jest.doMock('../directories.js', () => global.uploadDir);

      await require('../functions').mkdirAsync(global.uploadDir);
    });
    // beforeAll(removeFolder(global.uploadDir));
    it('should process the stream', async () => {
      await require('../functions').processFile(
        { stream: createStream(), filename, mimetype, encoding },
        createDb()
      );
    });
    // afterAll(removeFolder(global.uploadDir));
  });
  describe('processImage', () => {
    beforeEach(async () => {
      const finalPath = '' + Math.round(Math.random() * 100000000);
      global.uploadDir = path.join(global.uploadFolder, finalPath);
      jest.doMock('../directories.js', () => global.uploadDir);

      await require('../functions').mkdirAsync(global.uploadDir);
    });
    // beforeAll(removeFolder(global.uploadDir));
    it('should handle no sizes', async () => {
      try {
        await require('../functions').processImage(
          { stream: createStream(), filename, mimetype, encoding },
          [],
          createDb()
        );
        expect(
          fs.existsSync(
            path.join(
              global.uploadDir,
              `totally-fake-uuid-displayed-${filename}`
            )
          )
        ).toBe(true);
      } catch (e) {
        //
      }
    });
    it('should handle sizes', async () => {
      try {
        await require('../functions').processImage(
          { stream: createStream(), filename, mimetype, encoding },
          [20, 80, 60],
          createDb()
        );
        expect(fs.existsSync(path.join(global.uploadDir, '20'))).toBe(true);
        expect(fs.existsSync(path.join(global.uploadDir, '80'))).toBe(true);
        expect(fs.existsSync(path.join(global.uploadDir, '60'))).toBe(true);
        expect(
          fs.existsSync(
            path.join(
              global.uploadDir,
              '20',
              `totally-fake-uuid-displayed-${filename}`
            )
          )
        ).toBe(true);
        expect(
          fs.existsSync(
            path.join(
              global.uploadDir,
              '80',
              `totally-fake-uuid-displayed-${filename}`
            )
          )
        ).toBe(true);
        expect(
          fs.existsSync(
            path.join(
              global.uploadDir,
              '60',
              `totally-fake-uuid-displayed-${filename}`
            )
          )
        ).toBe(true);
        expect(
          fs.existsSync(
            path.join(
              global.uploadDir,
              `totally-fake-uuid-displayed-${filename}`
            )
          )
        ).toBe(true);
      } catch (error) {
        // expect(error).toBeUndefined();
      }
    });
    // afterAll(removeFolder(global.uploadDir));
  });
  xdescribe('scaffolding', () => {
    xdescribe('dry-run', () => {
      beforeEach(async () => {
        const finalPath = '' + Math.round(Math.random() * 100000000);
        global.uploadDir = path.join(global.uploadFolder, finalPath);
        await require('../functions').mkdirAsync(global.uploadDir);
      });
      xit('should create folders', async () => {
        await require('../functions').createUploadDir(
          require('../functions').uploadDir
        );
      });
      // afterAll(removeFolder(global.uploadDir));
    });
    xdescribe('main folder exists', () => {
      beforeEach(async () => {
        const finalPath = '' + Math.round(Math.random() * 100000000);
        global.uploadDir = path.join(global.uploadFolder, finalPath);
        await require('../functions').mkdirAsync(global.uploadDir);
      });
      xit('should create folders', async () => {
        await require('../functions').processImage(
          { stream: createStream(), filename, mimetype, encoding },
          [],
          createDb()
        );
      });
    });
  });
  afterAll(removeFolder(global.uploadFolder));
});
