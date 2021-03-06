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
  console.log('removing', uploadDir);
  if (fs.existsSync(uploadDir)) {
    rimraf(uploadDir, err => {
      if (err) return done(err);
      return done();
    });
  } else {
    done();
  }
};

export const emptyFolder = uploadDir => done => {
  if (fs.existsSync(uploadDir)) {
    rimraf(uploadDir, err => {
      if (err) return done(err);
      fs.mkdir(uploadDir, error => {
        if (error) return done(error);
        done();
      });
    });
  } else {
    fs.mkdir(uploadDir, error => {
      if (error) return done(error);
      done();
    });
  }
};

export const createArray = (size, fn) => {
  return [...Array(size).keys()].map(() => fn());
};
