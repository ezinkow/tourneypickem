module.exports = (sequelize, DataTypes) => {
    const PicksBracket = sequelize.define('PicksBracket', {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        user_id: { type: DataTypes.INTEGER, allowNull: false },
        game_id: { type: DataTypes.STRING(255), allowNull: false },
        pick: { type: DataTypes.STRING(255), allowNull: true },
    }, {
        tableName: "bracket_picks",
        timestamps: false,
        indexes: [{ unique: true, fields: ['user_id', 'game_id'] }],
        createdAt: "createdAt",
        updatedAt: false,
        indexes: [{ unique: true, fields: ['user_id', 'game_id'] }]
    });

    PicksBracket.associate = (models) => {
        PicksBracket.belongsTo(models.UsersBracket, { foreignKey: 'user_id' });
        PicksBracket.belongsTo(models.GamesBracket, { foreignKey: 'game_id', targetKey: 'id' });
    };

    return PicksBracket;
};