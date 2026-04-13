'use strict';
const fs = require('fs');
const path = require('path');

// Wrap the whole thing in a function that takes sequelize as an argument
module.exports = (sequelize, DataTypes) => {
    const db = {};

    fs.readdirSync(__dirname)
        .filter(file => file !== 'index.js' && file.endsWith('.js'))
        .forEach(file => {
            // This initializes each model file (picks.js, series.js, etc)
            const model = require(path.join(__dirname, file))(sequelize, DataTypes);
            db[model.name] = model;
        });

    Object.keys(db).forEach(modelName => {
        if (db[modelName].associate) {
            db[modelName].associate(db);
        }
    });

    return db; // Return the object full of models back to the root index
};