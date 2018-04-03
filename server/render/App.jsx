import React from 'react';
import PropTypes from 'prop-types';
import { ApolloProvider } from 'react-apollo';
import App from '../../src/App';

const { StaticRouter: Router } = require('react-router');

const RoutedApp = ({ context, req, client }) => (
  <ApolloProvider client={client}>
    <Router location={req.url} context={context}>
      <App path={req.path} a={req.path.startsWith('/amp')} />
    </Router>
  </ApolloProvider>
);

RoutedApp.propTypes = {
  client: PropTypes.any.isRequired, // eslint-disable-line react/forbid-prop-types
  req: PropTypes.any.isRequired, // eslint-disable-line react/forbid-prop-types
  context: PropTypes.object.isRequired // eslint-disable-line react/forbid-prop-types
};

export default RoutedApp;
