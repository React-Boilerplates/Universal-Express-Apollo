import React from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';

const ErrorPage = ({ errorId }) => (
  <div>
    <Helmet>
      <title>Error Page</title>
    </Helmet>
    <h1>Oops, Something went wrong.</h1>
    {errorId && (
      <div>
        <span>
          If you would like to follow this error to completion the Error Id is{' '}
          {errorId}
        </span>
      </div>
    )}
    <div>Do not fear though we have sent this error along to our admins</div>
  </div>
);

ErrorPage.propTypes = {
  errorId: PropTypes.string
};

ErrorPage.defaultProps = {
  errorId: ''
};

export default ErrorPage;
