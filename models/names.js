module.exports = function (sequelize, DataTypes) {
    const Names = sequelize.define("Names", {
        name: {
            type: DataTypes.TEXT,
            allowNull: false
        }
    });

    return Names;
};
