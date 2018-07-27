/* eslint-env browser */
import { ApolloLink } from 'apollo-link';
import { ApolloClient } from 'apollo-client';
import { createUploadLink } from 'apollo-upload-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { uncrunch } from 'graphql-crunch';

const fetch =
  typeof window === 'undefined' ? require('isomorphic-unfetch') : window.fetch;

const uri =
  process.env.NODE_ENV === 'production' ? '/graphql?crunch' : '/graphql';

const uncruncher = new ApolloLink((operation, forward) =>
  forward(operation).map(response => {
    response.data = uncrunch(response.data);
    return response;
  })
);

const link = ApolloLink.from([
  ...(uri === '/graphql' ? [] : [uncruncher]),
  createUploadLink({
    uri,
    credentials: 'same-origin',
    fetch
  })
]);

const client = new ApolloClient({
  cache: new InMemoryCache().restore(window.__APOLLO_STATE__), // eslint-disable-line no-underscore-dangle
  link,
  ssrForceFetchDelay: 100
});

export default client;
