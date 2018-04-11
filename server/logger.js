/* eslint-env browser */
const AirbrakeClient = require('airbrake-js');
const winston = require('winston');

const airbrake = new AirbrakeClient({
  projectId: process.env.AIRBRAKE_ID || 123,
  projectKey: process.env.AIRBRAKE_KEY || 'abc'
});

const Console = new winston.Logger({
  transports: [
    new winston.transports.File({
      level: 'info',
      filename: './logs/all-logs.log',
      handleExceptions: true,
      json: true,
      maxsize: 5242880, // 5MB
      maxFiles: 5,
      colorize: false
    }),
    new winston.transports.Console({
      level: 'debug',
      handleExceptions: true,
      json: false,
      colorize: true
    })
  ],
  exitOnError: false
});

const logger = {
  error: (error, ...info) =>
    process.env.NODE_ENV === 'production'
      ? airbrake.notify({
          error,
          params: { info }
        })
      : Promise.resolve(console.error(error, ...info)),
  log: (...args) => Promise.resolve(console.log(...args)),
  info: (...args) => Promise.resolve(console.info(...args)),
  stream: {
    write: message => {
      Console.info(message);
    }
  }
};

module.exports = logger;
