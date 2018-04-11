/* eslint-env browser */
const AirbrakeClient =
  typeof window.airbrakeJs === 'undefined'
    ? require('airbrake-js')
    : window.airbrakeJs.Client;

const airbrake = new AirbrakeClient({
  projectId: process.env.AIRBRAKE_ID,
  projectKey: process.env.AIRBRAKE_KEY
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
  info: (...args) => Promise.resolve(console.info(...args))
};

export default logger;
