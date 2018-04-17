import React from 'react';
import PropTypes from 'prop-types';
import { Switch } from 'react-router';
import { hot } from 'react-hot-loader';
import Helmet from './Helmet';
import Layout from './components/Layout';
import routes from './routes';

const cats = require('./style.sss');

// import Universal from './routes';

const App = props => (
  <Layout>
    <Helmet {...props} />
    <Switch>{routes}</Switch>
  </Layout>
);

App.propTypes = {
  a: PropTypes.bool.isRequired,
  path: PropTypes.string.isRequired
};

export default hot(module)(App);
