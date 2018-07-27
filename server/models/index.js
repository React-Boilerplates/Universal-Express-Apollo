/*eslint no-console: ["error", { allow: ["error"] }] */
import fs from 'fs';
import DataLoader from 'dataloader';
import logger from '../logger';

process.env.IMPORT_OLD_DATA = false;
const importData = process.env.IMPORT_OLD_DATA === 'true';

// const logging = process.env.NODE_ENV === 'development';
const logging = false;
const Sequelize = require('sequelize');

const groupById = list => list.reduce((p, c) => ({ ...p, [c.id]: c }), {});
const resultsByKey = keys => async list => {
  let result = await list.map(value => value.get({ plain: true }));
  result = await groupById(result);
  return keys.map(id => result[id] || null);
};
const proper = (string, removal) => {
  let result = string.replace(/_([a-z])/g, g => g[1].toUpperCase());
  if (removal) result = result.replace(removal, '');
  return result.charAt(0).toUpperCase() + result.substr(1);
};
const files = fs
  .readdirSync(__dirname)
  .filter(name => !name.includes('index.js') && !name.includes('.spec.js'));

/* eslint-disable global-require */
const db = {
  objects: files.reduce(
    (p, c) => ({
      ...p,
      // eslint-disable-next-line import/no-dynamic-require
      [c.replace('.js', '')]: require(`./${c}`)
    }),
    {}
  )
};

const force =
  process.env.FORCE_DATABASE_SYNC === 'true' ? { force: true } : false;

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite',
  logging
});

// const backUp = new Sequelize({
//   dialect: 'sqlite',
//   storage: './backup-database.sqlite',
//   logging
// });

const configureModels = objects => {
  const models = {};

  // DECLARE MODELS
  Object.entries(objects).forEach(([key, value]) => {
    models[key] = value(Sequelize, sequelize, /*paranoid*/ !force);
  });

  return models;
};
module.dataBaseBuilt = false;
module.dataBaseBuilding = false;
const buildDataBase = () => {
  return new Promise(async function(resolve) {
    if (module.dataBaseBuilt) return resolve(db);
    const runTimer = () => {
      if (module.timer) clearTimeout(module.timer);
      module.timer = setTimeout(() => {
        if (!module.dataBaseBuilt) return runTimer();
        return resolve(db);
      }, 1000);
    };
    // eslint-disable-next-line no-console
    console.log('Building Database');
    if (module.dataBaseBuilding) return runTimer();

    module.dataBaseBuilding = true;
    // eslint-disable-next-line no-console
    console.log('Database Initializing');
    const buildRelationships = async (objects, models) => {
      try {
        for (const [key, model] of Object.entries(models)) {
          // eslint-disable-next-line no-console
          console.log(`Building Associations for ${key}`);
          if (model.associations) {
            try {
              await model.associations(models);
            } catch (error) {
              console.error(error);
            }
          }
          // eslint-disable-next-line no-console
          console.log(`Associations finished for ${key}`);
        }
        if (!module.initialization && !module.initialized) {
          module.initialization = true;
          module.initialized = false;
          try {
            await sequelize.sync(force && { force: true });
          } catch (error) {
            console.error(error);
          }
          // await sequelize.sync({ force });
          // for (const [key, object] of Object.entries(objects)) {
          //   // eslint-disable-next-line no-console
          //   console.log(`Initializing ${key}`);
          //   if (object.initialization) {
          //     try {
          //       await object.initialization(models, force && { force: true });
          //     } catch (error) {
          //       console.error(error);
          //     }
          //   }
          //   // eslint-disable-next-line no-console
          //   console.log(`Finished Initializing ${key}`);
          // }
          module.initialization = false;
          module.initialized = true;
        }
        module.dataBaseBuilding = false;
        if (module.initialized && !module.postSetup) {
          module.postSetup = true;
          // eslint-disable-next-line import/no-extraneous-dependencies, node/no-unpublished-require
          const memoize = require('memoizee');
          for (const model of Object.values(models)) {
            model.memoize = {};
            model.memoize.findOrCreate = memoize(
              async opts => {
                const result = await model
                  .findOrCreate(opts)
                  .spread(v => v.get({ plain: true }));
                // console.log(result);
                return result;
              },
              {
                normalizer: args => JSON.stringify(args[0].where),
                max: 2,
                promise: true
              }
            );
            model.memoize.find = memoize(
              async opts => {
                const result = await model
                  .findOne(opts)
                  .spread(v => v.get({ plain: true }));
                // console.log(result);
                return result;
              },
              {
                normalizer: args => JSON.stringify(args[0].where),
                max: 2,
                promise: true
              }
            );
            model.memoize.updateOrCreate = memoize(
              ({ where, update }) =>
                model
                  .findOrCreate({ where })
                  .spread(v => v.update(update))
                  .then(v => v.get({ plain: true })),
              {
                normalizer: args =>
                  JSON.stringify([args[0].where, args[0].update]),
                max: 2,
                promise: true
              }
            );
          }
          // const backupQueryInterface = backUp.getQueryInterface();
          // await require('../import/english/strongs')(models);
          for (const [key, object] of Object.entries(objects)) {
            // eslint-disable-next-line no-console
            console.log(`Setting up ${key}`);
            if (object.postSetup) {
              try {
                await object.postSetup(models, importData);
              } catch (error) {
                console.error(error);
              }
            }

            // eslint-disable-next-line no-console
            console.log(`Finished setup of ${key}`);
          }
          // require('../import/finishingTouches')(models, Sequelize);
          for (const model of Object.values(models)) {
            model.memoize = undefined;
          }
        }
      } catch (e) {
        console.error(e);
      }
      return true;
    };

    if (!db.relationships) {
      db.relationships = true;
      try {
        await buildRelationships(db.objects, db.models, sequelize);
      } catch (e) {
        logger.log(e);
      }
    }
    if (!module.createLoader) {
      module.createLoader = true;
      // eslint-disable-next-line no-unused-vars
      db.createLoader = async (currentUser = {}) => {
        const loaders = {};
        for (const [name, model] of Object.entries(db.models)) {
          const schema = await model.describe();
          loaders[name] = {
            findById: new DataLoader(keys =>
              model
                .findAll({
                  where: { id: { [Sequelize.Op.in]: keys } },
                  currentUser
                })
                .then(resultsByKey(keys))
            )
          };
          for (const [field, obj] of Object.entries(schema)) {
            if (field === 'id') continue;
            if (obj.primaryKey)
              loaders[name][`findBy${proper(field)}`] = new DataLoader(keys =>
                model
                  .findAll({
                    where: { [field]: { [Sequelize.Op.in]: keys } },
                    currentUser
                  })
                  .then(resultsByKey(keys))
              );
          }
          // console.log({ ...model });
          for (const indexObj of model.options.indexes) {
            if (indexObj.fields.length === 1 && indexObj.fields[0] === 'id')
              continue;
            if (indexObj.name)
              loaders[name][
                `findBy${proper(indexObj.name, model.tableName)}`
              ] = new DataLoader(keys =>
                model
                  .findAll({
                    where: {
                      [indexObj.name]: { [Sequelize.Op.in]: keys }
                    },
                    currentUser
                  })
                  .then(resultsByKey(keys))
              );
          }
        }
        return loaders;
      };
    }

    module.dataBaseBuilt = true;
    return resolve(db);
  });
};
db.models = configureModels(db.objects);
db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports.force = force && { force: true };
export default buildDataBase;
