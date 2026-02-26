'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const env = (process.env.NODE_ENV || 'development').trim();
const config = require(__dirname + '/../config/config.json')[env];
const db = {};

let sequelize;

console.log('ENV:', env);
console.log('DIALECT:', config.dialect || 'using DATABASE_URL');

if (config.use_env_variable) {
  // Production or DATABASE_URL environment variable
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  // Local development
  sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config
  );
}

// Load all models in this folder
fs.readdirSync(__dirname)
  .filter(file => file !== basename && file.endsWith('.js'))
  .forEach(file => {
    const model = require(path.join(__dirname, file))(
      sequelize,
      Sequelize.DataTypes
    );
    db[model.name] = model;
  });

// Call associate if defined
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

// after all models are loaded

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

// 👇 ADD THESE MANUALLY if you don’t use associate()
db.Users.hasMany(db.Picks, {
  foreignKey: "name",   // Picks.name == Users.name
  sourceKey: "name",
});

db.Picks.belongsTo(db.Users, {
  foreignKey: "name",
  targetKey: "name",
});

db.Games.hasMany(db.Picks, {
  foreignKey: "game_id",
  sourceKey: "id",
});

db.Picks.belongsTo(db.Games, {
  foreignKey: "game_id",
  targetKey: "id",
});

module.exports = db;
