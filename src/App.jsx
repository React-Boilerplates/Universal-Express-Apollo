import React from 'react';
import PropTypes from 'prop-types';
import { Switch } from 'react-router';
import { hot } from 'react-hot-loader';
import { Helmet } from 'react-helmet';
import Layout from './components/Layout';
import routes from './routes';

const themeColor = process.env.PWA_THEME_COLOR;
const description = process.env.PWA_DESCRIPTION;
const name = process.env.PWA_NAME;
const googleSiteVerification = process.env.GOOGLE_SITE_VERIFICATION;
const yandexSiteVerification = process.env.YANDEX_SITE_VERIFICATION;
const msSiteValidate = process.env.BING_SITE_VERIFICATION;
const alexaSiteValidate = process.env.BING_SITE_VERIFICATION;

// import Universal from './routes';

const App = ({ amp, path }) => (
  <Layout>
    <Helmet titleTemplate={`%s | ${name}`}>
      <html lang="en-US" amp={amp} />
      <meta charSet="utf-8" />
      <script async src="https://cdn.ampproject.org/v0.js" />
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1, shrink-to-fit=no"
      />
      <meta name="application-name" content={name} />
      <meta name="rating" content="General" />
      <title>Home</title>
      <meta name="theme-color" content={themeColor} />
      <link
        rel="manifest"
        type="application/manifest+json"
        href="/web-app-manifest.json"
      />
      <meta name="description" content={description} />
      <meta name="google-site-verification" content={googleSiteVerification} />
      <meta name="alexaVerifyID" content={alexaSiteValidate} />
      <meta name="yandex-verification" content={yandexSiteVerification} />
      <meta name="msvalidate.01" content={msSiteValidate} />
      <link
        rel={amp ? 'canonical' : 'amphtml'}
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
