import logger from '../logger';

jest.mock('airbrake-js');

global.console = {
  warn: jest.fn(),
  info: jest.fn(),
  log: jest.fn(),
  error: jest.fn()
};

describe('logger', () => {
  it('should error', () => {
    logger.error('ERROR');
  });
});
