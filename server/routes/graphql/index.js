import bodyParser from 'body-parser';
import { graphqlExpress } from 'apollo-server-express';
import schema from './schema';
import context from './context';

export default app => {
  app.use(
    '/graphql',
    bodyParser.json(),
    graphqlExpress(req => ({
      schema,
      context: context(req),
      cacheControl: process.env.NODE_ENV === 'production',
      tracing: process.env.NODE_ENV === 'production'
    }))
  );
};
