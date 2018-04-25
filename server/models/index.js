import logger from '../logger';

const Sequelize = require('sequelize');

/* eslint-disable global-require */
const db = {
  objects: {
    Post: require('./Post'),
    User: require('./User')
  }
};
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite',
  logging: false
});

const configureModels = objects => {
  const models = {};

  // DECLARE MODELS
  Object.entries(objects).forEach(([key, value]) => {
    models[key] = value(Sequelize, sequelize);
  });

  return models;
};

const buildDataBase = async () => {
  const buildRelationships = async (objects, models) => {
    const relationships = {};
    try {
      Object.entries(models).forEach(async ([key, model]) => {
        relationships[key] = {};
        if (model.associations) {
          relationships[key] = model.associations(models);
        }
      });
      const promises = [];
      Object.values(objects).forEach(object => {
        if (!object.postSetup) return;
        promises.push(object.postSetup(models, relationships));
      });
      await Promise.all(promises);
    } catch (e) {
      logger.log(e);
    }
    return relationships;
  };

  if (!db.relationships) {
    try {
      db.relationships = await buildRelationships(
        db.objects,
        db.models,
        sequelize
      );
    } catch (e) {
      logger.log(e);
    }
  }

  return db;
};
db.models = configureModels(db.objects);
db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default buildDataBase;
