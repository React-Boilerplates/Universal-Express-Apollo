import { makeExecutableSchema, addMockFunctionsToSchema } from 'graphql-tools';
import typeDefs from './typeDefs';
import resolvers from './resolvers';
import mocks from './mocks';

const schema = makeExecutableSchema({
  typeDefs,
  resolvers
});

addMockFunctionsToSchema({
  schema,
  mocks
});

export default schema;
