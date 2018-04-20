import resolvers from '../index';
import {
  createDb,
  createPost,
  createUser,
  createArray
} from '../../../../../../test_utilities';

describe('GraphQL resolvers', () => {
  describe('Query', () => {
    describe('posts', () => {
      it('should return empty pagination when returning empty array', async () => {
        const posts = [];
        await resolvers.Query.posts(undefined, {}, createDb(posts));
      });
      it('should return empty pagination when returning empty array', async () => {
        const posts = createArray(10, createPost);
        await resolvers.Query.posts(undefined, {}, createDb(posts));
      });
    });
    describe('post', () => {
      it('should call loader', async () => {
        await resolvers.Query.post(undefined, {}, createDb(createPost));
      });
    });
    describe('user', () => {
      it('should call loader', async () => {
        await resolvers.Query.user(undefined, {}, createDb(createUser));
      });
    });
    describe('Scalars', () => {
      describe('Date', () => {
        it('should parse', () => {
          const timeStamp = new Date().getTime();
          expect(resolvers.Date._scalarConfig.parseValue(timeStamp)).toEqual(
            new Date(timeStamp)
          );
        });
        it('should serialize', () => {
          const date = new Date();
          expect(resolvers.Date._scalarConfig.serialize(date)).toEqual(
            date.getTime()
          );
        });
      });
    });
  });
});
