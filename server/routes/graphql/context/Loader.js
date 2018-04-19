import DataLoader from 'dataloader';

const groupById = list => list.reduce((p, c) => ({ ...p, [c.id]: c }), {});

// eslint-disable-next-line no-unused-vars
module.exports = (user, db) => {
  const Loader = {
    genPosts: async ids => {
      const result = await db.models.Post.findAll({
        where: {
          id: { [db.Sequelize.Op.in]: ids }
        }
      })
        .then(list => list.map(value => value.get({ plain: true })))
        .then(groupById);
      return ids.map(id => result[id] || null);
    },
    genPersons: async ids => {
      const result = await db.models.User.findAll({
        where: {
          id: { [db.Sequelize.Op.in]: ids }
        }
      })
        .then(list => list.map(value => value.get({ plain: true })))
        .then(groupById);
      return ids.map(id => result[id] || null);
    }
  };
  Loader.posts = new DataLoader(keys => Loader.genPosts(keys));
  Loader.users = new DataLoader(keys => Loader.genPersons(keys));
  return Loader;
};
