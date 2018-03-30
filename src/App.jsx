import React from 'react';
// import PropTypes from 'prop-types';
import { Switch } from 'react-router';
import { hot } from 'react-hot-loader';
import { Helmet } from 'react-helmet';
import Layout from './components/Layout';
import routes from './routes';

// import Universal from './routes';

const App = () => (
  <Layout>
    <Helmet titleTemplate="%s | BoilerPlate">
      <meta charSet="utf-8" />
      <meta name="rating" content="General" />
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1, shrink-to-fit=no"
      />
      <title>My Title</title>
      <link rel="canonical" href="http://mysite.com/example" />
      <link rel="stylesheet" href="/assets/styles.css" />
    </Helmet>
    <Switch>{routes}</Switch>
  </Layout>
);

App.propTypes = {};

export default hot(module)(App);
