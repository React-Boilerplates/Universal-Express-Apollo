const logger = require('../../logger').default;

const errorReportingService = (error, info) => {
  logger.log(error);
  logger.log(info);
};

export default errorReportingService;
