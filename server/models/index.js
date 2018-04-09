const Sequelize = require('sequelize');

const force = process.env.NODE_ENV !== 'production';
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

const buildRelationships = async (objects, models, s) => {
  const relationships = {};
  try {
    let promise = Promise.resolve();
    await Object.entries(models).forEach(async ([key, model]) => {
      relationships[key] = {};
      if (model.associations) {
        relationships[key] = await model.associations(models);
      }
    });

    promise = Object.values(objects).map(object => {
      if (!object.postSetup) promise = promise.then(() => ({}));
      promise = promise.then(() => object.postSetup(models, relationships));
      return promise;
    });
    await promise;
    await s.sync({ force });
  } catch (e) {
    console.log(e);
  }
  return relationships;
};

const configureModels = objects => {
  const models = {};

  // DECLARE MODELS
  Object.entries(objects).forEach(([key, value]) => {
    models[key] = value(Sequelize, sequelize);
  });

  return models;
};

db.models = configureModels(db.objects);
db.relationships = buildRelationships(db.objects, db.models, sequelize);
db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
