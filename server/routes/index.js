import express from 'express';
import { graphiqlExpress } from 'apollo-server-express';
import bodyParser from 'body-parser';

const graphQl = require('./graphql');

const app = express.Router();

app.use(graphQl);
app.use(
  '/graphiql',
  bodyParser.json(),
  graphiqlExpress({ endpointURL: '/graphql' })
);

module.exports = app;
