import express from 'express';
import { graphiqlExpress } from 'apollo-server-express';
import bodyParser from 'body-parser';

const app = express.Router();

if (process.env.NODE_ENV !== 'production') {
  app.use((req, res, next) => {
    require('./graphql').default(req, res, next);
  });
} else {
  app.use(require('./graphql').default);
}
app.use(
  '/graphiql',
  bodyParser.json(),
  graphiqlExpress({ endpointURL: '/graphql' })
);

export default app;
