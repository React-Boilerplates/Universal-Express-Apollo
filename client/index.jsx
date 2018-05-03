/* eslint-env browser */
import React from 'react';
// import { history } from 'react-router';
import ReactDOM from 'react-dom';
import { loadComponents } from 'loadable-components';
import App from './App';

const rootElement = document.getElementById('root');

const render = element => {
  let promise = Promise.resolve();

  promise = promise.then(() =>
    Promise.all([loadComponents()]).then(() => {
      ReactDOM.hydrate(<App />, element);
    })
  );
  promise = import('./watchHistory').catch(() => Promise.resolve());
  if ('serviceWorker' in navigator) {
    promise = import('./registerServiceWorker').catch(() => Promise.resolve());
  }
  return promise;
};

render(rootElement);

export default render;
