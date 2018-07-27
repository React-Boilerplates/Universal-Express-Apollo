import express from 'express';
import bodyParser from 'body-parser';
import { apolloUploadExpress } from 'apollo-upload-server';
import { crunch } from 'graphql-crunch';
import { graphqlExpress, graphiqlExpress } from 'apollo-server-express';
import schema, { internalSchema } from './schema';
import createContext from './context';

const cruncher = response => {
  if (response.data && !response.data.__schema) {
    response.data = crunch(response.data);
  }
  return response;
};

const asyncGraphql = mainSchema => async (req, res, next) => {
  const context = await createContext(req, internalSchema);
  const shouldCrunch = req.query.crunch === '';
  return graphqlExpress({
    schema: mainSchema,
    formatResponse: shouldCrunch ? cruncher : undefined,
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
  app.use('/internal-graphql', bodyParser.json(), asyncGraphql(internalSchema));
}
app.use(
  '/graphql',
  bodyParser.json(),
  apolloUploadExpress(),
  asyncGraphql(schema)
);

module.exports = app;
