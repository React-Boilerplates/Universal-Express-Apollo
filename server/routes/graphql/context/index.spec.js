// import { graphql } from 'graphql';
// import createLoader from './Loader';
// import createDb from '../../../models';

// const context = async (req, schema) => {
//   const db = await createDb();
//   return {
//     loader: createLoader(req.user, db),
//     query: query => graphql(schema, query),
//     req,
//     ...db
//   };
// };

// module.exports = context;
import casual from 'casual';
import { internalSchema as schema } from '../schema';
import contextCreator from '.';

const createUser = () => ({
  id: casual.uuid,
  name: casual.name,
  userId: casual.boolean ? casual.uuid : undefined,
  get(str) {
    return this[str];
  }
});

describe('context creator', () => {
  it('should run without failing', async () => {
    const context = await contextCreator({ user: createUser() }, schema);
    const result = await context.query(`query { posts { pageInfo {
      hasNextPage
    } } }`);
    console.log(result);
  });
});
