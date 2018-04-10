/* eslint-env browser */
import React from 'react';
import swURL from 'sw-loader!./sw'; // eslint-disable-line
import ReactDOM from 'react-dom';
import { loadComponents } from 'loadable-components';
import logger from './logger';
import App from './App';

const rootElement = document.getElementById('root');

const render = () => {
  loadComponents().then(() => {
    ReactDOM.hydrate(<App />, rootElement);
  });

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker
      .register(swURL)
      .catch(err => logger.error(err))
      .then(response => logger.log(response));
  }
};

export default render;

render();
