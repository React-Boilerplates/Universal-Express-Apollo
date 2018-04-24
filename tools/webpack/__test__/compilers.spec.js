// import path from 'path';
import compiler from './compiler';

describe('Production', () => {
  describe('Server', () => {
    it('should build without an error', async () => {
      try {
        const prodServerConfig = require('../production.server');
        const [stats] = await compiler(prodServerConfig);
        expect(stats).toBeDefined();
      } catch (e) {
        expect(e).toBeUndefined();
      }
    });
  });
  describe('Client', () => {
    it('should build without an error', async () => {
      try {
        const prodClientConfig = require('../production.client');
        const [stats] = await compiler(prodClientConfig);
        // console.log(fs.readdirSync(path.join('/')));
        expect(stats).toBeDefined();
      } catch (e) {
        expect(e).toBeUndefined();
      }
    });
  });
});

describe('Development', () => {
  describe('Server', () => {
    it('should build without an error', async () => {
      try {
        const prodServerConfig = require('../development.server');
        const [stats] = await compiler(prodServerConfig);
        expect(stats).toBeDefined();
      } catch (e) {
        expect(e).toBeUndefined();
      }
    });
  });
  describe('Client', () => {
    it('should build without an error', async () => {
      try {
        const prodClientConfig = require('../development.client');
        const [stats] = await compiler(prodClientConfig);
        expect(stats).toBeDefined();
      } catch (e) {
        expect(e).toBeUndefined();
      }
    });
  });
});

describe('Testing', () => {
  it('should build without an error', async () => {
    try {
      const testingBase = require('../base.testing');
      const [stats] = await compiler(testingBase);
      expect(stats).toBeDefined();
    } catch (e) {
      expect(e).toBeUndefined();
    }
  });
});
