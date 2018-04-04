import DataLoader from 'dataloader';

// eslint-disable-next-line no-unused-vars
module.exports = user => {
  const Loader = {
    posts: new DataLoader(keys => Loader.genPosts(keys)),
    persons: new DataLoader(keys => Loader.genPersons(keys)),
    genPosts: keys => keys,
    genPersons: keys => keys
  };
  return Loader;
};
