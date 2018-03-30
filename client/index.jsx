/* eslint-env browser */
import React from 'react';
import swURL from 'sw-loader!./sw'; // eslint-disable-line
import ReactDOM from 'react-dom';
import { loadComponents } from 'loadable-components';
import App from './App';

const rootElement = document.getElementById('root');

loadComponents().then(() => {
  ReactDOM.hydrate(<App />, rootElement);
});

if ('serviceWorker' in navigator) {
  navigator.serviceWorker
    .register(swURL)
    .catch(err => console.error(err))
    .then(response => console.log(response));
}
