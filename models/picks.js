module.exports = function (sequelize, DataTypes) {
    const Picks = sequelize.define("Picks", {
        name: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        game_id: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        pick: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        game_date: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        make_visible: {
            type: DataTypes.TEXT,
            allowNull: true,
        }
    });

    return Picks;
};
