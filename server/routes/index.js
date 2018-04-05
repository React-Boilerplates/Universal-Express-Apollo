import { graphiqlExpress } from 'apollo-server-express';
import bodyParser from 'body-parser';
import graphql from './graphql';

export default app => {
  graphql(app);
  app.use(
    '/graphiql',
    bodyParser.json(),
    graphiqlExpress({ endpointURL: '/graphql' })
  );
};
