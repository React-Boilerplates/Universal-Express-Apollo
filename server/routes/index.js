import { graphiqlExpress } from 'apollo-server-express';
import graphql from './graphql';

export default app => {
  graphql(app);
  app.use('/graphiql', graphiqlExpress({ endpointURL: '/graphql' }));
};
