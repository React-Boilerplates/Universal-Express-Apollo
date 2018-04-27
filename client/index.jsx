/* eslint-env browser */
import React from 'react';
import registerServiceWorker, { ServiceWorkerNoSupportError } from 'service-worker-loader!./sw'; // eslint-disable-line
import ReactDOM from 'react-dom';
import { loadComponents } from 'loadable-components';
import logger from './logger';
import App from './App';
// import { width } from './cats.jpg';

// console.log(width);
// import { add, wasmBooted } from '../src/lib.rs';

const rootElement = document.getElementById('root');

const render = element => {
  registerServiceWorker({ scope: '/' })
    .catch(err => {
      if (err instanceof ServiceWorkerNoSupportError) {
        logger.log('ServiceWorker is not Supported!');
      } else {
        logger.error(err);
      }
    })
    .then(response => logger.log(response));
  // wasmBooted.then(() => {
  //   console.log('return value was', add(2, 3));
  // });
  return Promise.all([loadComponents()]).then(() => {
    ReactDOM.hydrate(<App />, element);
  });
};

render(rootElement);

export default render;
