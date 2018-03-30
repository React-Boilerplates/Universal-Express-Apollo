/* eslint-env browser */
import React from 'react';
import ReactDOM from 'react-dom';
import { loadComponents } from 'loadable-components';
import App from './App';

const rootElement = document.getElementById('root');

loadComponents().then(() => {
  ReactDOM.hydrate(<App />, rootElement);
});
