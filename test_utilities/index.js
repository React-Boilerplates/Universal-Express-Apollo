import casual from 'casual';

export const loader = {
  load: () => ({})
};

export const model = result => ({
  async findAll() {
    return result;
  }
});

export const createDb = result => ({
  loader: {
    users: loader,
    posts: loader
  },
  models: {
    Post: model(result),
    User: model(result)
  }
});

export const createPost = () => ({
  id: casual.uuid,
  title: casual.title,
  userId: casual.boolean ? casual.uuid : undefined,
  get(str) {
    return this[str];
  }
});

export const createUser = () => ({
  id: casual.uuid,
  name: casual.name,
  userId: casual.boolean ? casual.uuid : undefined,
  get(str) {
    return this[str];
  }
});

export const createArray = (size, fn) => {
  return [...Array(size).keys()].map(() => fn());
};
