import React from 'react';
import { ApolloClient } from 'apollo-client';

const actualReactApollo = require.requireActual('react-apollo');

let mockProps = {};

const setMockGraphQLProps = props => {
  mockProps = props;
};

const {
  compose,
  // ApolloClient,
  ApolloProvider,
  graphql,
  withApollo,
  walkTree,
  Subscription,
  Mutation,
  renderToStringWithData,
  ApolloConsumer,
  getDataFromTree
} = actualReactApollo;

class QueryInternal extends React.Component {
  render() {
    const { children } = this.props; // eslint-disable-line react/prop-types
    return children({ ...this.state, ...mockProps });
  }
}

const Query = props => <QueryInternal {...props} />;

export {
  renderToStringWithData,
  ApolloProvider,
  compose,
  ApolloConsumer,
  getDataFromTree,
  graphql,
  Mutation,
  Subscription,
  walkTree,
  withApollo,
  setMockGraphQLProps,
  ApolloClient,
  Query
};
