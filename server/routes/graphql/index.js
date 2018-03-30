import bodyParser from 'body-parser';
import { graphqlExpress } from 'apollo-server-express';
import schema from './schema';

export default app => {
  app.use('/graphql', bodyParser.json(), graphqlExpress({ schema }));
};
