module.exports = function (sequelize, DataTypes) {
    const Games = sequelize.define("Games", {
        game_date: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        time: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        underdog: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        favorite: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        line: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        winner: {
            type: DataTypes.TEXT,
            allowNull: true,
        }
    });

    return Games;
};
