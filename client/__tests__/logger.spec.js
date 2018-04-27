import logger from '../logger';

global.console = {
  warn: jest.fn(),
  info: jest.fn(),
  log: jest.fn(),
  error: jest.fn()
};

describe('logger', () => {
  jest.doMock('airbrake-js', () => {
    return class Airbrake {
      constructor(opts) {
        this.opts = opts;
      }
      notify(...args) {
        this.args = args;
      }
    };
  });
  it('should error', () => {
    logger.error('ERROR');
  });
});
