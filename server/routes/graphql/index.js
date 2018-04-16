import bodyParser from 'body-parser';
import { apolloUploadExpress } from 'apollo-upload-server';
import { graphqlExpress, graphiqlExpress } from 'apollo-server-express';
import schema, { internalSchema } from './schema';
import context from './context';

const internalGraphql =
  process.env.NODE_ENV === 'production'
    ? () => {}
    : app => {
        app.use(
          '/internal-graphiql',
          bodyParser.json(),
          graphiqlExpress({ endpointURL: '/internal-graphql' })
        );
        app.use(
          '/internal-graphql',
          bodyParser.json(),
          graphqlExpress(req => ({
            schema: internalSchema,
            context: context(req, internalSchema),
            cacheControl: process.env.NODE_ENV === 'production',
            tracing: process.env.NODE_ENV === 'production'
          }))
        );
      };

export default app => {
  internalGraphql(app);
  app.use(
    '/graphql',
    bodyParser.json(),
    apolloUploadExpress(/* Options */),
    graphqlExpress(req => ({
      schema,
      context: context(req, internalSchema),
      cacheControl: process.env.NODE_ENV === 'production',
      tracing: process.env.NODE_ENV === 'production'
    }))
  );
};
