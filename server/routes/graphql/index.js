import express from 'express';
import bodyParser from 'body-parser';
import { apolloUploadExpress } from 'apollo-upload-server';
import { graphqlExpress, graphiqlExpress } from 'apollo-server-express';
import schema, { internalSchema } from './schema';
import createContext from './context';

const asyncGraphql = mainSchema => async (req, res, next) => {
  const context = await createContext(req, internalSchema);
  return graphqlExpress({
    schema: mainSchema,
    context,
    cacheControl: process.env.NODE_ENV === 'production',
    tracing: process.env.NODE_ENV === 'production'
  })(req, res, next);
};

const app = express.Router();

if (process.env.NODE_ENV !== 'production') {
  app.use(
    '/internal-graphiql',
    bodyParser.json(),
    graphiqlExpress({ endpointURL: '/internal-graphql' })
  );
  app.use('/internal-graphql', bodyParser.json(), async (req, res, next) => {
    await asyncGraphql(internalSchema)(req, res, next);
  });
}
app.use(
  '/graphql',
  bodyParser.json(),
  apolloUploadExpress(),
  async (req, res, next) => {
    await asyncGraphql(schema)(req, res, next);
  }
);

export default app;
