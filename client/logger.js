/* eslint-env browser */
/* eslint-disable no-console */
const AirbrakeClient =
  typeof window === 'undefined' || typeof window.airbrakeJs === 'undefined'
    ? require('airbrake-js')
    : window.airbrakeJs.Client;

const airbrake = new AirbrakeClient({
  projectId: process.env.AIRBRAKE_ID || 123,
  projectKey: process.env.AIRBRAKE_KEY || 'abc'
});

const PROD = process.env.NODE_ENV === 'production';

const logger = {
  error: (error, ...info) =>
    PROD
      ? airbrake.notify({
          error,
          params: { info }
        })
      : Promise.resolve(console.error(error, ...info)),
  log: (...args) => Promise.resolve(console.log(...args)),
  info: (...args) => Promise.resolve(console.info(...args))
};

export default logger;
