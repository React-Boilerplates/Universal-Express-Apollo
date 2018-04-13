import {
  makeExecutableSchema,
  addMockFunctionsToSchema,
  mergeSchemas
} from 'graphql-tools';
import schemaDirectives from './directives';
import typeDefs, { internalTypeDefs } from './typeDefs';
import resolvers, { internalResolvers } from './resolvers';

const schema = makeExecutableSchema({
  typeDefs,
  schemaDirectives,
  resolvers
});

const internalSchema = mergeSchemas({
  schemas: [
    schema,
    makeExecutableSchema({
      typeDefs: internalTypeDefs,
      schemaDirectives,
      resolvers: internalResolvers
    })
  ]
});

if (process.env.NODE_ENV === 'development') {
  addMockFunctionsToSchema({
    schema,
    preserveResolvers: true,
    mocks: require('./mocks').default // eslint-disable-line global-require, node/no-unpublished-require
  });
  addMockFunctionsToSchema({
    schema: internalSchema,
    preserveResolvers: true,
    mocks: require('./mocks').default // eslint-disable-line global-require, node/no-unpublished-require
  });
}

export default schema;

export { internalSchema };
