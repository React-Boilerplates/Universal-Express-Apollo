import React from 'react';
import Layout from '../../src/components/Layout';
import ErrorPage from '../../src/pages/Error/Error';
import Helmet from '../../src/Helmet/Helmet';

const RoutedError = props => (
  <Layout plain>
    <Helmet />
    <ErrorPage {...props} />
  </Layout>
);

RoutedError.propTypes = {};

export default RoutedError;
