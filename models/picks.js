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
        missed_pick_flag: {
            type: DataTypes.BOOLEAN,
            allowNull: true,
        },
        game_locked_time: {
            type: DataTypes.DATE,
            allowNull: true,
        }
    });

    return Picks;
};
