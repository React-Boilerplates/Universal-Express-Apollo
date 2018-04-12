import {
  connectionFromPromisedArray
  // connectionFromArray
} from 'graphql-relay';
import { GraphQLUpload } from 'apollo-upload-server';

const jwt = require('jsonwebtoken');

const cookieSecret = process.env.COOKIE_SECRET;

const resolvers = {
  Query: {
    posts: async (parent, args, context) =>
      connectionFromPromisedArray(
        context.models.Post.findAll({
          order: [['createdAt', 'DESC']]
        }).then(list =>
          list.map(v => {
            const userId = v.get('userId');
            if (userId) context.loader.users.load(userId);
            return v.get();
          })
        ),
        args
      ),
    post: async (parent, args, context) => context.loader.posts.load(args.id),
    user: async (parent, args, context) => context.loader.users.load(args.id),
    users: async (parent, args, context) =>
      connectionFromPromisedArray(
        context.models.User.findAll({
          order: [['createdAt', 'DESC']]
        }).then(list =>
          list.map(v =>
            // if (userId) context.loader.users.load(userId);
            v.get()
          )
        ),
        args
      )
  },
  Mutation: {
    signOn: async (parent, { password, ...where }, context) => {
      const user = await context.models.User.findOne({ where });

      if (!user) throw new Error('No User By those Criteria');
      const match = await user.authenticate(password);
      if (!match)
        throw new Error(
          'Password that you provided does not match the one in our system'
        );
      return user;
    },
    signOnJwt: async (parent, { password, ...where }, context) => {
      const user = await context.models.User.findOne({ where });
      if (!user) throw new Error('No User By those Criteria');
      const match = await user.authenticate(password);
      if (!match)
        throw new Error(
          'Password that you provided does not match the one in our system'
        );
      return {
        user: user.get(),
        token: jwt.sign({ id: user.id }, cookieSecret)
      };
    }
  },
  Upload: GraphQLUpload,
  Person: {
    posts: async (parent, args, context) =>
      connectionFromPromisedArray(
        context.models.Post.findAll({
          where: {
            userId: parent.id
          },
          order: [['createdAt', 'DESC']]
        }).then(list => list.map(v => v.get())),
        args
      )
  },
  Post: {
    author: async (parent, args, context) =>
      parent.userId ? context.loader.users.load(parent.userId) : null
  }
};

export default resolvers;
