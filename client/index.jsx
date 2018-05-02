/* eslint-env browser */
import React from 'react';
// import { history } from 'react-router';
import ReactDOM from 'react-dom';
import { loadComponents } from 'loadable-components';
import App from './App';

const swUrl = '/sw.js';
const rootElement = document.getElementById('root');

const render = element => {
  let promise = import('./watchHistory').catch(() => Promise.resolve());
  if ('serviceWorker' in navigator) {
    promise = promise.then(() => {
      const result = navigator.serviceWorker
        .register(swUrl)
        .then(console.log)
        .catch(() => Promise.resolve());
      return result;
    });
  }

  return promise.then(() =>
    Promise.all([loadComponents()]).then(() => {
      ReactDOM.hydrate(<App />, element);
    })
  );
};

render(rootElement);

export default render;
