import React from 'react';
import { Helmet } from 'react-helmet';

const ErrorPage = () => (
  <div>
    <Helmet>
      <title>Error Page</title>
    </Helmet>
    <h1>Oops, Something went wrong.</h1>
    <div>Do not fear though we have sent this error along to our admins</div>
  </div>
);

export default ErrorPage;
