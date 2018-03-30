/* eslint-env browser */
import { ApolloClient } from 'apollo-client';
import { createHttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';

const link = createHttpLink({
  uri: '/graphql',
  credentials: 'same-origin'
});

const client = new ApolloClient({
  cache: new InMemoryCache().restore(window.__APOLLO_STATE__), // eslint-disable-line no-underscore-dangle
  link,
  ssrForceFetchDelay: 100
});

export default client;
