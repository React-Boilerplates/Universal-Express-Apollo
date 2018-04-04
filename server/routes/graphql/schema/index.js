import { makeExecutableSchema, addMockFunctionsToSchema } from 'graphql-tools';
import typeDefs from './typeDefs';
import resolvers from './resolvers';


const schema = makeExecutableSchema({
  typeDefs,
  resolvers
});
if (process.env.NODE_ENV === 'development') {
  addMockFunctionsToSchema({
    schema,
    mocks: require('./mocks').default
  });
}

export default schema;
