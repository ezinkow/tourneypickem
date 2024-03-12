module.exports = function (sequelize, DataTypes) {
    const Standings = sequelize.define("Standings", {
        name: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        points: {
            type: DataTypes.TEXT,
            allowNull: false
        }
    });

    return Standings;
};
