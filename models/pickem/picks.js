module.exports = (sequelize, DataTypes) => {
    const PicksPickem = sequelize.define('PicksPickem', {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        user_id: { type: DataTypes.INTEGER, allowNull: false },
        game_id: { type: DataTypes.STRING(255), allowNull: false },
        pick: { type: DataTypes.STRING(255), allowNull: true },
        game_date: { type: DataTypes.DATE, allowNull: true },
        missed_pick_flag: { type: DataTypes.BOOLEAN, defaultValue: false },
    }, {
        tableName: "pickem_picks",
        timestamps: true,
        createdAt: "createdAt",
        updatedAt: false,
        indexes: [{ unique: true, fields: ['user_id', 'game_id'] }]
    });

    PicksPickem.associate = (models) => {
        PicksPickem.belongsTo(models.UsersPickem, { foreignKey: 'user_id' });
        PicksPickem.belongsTo(models.GamesPickem, { foreignKey: 'game_id', targetKey: 'id' });
    };

    return PicksPickem;
};