import fs from 'fs';
// import casual from 'casual';
import path from 'path';
import uuidV4 from 'uuid/v4';
import { createDb } from '../../../../../../test_utilities';

// process.cwd = () => path.resolve('./');
const {
  createAlternateImageSizes,
  uploadDir,
  processFile,
  processImage
} = require('../functions');

const filename = 'cats.jpg';

const imagePath = path.join(__dirname, filename);

const mimetype = filename;
const encoding = filename;

const createStream = () => fs.createReadStream(imagePath);

describe('Functions', () => {
  describe('createAlternateImageSizes', () => {
    // beforeAll(removeFolder(uploadDir));
    it('should process the stream', async () => {
      try {
        const id = uuidV4();
        await createAlternateImageSizes(
          {
            filepath: imagePath,
            id,
            sizes: [20, 80, 60],
            filename
          },
          createDb()
        );
        expect(fs.existsSync(path.join(uploadDir, '20'))).toBe(true);
        expect(fs.existsSync(path.join(uploadDir, '80'))).toBe(true);
        expect(fs.existsSync(path.join(uploadDir, '60'))).toBe(true);
        expect(
          fs.existsSync(
            path.join(
              uploadDir,
              '20',
              `totally-fake-uuid-displayed-${filename}`
            )
          )
        ).toBe(true);
        expect(
          fs.existsSync(
            path.join(
              uploadDir,
              '80',
              `totally-fake-uuid-displayed-${filename}`
            )
          )
        ).toBe(true);
        expect(
          fs.existsSync(
            path.join(
              uploadDir,
              '60',
              `totally-fake-uuid-displayed-${filename}`
            )
          )
        ).toBe(true);
      } catch (error) {
        expect(error).toBeUndefined();
      }
    });
    // afterAll(removeFolder(uploadDir));
  });
  describe('processFile', () => {
    // beforeAll(removeFolder(uploadDir));
    it('should process the stream', async () => {
      await processFile(
        { stream: createStream(), filename, mimetype, encoding },
        createDb()
      );
    });
    // afterAll(removeFolder(uploadDir));
  });
  describe('processImage', () => {
    // beforeAll(removeFolder(uploadDir));
    it('should handle no sizes', async () => {
      await processImage(
        { stream: createStream(), filename, mimetype, encoding },
        [],
        createDb()
      );
      expect(
        fs.existsSync(
          path.join(uploadDir, `totally-fake-uuid-displayed-${filename}`)
        )
      ).toBe(true);
    });
    it('should handle sizes', async () => {
      try {
        await processImage(
          { stream: createStream(), filename, mimetype, encoding },
          [20, 80, 60],
          createDb()
        );
        expect(fs.existsSync(path.join(uploadDir, '20'))).toBe(true);
        expect(fs.existsSync(path.join(uploadDir, '80'))).toBe(true);
        expect(fs.existsSync(path.join(uploadDir, '60'))).toBe(true);
        expect(
          fs.existsSync(
            path.join(
              uploadDir,
              '20',
              `totally-fake-uuid-displayed-${filename}`
            )
          )
        ).toBe(true);
        expect(
          fs.existsSync(
            path.join(
              uploadDir,
              '80',
              `totally-fake-uuid-displayed-${filename}`
            )
          )
        ).toBe(true);
        expect(
          fs.existsSync(
            path.join(
              uploadDir,
              '60',
              `totally-fake-uuid-displayed-${filename}`
            )
          )
        ).toBe(true);
        expect(
          fs.existsSync(
            path.join(uploadDir, `totally-fake-uuid-displayed-${filename}`)
          )
        ).toBe(true);
      } catch (error) {
        expect(error).toBeUndefined();
      }
    });
    // afterAll(removeFolder(uploadDir));
  });
  xdescribe('scaffolding', () => {
    xdescribe('dry-run', () => {
      // beforeAll(removeFolder(uploadDir));
      xit('should create folders', async () => {
        await require('../functions').createUploadDir(
          require('../functions').uploadDir
        );
      });
      // afterAll(removeFolder(uploadDir));
    });
    xdescribe('main folder exists', () => {
      // beforeAll(emptyFolder(uploadDir));
      // afterAll(removeFolder(uploadDir));
      xit('should create folders', async () => {
        await processImage(
          { stream: createStream(), filename, mimetype, encoding },
          [],
          createDb()
        );
      });
    });
  });
});
