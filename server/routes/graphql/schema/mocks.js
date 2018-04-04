import { MockList } from 'graphql-tools';
import casual from 'casual';
import DataLoader from 'dataloader';

const sleep = ms =>
  new Promise(resolve => {
    setTimeout(resolve, ms);
  });

function createLoaders() {
  /* eslint-disable no-use-before-define */
  return {
    // query: new DataLoader(query => gen),
    posts: new DataLoader(ids => {
      console.log('loading posts');
      return genPosts(ids);
    }),
    persons: new DataLoader(ids => {
      console.log('loading persons');
      return genPersons(ids);
    }),
    queries: new DataLoader(queries => {
      console.log('loading queries');
      return queries;
    })
  };
  /* eslint-enable no-use-before-define */
}

const loaders = createLoaders();

function genPosts(ids) {
  return Promise.all(
    ids.map(id =>
      sleep(50).then(() => ({
        id,
        author: post => loaders.persons.load(post.author),
        title: casual.title
      }))
    )
  );
}

function genPersons(ids) {
  return Promise.all(
    ids.map(id =>
      sleep(50).then(() => ({
        id,
        name: casual.name,
        posts: (_, { next = 10, last }) =>
          new MockList(next || last, () => casual.uuid)
      }))
    )
  );
}

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
