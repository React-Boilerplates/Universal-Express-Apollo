import bcrypt from 'bcrypt';
import slug from 'slug';

const logger = require('../logger');

const force = process.env.NODE_ENV === 'development';

// eslint-disable-next-line global-require
const createUserModel = (Sequelize = require('sequelize'), sequelize) => {
  const User = sequelize.define(
    'user',
    {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
      },
      slug: {
        type: Sequelize.STRING
      },
      displayName: {
        type: Sequelize.STRING,
        unique: true
      },
      email: {
        type: Sequelize.STRING,
        unique: true,
        set(val) {
          this.setDataValue('email', val.toLowerCase());
        },
        validate: {
          isEmail: true
        }
      },
      firstName: {
        type: Sequelize.STRING
      },
      hash: {
        type: Sequelize.STRING,
        validate: {
          notEmpty: true
        }
      },
      password: {
        type: Sequelize.VIRTUAL,
        allowNull: false
      },
      password_confirmation: {
        type: Sequelize.VIRTUAL,
        allowNull: false
      },
      lastName: {
        type: Sequelize.STRING
      }
    },
    {
      getterMethods: {
        name() {
          return `${this.firstName} ${this.lastName}`;
        }
      }
    }
  );
  User.prototype.authenticate = async function authenticate(value) {
    const matches = await bcrypt.compareSync(value, this.hash);
    if (matches) {
      return this;
    }
    return false;
  };
  User.hashPassword = async user => {
    // Potentially check to see if the password is secure enough!
    if (user.password !== user.password_confirmation)
      throw new Error('Passwords do not match!');
    const hash = await bcrypt.hash(user.get('password'), 10);
    user.set('hash', hash);
    return user;
  };

  User.createSlug = async user => {
    // Potentially check to see if the password is secure enough!
    if (!user.firstName && !user.lastName) user.set('slug', 'unknown-user');
    else {
      const name = `${user.firstName || ''} ${user.lastName || ''}`;
      user.set('slug', slug(name));
    }
    return user;
  };

  User.preMutation = async user => {
    if (!user.password) return null;
    let final;
    final = await User.hashPassword(user);
    final = await User.createSlug(final);
    return final;
  };
  User.associations = models => {
    const relationships = {};
    // CREATE JOINS
    relationships.Post = User.hasMany(models.Post, { as: 'posts' });
    return relationships;
  };
  User.beforeCreate(async user => User.preMutation(user));
  User.beforeUpdate(async user => User.preMutation(user));

  return User;
};

createUserModel.postSetup = async (models, relationships) => {
  const range = length => [...Array(length).keys()];
  if (force) {
    try {
      await models.User.sync({ force });
      logger.log('Building Model');
      const casual = require('casual'); // eslint-disable-line global-require, import/no-extraneous-dependencies, node/no-unpublished-require
      await models.User.create(
        {
          firstName: 'Craig',
          lastName: 'Couture',
          email: 'couturecraigj@gmail.com',
          password: 'password',
          password_confirmation: 'password',
          posts: range(5).map(() => ({
            title: casual.title,
            description: casual.description
          }))
        },
        {
          include: [relationships.User.Post]
        }
      );

      await Promise.all(
        range(30).map(async () => {
          const { password } = casual;
          const user = await models.User.create(
            {
              firstName: casual.first_name,
              lastName: casual.last_name,
              password,
              password_confirmation: password,
              posts: range(5).map(() => ({
                title: casual.title,
                description: casual.description
              }))
            },
            {
              include: [relationships.User.Post]
            }
          );
          return user;
        })
      );
    } catch (e) {
      logger.log(e);
    }
  } else await models.User.sync({ force });
};

module.exports = createUserModel;
