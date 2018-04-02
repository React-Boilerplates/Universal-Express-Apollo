import React from 'react';
import PropTypes from 'prop-types';
import { Switch } from 'react-router';
import { hot } from 'react-hot-loader';
import { Helmet } from 'react-helmet';
import Layout from './components/Layout';
import routes from './routes';

// import Universal from './routes';

const App = ({ amp = false, path = '' }) => (
  <Layout>
    <Helmet titleTemplate="%s | BoilerPlate">
      <html lang="en-US" />
      <meta charSet="utf-8" />
      <meta name="rating" content="General" />
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1, shrink-to-fit=no"
      />
      <title>Home</title>
      <meta name="theme-color" content="#fff" />
      <link
        rel="manifest"
        type="application/manifest+json"
        href="/web-app-manifest.json"
      />
      <meta name="description" content="BoilerPlate" />
      <link
        rel="canonical"
        href={amp ? path.replace('amp', '').replace('//', '') : `/amp${path}`}
      />
      <link rel="stylesheet" href="/assets/styles.css" />
    </Helmet>
    <Switch>{routes}</Switch>
  </Layout>
);

App.propTypes = {
  amp: PropTypes.bool.isRequired,
  path: PropTypes.string.isRequired
};

export default hot(module)(App);
