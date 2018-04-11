import React from 'react';
import Layout from '../../src/components/Layout';
import ErrorPage from '../../src/pages/Error/Error';
import Helmet from '../../src/Helmet/Helmet';

const RoutedError = () => (
  <Layout plain>
    <Helmet />
    <ErrorPage />
  </Layout>
);

RoutedError.propTypes = {};

export default RoutedError;
