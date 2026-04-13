module.exports = function (sequelize, DataTypes) {
    const NbaPicks = sequelize.define("NbaPicks", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: { model: "users", key: "id" },
        },
        series_id: {
            type: DataTypes.STRING(64),
            allowNull: false,
            references: { model: "nba_series", key: "id" },
        },
        pick: {
            type: DataTypes.STRING,   // team name picked to win series
            allowNull: false,
        },
        confidence: {
            type: DataTypes.INTEGER,  // points assigned (1–round_points_max, unique per round)
            allowNull: false,
        },
        series_length_guess: {
            type: DataTypes.INTEGER,  // 4 | 5 | 6 | 7
            allowNull: true,
        },
    }, {
        tableName: "nba_picks",
        timestamps: true,
        indexes: [
            {
                unique: true,
                fields: ["user_id", "series_id"],  // one pick per user per series
            },
        ],
    });
    return NbaPicks;
};