import createLoader from './Loader';

const context = req => ({
  loader: createLoader(req.user)
});

module.exports = context;
