import { ApolloClient } from 'apollo-client';
import fetch from 'isomorphic-unfetch';
import { createHttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';

const uri = `http://localhost:${3000}/graphql`;

export default req => {
  const client = new ApolloClient({
    ssrMode: true,
    // Remember that this is the interface the SSR server will use to connect to the
    // API server, so we need to ensure it isn't firewalled, etc
    link: createHttpLink({
      uri,
      fetch,
      credentials: 'same-origin',
      headers: {
        cookie: req.header('Cookie')
      }
    }),
    cache: new InMemoryCache()
  });
  return client;
};
