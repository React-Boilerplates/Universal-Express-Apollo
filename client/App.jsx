/* eslint-env browser */
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { ApolloProvider } from 'react-apollo';
import App from '../src/App';
import client from './client';

const amp = window.AMP;
const path = window.location.pathname;

export default () => (
  <ApolloProvider client={client}>
    <Router>
      <App path={path} amp={amp} />
    </Router>
  </ApolloProvider>
);
