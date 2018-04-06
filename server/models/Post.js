const force = process.env.NODE_ENV === 'development';
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
  Post.associations = () => {
    const relationships = {};
    // CREATE JOINS
    // relationships.User = models.Post.hasOne(models.User);

    // console.log(postToUser);
    return relationships;
  };
  return Post;
};

createPostModel.postSetup = async models => {
  await models.Post.sync({ force });
};

module.exports = createPostModel;
