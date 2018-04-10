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
