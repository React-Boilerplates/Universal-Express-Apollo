import { MockList } from 'graphql-tools';
import casual from 'casual';

const sleep = ms =>
  new Promise(resolve => {
    setTimeout(resolve, ms);
  });

const mocks = {
  Post: () =>
    sleep(200).then(() => ({
      id: casual.uuid,
      author: () => mocks.Person,
      title: casual.title
    })),
  Person: () =>
    sleep(200).then(() => ({
      id: casual.uuid,
      name: casual.name,
      posts: () => new MockList(10, mocks.Post)
    })),
  Query: () => ({
    posts: () => new MockList(10, mocks.Post)
  })
};

export default mocks;
