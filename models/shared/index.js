'use strict';
const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const env = (process.env.NODE_ENV || 'development').trim();

// FIX 1: Use path.join to safely go up two levels to find the config
const configPath = path.join(__dirname, '..', '..', 'config', 'config.json');
const config = require(configPath)[env];
const db = {};

const sequelize = new Sequelize(config.database, config.username, config.password, {
    ...config,
    logging: false
});

// FIX 2: Since this file IS in the shared folder, modelDir is just __dirname
const modelDir = __dirname;

fs.readdirSync(modelDir)
    .filter(file => {
        // Only load .js files and DON'T load this index.js file itself
        return (file.indexOf('.') !== 0) && (file !== 'index.js') && (file.slice(-3) === '.js');
    })
    .forEach(file => {
        const model = require(path.join(modelDir, file))(sequelize, Sequelize.DataTypes);
        db[model.name] = model;
    });

Object.keys(db).forEach(modelName => {
    if (db[modelName].associate) db[modelName].associate(db);
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;