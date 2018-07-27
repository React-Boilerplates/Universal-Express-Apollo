import slug from 'slug';

const force = process.env.NODE_ENV === 'development';

// eslint-disable-next-line global-require
const createPostModel = (Sequelize = require('sequelize'), sequelize) => {
  const Post = sequelize.define('post', {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true
    },
    slug: {
      type: Sequelize.STRING
    },
    title: {
      type: Sequelize.STRING,
      allowNull: false
    },
    description: {
      type: Sequelize.TEXT,
      allowNull: false
    }
  });

  Post.createSlug = async post => {
    const name = post.title || '';
    post.set('slug', slug(name));
    return post;
  };

  Post.preMutation = async post => {
    return Post.createSlug(post);
  };
  Post.associations = () => {
    const relationships = {};
    return relationships;
  };
  Post.beforeCreate(async post => Post.preMutation(post));
  Post.beforeUpdate(async post => Post.preMutation(post));

  return Post;
};

createPostModel.postSetup = async models => {
  await models.Post.sync({ force });
};

module.exports = createPostModel;
