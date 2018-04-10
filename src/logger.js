const logger =
  typeof window === 'undefined' ? require('../server/logger') : console;

export default logger;
