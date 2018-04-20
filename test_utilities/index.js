import fs from 'fs';
import rimraf from 'rimraf';
import casual from 'casual';
import Sequelize from 'sequelize';

export const loader = {
  load: () => ({})
};

export const model = result => ({
  async findAll() {
    return result;
  },
  create: async input => ({
    input,
    get(str) {
      return this.input[str];
    },
    toJSON() {
      return input;
    }
  })
});

export const createDb = result => ({
  loader: {
    users: loader,
    posts: loader
  },
  models: {
    Post: model(result),
    File: model(result),
    User: model(result)
  },
  Sequelize
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

export const removeFolder = uploadDir => done => {
  rimraf(uploadDir, () => {
    fs.mkdir(uploadDir, () => {
      done();
    });
  });
};

export const emptyFolder = uploadDir => done => {
  rimraf(uploadDir, () => {
    fs.mkdir(uploadDir, () => {
      done();
    });
  });
};

export const createArray = (size, fn) => {
  return [...Array(size).keys()].map(() => fn());
};
