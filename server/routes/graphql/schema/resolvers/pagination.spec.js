/* eslint-env jest */
import casual from 'casual';
import pagination from './pagination';

const Sequelize = require('sequelize');

const { gt, and } = Sequelize.Op;
let sequelize;
const models = {};
describe('Check Pagination', () => {
  beforeAll(async () => {
    sequelize = new Sequelize({
      storage: ':memory:',
      dialect: 'sqlite',
      logging: false
    });

    const User = sequelize.define('user', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true
      },
      firstName: {
        type: Sequelize.STRING
      },
      lastName: {
        type: Sequelize.STRING
      }
    });

    await User.sync({ force: true });
    models.User = User;
  });
  describe('Post Initialization', () => {
    beforeEach(async () => {
      await models.User.sync({ force: true });
      await Promise.all(
        [...Array(30).keys()].map(() =>
          models.User.create({
            id: casual.uuid,
            firstName: casual.first_name,
            lastName: casual.last_name
          })
        )
      );
    });
    it('should run a pagination query', async () => {
      const data = await pagination(undefined, undefined, 'User', {
        models,
        paginate: {
          User: {
            findAfterId: async (id, params, limit) =>
              models.User.findAll({
                where: {
                  [and]: [{ id: { [gt]: id } }, params].filter(v => v)
                },
                limit,
                order: [['createdAt', 'DESC']]
              }),
            hasNext: async (id, params) => {
              const list = await models.User.findAll({
                where: {
                  [and]: [{ id: { [gt]: id } }, params].filter(v => v)
                },
                limit: 1,
                order: [['createdAt', 'DESC']]
              });
              console.log(list);
              return list.length === 1;
            },
            hasPrev: async (id, params) => {
              const list = await models.User.findAll({
                where: {
                  [and]: [{ id: { [gt]: id } }, params].filter(v => v)
                },
                limit: 1,
                order: [['createdAt']]
              });
              console.log(list);
              return list.length === 1;
            }
          }
        },
        loaders: {
          User: {
            load: () => {},
            loadMany: () => {}
          }
        }
      });
      console.log(data);
    });
  });
});
