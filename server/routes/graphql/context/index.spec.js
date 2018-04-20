import { internalSchema as schema } from '../schema';
import { createUser } from '../../../../test_utilities';
import contextCreator from '.';

describe('context creator', () => {
  it('should run without failing', async () => {
    const context = await contextCreator({ user: createUser() }, schema);
    await context.query(`query { posts { pageInfo {
      hasNextPage
    } } }`);
  });
});
