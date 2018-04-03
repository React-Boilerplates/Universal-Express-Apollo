import React from 'react';
import { Helmet } from 'react-helmet';
import PropTypes from 'prop-types';

const themeColor = process.env.PWA_THEME_COLOR;
const name = process.env.NAME;
const description = process.env.PWA_DESCRIPTION;
const pwaName = process.env.PWA_NAME;
const googleSiteVerification = process.env.GOOGLE_SITE_VERIFICATION;
const yandexSiteVerification = process.env.YANDEX_SITE_VERIFICATION;
const msSiteValidate = process.env.BING_SITE_VERIFICATION;
const alexaSiteValidate = process.env.BING_SITE_VERIFICATION;

const HeadElements = ({ path, a }) => (
  <Helmet titleTemplate={`%s | ${name}`}>
    <html lang="en-US" amp={a} />
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1, shrink-to-fit=no"
    />
    <title>Home</title>
    <meta name="rating" content="General" />
    <meta name="theme-color" content={themeColor} />
    <link
      rel="manifest"
      type="application/manifest+json"
      href="/web-app-manifest.json"
    />
    {!a ? <link rel="stylesheet" href="/assets/styles.css" /> : null}
    <meta name="application-name" content={pwaName} />
    <meta name="description" content={description} />
    <meta name="google-site-verification" content={googleSiteVerification} />
    <meta name="alexaVerifyID" content={alexaSiteValidate} />
    <meta name="yandex-verification" content={yandexSiteVerification} />
    <meta name="msvalidate.01" content={msSiteValidate} />
    <link
      rel={a ? 'canonical' : 'amphtml'}
      href={a ? path.replace('amp', '').replace('//', '/') : `/amp${path}`}
    />
  </Helmet>
);

HeadElements.propTypes = {
  a: PropTypes.bool.isRequired,
  path: PropTypes.string.isRequired
};

export default HeadElements;
