const logger =
  typeof window === 'undefined'
    ? require('../server/logger')
    : require('../client/logger').default;

export default logger;
