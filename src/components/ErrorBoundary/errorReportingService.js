const logger = require('../../logger').default;

const errorReportingService = (error, info) => logger.log(error, info);

export default errorReportingService;
