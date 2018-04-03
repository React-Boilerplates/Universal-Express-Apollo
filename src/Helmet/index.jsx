import React from 'react';
import loadable from 'loadable-components';
import PropTypes from 'prop-types';

const render = ({ Component, error, ownProps }) => {
  if (error) return <div>Oops! {error.message}</div>;
  return <Component {...ownProps} />;
};

const Helmet = loadable(
  () => import(/* webpackChunkName: "helmet" */ './Helmet'),
  {
    render
  }
);

render.propTypes = {
  Component: PropTypes.element.isRequired,
  error: PropTypes.shape({
    message: PropTypes.string
  }).isRequired,
  ownProps: PropTypes.object.isRequired // eslint-disable-line react/forbid-prop-types
};

export default Helmet;
