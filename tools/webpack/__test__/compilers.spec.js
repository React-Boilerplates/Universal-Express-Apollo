// import path from 'path';
import compiler from './compiler';

describe('Production', () => {
  process.env.NODE_ENV = 'production';
  describe('Server', () => {
    process.env.BABEL_ENV = 'server:prod';
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
    process.env.BABEL_ENV = 'client:prod';
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
  process.env.NODE_ENV = 'development';
  describe('Server', () => {
    process.env.BABEL_ENV = 'server';
    it('should build without an error', async () => {
      try {
        const serverConfig = require('../development.server');
        const [stats] = await compiler(serverConfig);
        expect(stats).toBeDefined();
      } catch (e) {
        expect(e).toBeUndefined();
      }
    });
  });
  describe('Client', () => {
    process.env.BABEL_ENV = 'client';
    it('should build without an error', async () => {
      try {
        const clientConfig = require('../development.client');
        const [stats] = await compiler(clientConfig);
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
