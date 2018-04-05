// eslint-disable-next-line global-require
const createPostModel = (Sequelize = require('sequelize'), sequelize) => {
  const Post = sequelize.define('post', {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true
    },
    title: {
      type: Sequelize.STRING
    },
    description: {
      type: Sequelize.TEXT
    }
  });
  return Post;
};

createPostModel.connections = models => {
  const relationships = {};
  // CREATE JOINS
  relationships.User = models.Post.hasOne(models.User);

  // console.log(postToUser);
  return relationships;
};

createPostModel.postSetup = async models => {
  if (process.env.NODE_ENV === 'development') {
    await models.Post.sync({ force: true });
    const casual = require('casual'); // eslint-disable-line global-require, import/no-extraneous-dependencies
    await Promise.all(
      [...Array(30).keys()].map(() =>
        models.Post.create({
          title: casual.title,
          description: casual.description
        })
      )
    );
  }
};

module.exports = createPostModel;
