/* eslint-env browser */
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ApolloProvider } from 'react-apollo';
import createStore from '../src/createStore';
import App from '../src/App';
import client from './client';

const amp = window.AMP;
const path = window.location.pathname;
const state = window.__REDUX__; // eslint-disable-line no-underscore-dangle

export default () => (
  <ApolloProvider client={client}>
    <Provider store={createStore(state)}>
      <Router>
        <App path={path} a={amp} />
      </Router>
    </Provider>
  </ApolloProvider>
);
