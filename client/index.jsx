/* eslint-env browser */
import React from 'react';
import ReactDOM from 'react-dom';
import { loadComponents } from 'loadable-components';
import swUrl from './sw.js';
import App from './App';

const rootElement = document.getElementById('root');

const render = element => {
  let promise = Promise.resolve();
  if ('serviceWorker' in navigator) {
    console.log(swUrl);
    promise = promise.then(() => navigator.serviceWorker.register(swUrl));
  }
  return promise.then(() =>
    Promise.all([loadComponents()]).then(() => {
      ReactDOM.hydrate(<App />, element);
    })
  );
};

render(rootElement);

export default render;
