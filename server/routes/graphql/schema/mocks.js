import { MockList } from 'graphql-tools';
import casual from 'casual';
import DataLoader from 'dataloader';

const sleep = ms =>
  new Promise(resolve => {
    setTimeout(resolve, ms);
  });

// eslint-disable-next-line no-unused-vars
const createLoaders = authToken => {
  const Loader = {
    posts: new DataLoader(keys => {
      console.log('Loading Posts!');
      return Loader.genPosts(keys);
    }),
    persons: new DataLoader(keys => {
      console.log('Loading Persons!');
      return Loader.genPersons(keys);
    }),
    genPosts: ids =>
      Promise.all(
        ids.map(id =>
          sleep(50).then(() => ({
            id,
            author: post => Loader.persons.load(post.author),
            title: casual.title
          }))
        )
      ),
    genPersons: ids =>
      Promise.all(
        ids.map(id =>
          sleep(50).then(() => ({
            id,
            name: casual.name,
            posts: (_, { next = 10, last }) =>
              Loader.posts.loadMany(
                new MockList(next || last, () => casual.uuid)
              )
          }))
        )
      )
  };
  return Loader;
};

const loaders = createLoaders();

const mocks = {
  PostEdge: () => ({
    cursor: casual.uuid,
    node: () => mocks.Post
  }),
  PageInfo: () => ({
    hasNextPage: casual.boolean,
    hasPrevPage: casual.boolean
  }),
  PostConnection: ({ next, last }) => ({
    pageInfo: () => mocks.PageInfo,
    edges: () => new MockList(next || last, () => casual.uuid)
  }),
  Post: ({ id = casual.uuid }) => loaders.posts.load(id),
  Person: ({ id = casual.uuid }) => loaders.persons.load(id),
  Query: () => ({
    post: (_, { id }) => loaders.posts.load(id),
    posts: (_, { next = 10, last }) => mocks.PostConnection({ next, last })
  })
};

export default mocks;
