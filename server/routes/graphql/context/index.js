import createLoader from './Loader';
import db from '../../../models';

const context = req => ({
  loader: createLoader(req.user, db),
  req,
  ...db
});

module.exports = context;
