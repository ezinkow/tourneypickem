module.exports = function (sequelize, DataTypes) {
    const Picks = sequelize.define("Picks", {
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        game_id: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        pick: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        game_date: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        missed_pick_flag: {
            type: DataTypes.BOOLEAN,
            allowNull: true,
        }
    });

    return Picks;
};
