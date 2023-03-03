module.exports = function (sequelize, DataTypes) {
    const Picks = sequelize.define("Picks", {
        name: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        game_id: {
            type: DataTypes.JSON,
            allowNull: true,
        },
        pick: {
            type: DataTypes.JSON,
            allowNull: true,
        }
    });

    return Picks;
};
