/* eslint-env browser */
import React from 'react';
import swURL from 'sw-loader!./sw'; // eslint-disable-line
import ReactDOM from 'react-dom';
import { loadComponents } from 'loadable-components';
import logger from './logger';
import App from './App';
// import { add, wasmBooted } from '../src/lib.rs';

// const cats = require('./style.sss');

const rootElement = document.getElementById('root');

const render = element => {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker
      .register(swURL)
      .catch(err => logger.error(err))
      .then(response => logger.log(response));
  }
  // wasmBooted.then(() => {
  //   console.log('return value was', add(2, 3));
  // });
  return loadComponents().then(() => {
    ReactDOM.hydrate(<App />, element);
  });
};

render(rootElement);

export default render;
