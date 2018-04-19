import { graphql } from 'graphql';
import createLoader from './Loader';
import createDb from '../../../models';
import { createUploadDir, uploadDir } from '../schema/resolvers/functions';

const context = async (req, schema) => {
  const [db] = await Promise.all([createDb(), createUploadDir(uploadDir)]);
  return {
    loader: createLoader(req.user, db),
    query: query => graphql(schema, query),
    req,
    ...db
  };
};

module.exports = context;
