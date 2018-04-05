import DataLoader from 'dataloader';

const groupById = list => list.reduce((p, c) => ({ ...p, [c.id]: c }), {});

// eslint-disable-next-line no-unused-vars
module.exports = (user, db) => {
  const Loader = {
    posts: new DataLoader(keys => Loader.genPosts(keys)),
    users: new DataLoader(keys => Loader.genPersons(keys)),
    genPosts: async ids => {
      const result = await db.models.Post.findAll({
        where: {
          id: { [db.Sequelize.Op.in]: ids }
        }
      })
        .then(list => list.map(value => value.get({ plain: true })))
        .then(groupById);
      return ids.map(id => result[id]);
    },
    genPersons: async ids => {
      const result = await db.models.User.findAll({
        where: {
          id: { [db.Sequelize.Op.in]: ids }
        }
      })
        .then(list => list.map(value => value.get({ plain: true })))
        .then(groupById);
      return ids.map(id => result[id]);
    }
  };
  return Loader;
};
