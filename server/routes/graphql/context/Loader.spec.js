import casual from 'casual';
import Loader from './Loader';

const loader = {
  load: () => ({})
};

const model = result => ({
  async findAll() {
    return result;
  }
});

const createDb = result => ({
  loader: {
    users: loader,
    posts: loader
  },
  models: {
    Post: model(result),
    User: model(result)
  }
});

const createPost = () => ({
  id: casual.uuid,
  title: casual.title,
  userId: casual.boolean ? casual.uuid : undefined,
  get(str) {
    return this[str];
  }
});

const createUser = () => ({
  id: casual.uuid,
  name: casual.name,
  userId: casual.boolean ? casual.uuid : undefined,
  get(str) {
    return this[str];
  }
});

const createArray = (size, fn) => {
  return [...Array(size).keys()].map(() => fn());
};

jest.mock('dataloader');

describe('Loader', () => {
  describe('loaders', () => {
    it('should run without errors', () => {
      Loader(createUser(), createDb(createArray(40, createPost)));
    });
  });
});
