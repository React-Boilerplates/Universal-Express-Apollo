import { graphql } from 'graphql';
import createLoader from './Loader';
import db from '../../../models';

const context = (req, schema) => ({
  loader: createLoader(req.user, db),
  query: query => graphql(schema, query),
  req,
  ...db
});

module.exports = context;
